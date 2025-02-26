import {createClient, EntryProps} from 'contentful-management'
import dotenv from 'dotenv'
import moment from "moment/moment";
import {getSourceMeetings, SourceBookData} from "./data-import/get-source-data";
import {locationFunctions} from "./data-import/locationFunctions";
import {ContentfulMeeting, MeetingData, meetingFunctions} from "./data-import/meeting-functions";
import {ContentfulEntryLink, createEntryLink, deepEqual, localise, Localised} from "./data-import/utils";

dotenv.config()

type ContentfulBook = {
  title: Localised<string>;
  author: Localised<string>;
  slug: Localised<string>;
  infoLinks?: Localised<Array<ContentfulEntryLink>>;
  storeLinks?: Localised<object | object[] | undefined>;
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
  const {createOrUpdateMeeting, updateMeetingWithBook} = meetingFunctions(client, getContentfulLocation);

  const getBookFields = (bookData: SourceBookData): ContentfulBook => {
    const hasStoreLinks = bookData["store-links"] && bookData["store-links"].length > 0;

    return ({
      title: localise(bookData.title),
      author: localise(bookData.author),
      slug: localise(bookData.slug),
      ...(hasStoreLinks ? {storeLinks: localise(bookData["store-links"])} : {}),
    });
  };

  const updateInfoLinks = async (bookEntry: EntryProps<ContentfulBook>, bookData: SourceBookData): Promise<EntryProps<ContentfulBook>> => {
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
            "class": localise(data.class),
            "url": localise(data.url),
          }
        })
        infoLinkRefs.push(createEntryLink(newInfoLinkEntry.sys.id));
      }
      // add entries to bookEntry
      return await client.entry.update<ContentfulBook>({entryId: bookEntry.sys.id},
        {
          ...(bookEntry),
          fields: {
            ...bookEntry.fields,
            infoLinks: localise(infoLinkRefs),
          }
        }
      )
    } else if (linkEntries.length == infoLinkData.length) {
      // update existing entries
      const zipped = linkEntries.map((entry, i) => ({entry, data: infoLinkData[i]}))
      for (const {entry, data} of zipped) {
        const fields = {
          "class": localise(data.class),
          "url": localise(data.url),
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

  const createOrUpdateBook = async (meetingEntry: EntryProps<ContentfulMeeting>, bookData: SourceBookData): Promise<EntryProps<ContentfulBook>> => {
    if (meetingEntry.fields.book) {
      const bookEntryId = meetingEntry.fields.book['en-GB'].sys.id;
      const bookEntry = await updateBookEntry(bookEntryId, bookData);
      return await updateInfoLinks(bookEntry, bookData)
    } else {
      const bookEntry = await createBookEntry(bookData);
      return await updateInfoLinks(bookEntry, bookData)
    }
  };

  const createBookEntry = async (bookData: SourceBookData): Promise<EntryProps<ContentfulBook>> => {
    const fields = getBookFields(bookData);
    console.log(`Creating book ${fields.title["en-GB"]}`)
    return client.entry.create<ContentfulBook>(
      {contentTypeId: 'book'},
      {
        fields,
      }
    )
  };

  const updateBookEntry = async (entryId: string, bookData: SourceBookData): Promise<EntryProps<ContentfulBook>> => {
    const entry = await client.entry.get<ContentfulBook>({entryId})
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
