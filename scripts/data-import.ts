import {createClient} from 'contentful-management'
import dotenv from 'dotenv'
import moment from "moment/moment";

dotenv.config()

type SourceMeetingData = {
  date: string;
  where: string;
  facebook?: { event_id: number },
  name: string;
  book: {
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
    ptype: "books";
    "img-url": string;
  }
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
  facebookUrl?: string;
};

async function fetchData() {
  const serviceUrl = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

  const res = await fetch(serviceUrl);
  return res.json();
}

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

  const createOrUpdateMeeting = async (meeting: MeetingData) => {
    const entries = await client.entry.getMany({
      query: {
        content_type: 'meeting',
        'fields.title': meeting.title,
        limit: 10,
      },
    })

    if (entries.total > 1) {
      throw new Error(`Too many entries for ${(meeting.title)} (${entries.total})`)
    }

    const fields = {
      title: {"en-GB": meeting.title},
      date: {"en-GB": meeting.date},
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

  const sourceMeetings: Array<SourceMeetingData> = Object.values(await fetchData())
  for(const sourceMeeting of sourceMeetings) {
    const meeting: MeetingData = {
      title: sourceMeeting.name,
      date: moment(Date.parse(sourceMeeting.date)).toISOString(),
      ...(sourceMeeting.facebook ? {
        facebookUrl: `https://www.facebook.com/events/${sourceMeeting.facebook.event_id}/`
      } : {}),
    }
    await createOrUpdateMeeting(meeting);
  }
}

main().then(() => {
  console.log("\n\n----\nDone")
});
