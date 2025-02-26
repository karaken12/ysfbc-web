import {PlainClientAPI} from "contentful-management";

export type MeetingData = {
  title: string;
  date: string;
  location?: string;
  facebookUrl?: string;
};

const deepEqual = (lhs: object, rhs: object) => {
  // A hack to check for deep equality
  return JSON.stringify(lhs) === JSON.stringify(rhs);
};

export const meetingFunctions = (client: PlainClientAPI, getContentfulLocation: (where: string) => Promise<any>) => {
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

  return {createOrUpdateMeeting, updateMeetingWithBook};
};