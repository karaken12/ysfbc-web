import {createClient} from 'contentful-management'

type MeetingData = {
  title: string;
  date: string;
  facebookUrl?: string;
};

const main = async () => {

  const client = createClient(
    {
      accessToken: 'xxx',
    },
    {
      type: 'plain',
      defaults: {
        spaceId: `3ygf5yadm911`,
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
      const response = await client.entry.create(
        {contentTypeId: 'meeting'},
        {fields}
      )
      console.log(response)
    } else {
      console.log(`Updating meeting ${(meeting.title)}`)
      const entry = entries.items[0]
      console.log(entry)
      const response = await client.entry.update(
        {entryId: entry.sys.id},
        {
          ...entry,
          fields: {
            ...entry.fields,
            ...fields,
          }
        }
      )
      console.log(response);
    }
  };

  const meeting = {
    title: 'July 2019',
    date: "2019-07-18T19:00+00:00",
    // location
    // facebookUrl: 'https://facebook.com/events/1858977807535469',
    // book
    // short
    // film
    /* fields: {
    title: { 'en-GB': 'July 2019' },
    date: { 'en-GB': '2019-07-18T19:00+00:00' },
    location: { 'en-GB': [Object] },
    facebookUrl: { 'en-GB': 'https://facebook.com/events/1858977807535469' } */
  }

  await createOrUpdateMeeting(meeting);
}

main().then(() => {
  console.log("\n\n----\nDone")
});
