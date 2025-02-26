import {EntryProps, PlainClientAPI} from "contentful-management";
import {ContentfulEntryLink, createEntryLink, deepEqual, localise, Localised} from "./utils";

export type MeetingData = {
  title: string;
  date: string;
  location?: string;
  facebookUrl?: string;
};

export type ContentfulMeeting = {
  title: Localised<string>;
  date: Localised<string>;
  location?: Localised<ContentfulEntryLink>;
  facebookUrl?: Localised<string>;
  book?: Localised<ContentfulEntryLink>;
};

export const meetingFunctions = (client: PlainClientAPI, getContentfulLocation: (where: string) => Promise<any>) => {
  const getMeetingFields = async (meeting: MeetingData): Promise<ContentfulMeeting> => {
    const location = meeting.location ? await getContentfulLocation(meeting.location) : undefined

    return {
      title: localise(meeting.title),
      date: localise(meeting.date),
      ...(meeting.location ? {location: localise(createEntryLink(location.sys.id))} : {}),
      ...(meeting.facebookUrl ? {facebookUrl: localise(meeting.facebookUrl)} : {}),
    };
  };

  const createOrUpdateMeeting = async (meeting: MeetingData): Promise<EntryProps<ContentfulMeeting>> => {
    console.log(`Fetching meeting data for ${(meeting.title)}`)
    const entries = await client.entry.getMany<ContentfulMeeting>({
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
      return client.entry.create<ContentfulMeeting>(
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
      return client.entry.update<ContentfulMeeting>(
        {entryId: entry.sys.id},
        {
          ...entry,
          fields,
        }
      )
    }
  };

  const updateMeetingWithBook = async (
    meetingEntry: EntryProps<ContentfulMeeting>,
    bookEntryId: string
  ): Promise<EntryProps<ContentfulMeeting>> => {
    const fields = {
      ...meetingEntry.fields,
      book: localise(createEntryLink(bookEntryId)),
    };

    if (deepEqual(meetingEntry.fields, fields)) {
      return meetingEntry
    }

    console.log(`Updating meeting ${meetingEntry.fields.title["en-GB"]} with book ID ${bookEntryId}`)
    return client.entry.update<ContentfulMeeting>(
      {entryId: meetingEntry.sys.id},
      {
        ...(meetingEntry),
        fields,
      }
    )
  };

  return {createOrUpdateMeeting, updateMeetingWithBook};
};
