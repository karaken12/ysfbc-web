import {translateContentfulBook, translateContentfulFilm, translateContentfulShort} from "./translateContentfulMedia";
import {Meeting} from "../types/meeting";

export const translateContentfulMeeting = (meeting: Queries.ContentfulMeeting) => {
  const currentMeeting: Meeting = {
    name: meeting.title,
    date: meeting.date,
    where: meeting.location?.name,
  }
  currentMeeting.book = meeting.book ? translateContentfulBook(meeting.book, currentMeeting) : undefined
  currentMeeting.short = meeting.short ? translateContentfulShort(meeting.short, currentMeeting) : undefined
  currentMeeting.film = meeting.film ? translateContentfulFilm(meeting.film, currentMeeting) : undefined
  return currentMeeting;
};
