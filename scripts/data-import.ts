import {createClient} from 'contentful-management'
import dotenv from 'dotenv'
import moment from "moment/moment";
import {getSourceMeetings, SourceBookData} from "./data-import/get-source-data";
import {locationFunctions} from "./data-import/locationFunctions";

dotenv.config()

type MeetingData = {
  title: string;
  date: string;
  location?: string;
  facebookUrl?: string;
};

const deepEqual = (lhs: object, rhs: object) => {
  // A hack to check for deep equality
  return JSON.stringify(lhs) === JSON.stringify(rhs);
};

const main = async () => {
  const accessToken = process.env.CONTENTFUL_MANAGEMENT_API_TOKEN;
  if (!accessToken) {
    throw new Error('No access token provided');
  }

  const client = createClient(
    {
      accessToken,
    },
    {
      type: 'plain',
      defaults: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        environmentId: 'master',
      },
    }
  )

  const {getContentfulLocation} = locationFunctions(client);

  const getMeetingFields = async (meeting: MeetingData) => {
    const location = meeting.location ? await getContentfulLocation(meeting.location) : undefined

    return {
      title: {"en-GB": meeting.title},
      date: {"en-GB": meeting.date},
      ...(meeting.location ? {location: {"en-GB": {sys: {type: 'Link', linkType: 'Entry', id: location.sys.id}}}} : {}),
      ...(meeting.facebookUrl ? {facebookUrl: {"en-GB": meeting.facebookUrl}} : {}),
    };
  };

  const createOrUpdateMeeting = async (meeting: MeetingData) => {
    console.log(`Fetching meeting data for ${(meeting.title)}`)
    const entries = await client.entry.getMany({
      query: {
        content_type: 'meeting',
        'fields.title': meeting.title,
        limit: 2,
      },
    })

    if (entries.total > 1) {
      throw new Error(`Too many entries for ${meeting.title} (${entries.total})`)
    }

    if (entries.total == 0) {
      console.log(`Creating meeting ${(meeting.title)}`)
      return client.entry.create(
        {contentTypeId: 'meeting'},
        {fields: await getMeetingFields(meeting)}
      )
    } else {
      const entry = entries.items[0]
      const fields = {
        ...entry.fields,
        ...(await getMeetingFields(meeting)),
      };
      if (deepEqual(entry.fields, fields)) {
        return entry
      }

      console.log(`Updating meeting ${(meeting.title)}`)
      return client.entry.update(
        {entryId: entry.sys.id},
        {
          ...entry,
          fields,
        }
      )
    }
  };

  const getBookFields = (bookData: SourceBookData) => {
    const hasStoreLinks = bookData["store-links"] && bookData["store-links"].length > 0;

    return ({
      title: {"en-GB": bookData.title},
      author: {"en-GB": bookData.author},
      slug: {"en-GB": bookData.slug},
      ...(hasStoreLinks ? {storeLinks: {"en-GB": bookData["store-links"]}} : {}),
    });
  };

  const updateInfoLinks = async (bookEntry, bookData: SourceBookData) => {
    const existingLinks = (bookEntry.fields.infoLinks?.['en-GB'] ?? []).map(entry => entry.sys.id)
    const linkEntries = []
    for (const linkId of existingLinks) {
      const entry = await client.entry.get({entryId: linkId})
      linkEntries.push(entry)
    }
    const infoLinkData = bookData["info-links"] ?? [];

    if (deepEqual(
      linkEntries.map(entry => [entry.fields.class['en-GB'], entry.fields.url['en-GB']]),
      infoLinkData.map(entry => [entry.class, entry.url])
    )) {
      return bookEntry
    }

    console.log(`Updating info links for ${bookData.title}`);

    if (linkEntries.length == 0) {
      // create new entries
      const infoLinkRefs = []
      for (const data of infoLinkData) {
        console.log(`Creating ${data.class} info link`)
        const newInfoLinkEntry = await client.entry.create({contentTypeId: 'infoLink'}, {
          fields: {
            "class": {"en-GB": data.class},
            "url": {"en-GB": data.url},
          }
        })
        infoLinkRefs.push(
          {sys: {type: 'Link', linkType: 'Entry', id: newInfoLinkEntry.sys.id}}
        )
      }
      // add entries to bookEntry
      return await client.entry.update({entryId: bookEntry.sys.id},
        {
          ...(bookEntry),
          fields: {
            ...bookEntry.fields,
            infoLinks: {"en-GB": infoLinkRefs},
          }
        }
      )
    } else if (linkEntries.length == infoLinkData.length) {
      // update existing entries
      const zipped = linkEntries.map((entry, i) => ({entry, data: infoLinkData[i]}))
      for (const {entry, data} of zipped) {
        const fields = {
          "class": {"en-GB": data.class},
          "url": {"en-GB": data.url},
        };
        if (deepEqual(entry.fields, fields)) {
          continue;
        }
        console.log(`Updating ${data.class} info link`)
        await client.entry.update(
          {entryId: entry.sys.id},
          {
            ...entry,
            fields,
          }
        );
      }
      return bookEntry;
    } else {
      throw new Error(`Info links for ${bookData.title} require manual intervention (${infoLinkData.length} expected; ${linkEntries.length} found)`)
    }
  };

  const createOrUpdateBook = async (meetingEntry, bookData: SourceBookData) => {
    if (meetingEntry.fields.book) {
      const bookEntryId = meetingEntry.fields.book['en-GB'].sys.id;
      const bookEntry = await updateBookEntry(bookEntryId, bookData);
      return await updateInfoLinks(bookEntry, bookData)
    } else {
      const bookEntry = await createBookEntry(bookData);
      return await updateInfoLinks(bookEntry, bookData)
    }
  };

  const createBookEntry = async (bookData: SourceBookData) => {
    const fields = getBookFields(bookData);
    console.log(`Creating book ${fields.title["en-GB"]}`)
    return client.entry.create(
      {contentTypeId: 'book'},
      {
        fields,
      }
    )
  };

  const updateBookEntry = async (entryId: string, bookData: SourceBookData) => {
    const entry = await client.entry.get({entryId})
    const fields = {
      ...entry.fields,
      ...(getBookFields(bookData)),
    };

    if (deepEqual(entry.fields, fields)) {
      return entry
    }

    console.log(`Updating book ${entry.fields.title["en-GB"]}`)
    return client.entry.update(
      {entryId: entry.sys.id},
      {
        ...entry,
        fields,
      }
    )
  };

  const updateMeetingWithBook = async (meetingEntry, bookEntryId: string) => {
    const fields = {
      ...meetingEntry.fields,
      book: {"en-GB": {sys: {type: 'Link', linkType: 'Entry', id: bookEntryId}}},
    };

    if (deepEqual(meetingEntry.fields, fields)) {
      return meetingEntry
    }

    console.log(`Updating meeting ${meetingEntry.fields.title["en-GB"]} with book ID ${bookEntryId}`)
    return client.entry.update(
      {entryId: meetingEntry.sys.id},
      {
        ...(meetingEntry),
        fields,
      }
    )
  };
  const sourceMeetings = await getSourceMeetings();
  for(const sourceMeeting of sourceMeetings) {
    const meeting: MeetingData = {
      title: sourceMeeting.name,
      date: moment(Date.parse(sourceMeeting.date)).toISOString(),
      location: sourceMeeting.where,
      ...(sourceMeeting.facebook ? {
        facebookUrl: `https://www.facebook.com/events/${sourceMeeting.facebook.event_id}/`
      } : {}),
    }
    const meetingEntry = await createOrUpdateMeeting(meeting);

    const bookData = sourceMeeting.book
    if (bookData) {
      const bookEntry = await createOrUpdateBook(meetingEntry, bookData);
      await updateMeetingWithBook(meetingEntry, bookEntry.sys.id)
    }
  }
}

main().then(() => {
  console.log("\n\n----\nDone")
});
