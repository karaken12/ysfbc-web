import {createClient} from 'contentful-management'
import dotenv from 'dotenv'
import moment from "moment/moment";

dotenv.config()

type SourceBookData = {
  title: string;
  author: string;
  meeting_for: string;
  "suggested-by"?: string;
  slug: string;
  "image-source": string;
  "info-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  "store-links"?: Array<{
    "name": string;
    "class": string;
    "url": string;
  }>;
  ptype: "books";
  "img-url": string;
};

type SourceMeetingData = {
  date: string;
  where: string;
  facebook?: { event_id: number },
  name: string;
  book: SourceBookData
  short: {
    title: string;
    author: string;
    meeting_for: string;
    slug: string;
    "image-source": string;
    "info-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    "store-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    ptype: "shorts";
    "img-url": string;
  }
  film: {
    title: string;
    meeting_for: string;
    slug: string;
    "image-source": string;
    "info-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    "store-links"?: Array<{
      "name": string;
      "class": string;
      "url": string;
    }>;
    ptype: "films";
    "img-url": string;
  }
};

type MeetingData = {
  title: string;
  date: string;
  location?: string;
  facebookUrl?: string;
};

async function fetchData() {
  const serviceUrl = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

  const res = await fetch(serviceUrl);
  return res.json();
}

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

  const locationCache = new Map<string, any>()

  async function createOrFetchLocation(where: string) {
    console.log(`Fetching location data for ${where}`)
    const entries = await client.entry.getMany({
      query: {
        content_type: 'location',
        'fields.name': where,
        limit: 2,
      },
    })

    if (entries.total > 1) {
      throw new Error(`Too many entries for ${where} (${entries.total})`)
    }

    if (entries.total != 0) {
      return entries.items[0]
    }

    console.log(`Creating location ${where}`)
    return client.entry.create(
      {contentTypeId: 'location'},
      {fields: {name: {"en-GB": where}}}
    )
  }

  const getContentfulLocation = async (where: string) => {
    if (!locationCache.has(where)) {
      locationCache.set(where, await createOrFetchLocation(where))
    }

    return locationCache.get(where);
  };

  const createOrUpdateMeeting = async (meeting: MeetingData) => {
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

    const location = meeting.location ? await getContentfulLocation(meeting.location) : undefined

    const fields = {
      title: {"en-GB": meeting.title},
      date: {"en-GB": meeting.date},
      ...(meeting.location ? {location: {"en-GB": {sys: {type: 'Link', linkType: 'Entry', id: location.sys.id}}}} : {}),
      ...(meeting.facebookUrl ? {facebookUrl: {"en-GB": meeting.facebookUrl}} : {}),
    };

    if (entries.total == 0) {
      console.log(`Creating meeting ${(meeting.title)}`)
      return client.entry.create(
        {contentTypeId: 'meeting'},
        {fields}
      )
    } else {
      console.log(`Updating meeting ${(meeting.title)}`)
      const entry = entries.items[0]
      return client.entry.update(
        {entryId: entry.sys.id},
        {
          ...entry,
          fields: {
            ...entry.fields,
            ...fields,
          }
        }
      )
    }
  };

  const getBookFields = (bookData: SourceBookData) => ({
    title: {"en-GB": bookData.title},
    author: {"en-GB": bookData.author},
    slug: {"en-GB": bookData.slug},
  });

  const createOrUpdateBook = async (meetingEntry, bookData: SourceBookData) => {
    if (meetingEntry.fields.book) {
      const bookEntryId = meetingEntry.fields.book['en-GB'].sys.id;
      return await updateBookEntry(bookEntryId, bookData)
    } else {
      return await createBookEntry(bookData)
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

  const sourceMeetings: Array<SourceMeetingData> = Object.values(await fetchData())
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
