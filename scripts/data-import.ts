import {createClient} from 'contentful-management'
import dotenv from 'dotenv'
import moment from "moment/moment";
import {getSourceMeetings} from "./data-import/get-source-data";
import {locationFunctions} from "./data-import/locationFunctions";
import {MeetingData, meetingFunctions} from "./data-import/meeting-functions";
import {bookFunctions} from "./data-import/book-functions";
import {shortFunctions} from "./data-import/short-functions";
import {filmFunctions} from "./data-import/film-functions";

dotenv.config()

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
  const {createOrUpdateMeeting, updateMeetingWithBook, updateMeetingWithShort, updateMeetingWithFilm} = meetingFunctions(client, getContentfulLocation);
  const {createOrUpdateBook} = bookFunctions(client);
  const {createOrUpdateShort} = shortFunctions(client);
  const {createOrUpdateFilm} = filmFunctions(client);

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

    const shortData = sourceMeeting.short
    if (shortData) {
      const shortEntry = await createOrUpdateShort(meetingEntry, shortData);
      await updateMeetingWithShort(meetingEntry, shortEntry.sys.id)
    }

    const filmData = sourceMeeting.film
    if (filmData) {
      const filmEntry = await createOrUpdateFilm(meetingEntry, filmData);
      await updateMeetingWithFilm(meetingEntry, filmEntry.sys.id)
    }
  }
}

main().then(() => {
  console.log("\n\n----\nDone")
});
