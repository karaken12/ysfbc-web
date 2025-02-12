import React, {useState} from "react";
import AsyncLoader from "./AsyncLoader";
import {Meetings} from "./Meetings";
import {Books} from "./Books";
import Meeting from "./Meeting";
import Tweets from "./Tweets";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';
const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

export function TwitterPageContent() {
  const [meetings, setMeetings] = useState(null);

  return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
    <Tweets meetings={meetings}/>
  </AsyncLoader>;
}

export function MeetingsPageContent() {
  const [meetings, setMeetings] = useState(null);

  return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
    <h1 className="books">Meetings</h1>
    <Meetings meetings={meetings}/>
  </AsyncLoader>;
}

export function BooksPageContent() {
  const [meetings, setMeetings] = useState(null);

  return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
    <h1 className="books">Books</h1>
    <Books meetings={meetings} type="book"/>
  </AsyncLoader>;
}

export function ShortsPageContent() {
  const [meetings, setMeetings] = useState(null);

  return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
    <h1 className="books">Shorts</h1>
    <Books meetings={meetings} type="short"/>
  </AsyncLoader>;
}

export function FilmsPageContent() {
  const [meetings, setMeetings] = useState(null);

  return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
    <h1 className="books">Films</h1>
    <Books meetings={meetings} type="film"/>
  </AsyncLoader>;
}

export function IndexPageContent() {
  const [currentMeeting, setCurrentMeeting] = useState(null);

  return <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} state={[currentMeeting, setCurrentMeeting]}>
    <Meeting meeting={currentMeeting} isCurrent={true}/>;
  </AsyncLoader>;
}
