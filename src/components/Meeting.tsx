import React from 'react';
import Book from "./Book";
import Moment from "react-moment";
import moment from "moment";
import {Meeting as MeetingType} from "../data/types/meeting";

const Meeting = (
  {
    meeting,
    isCurrent = false,
  }: {
    meeting: MeetingType,
    isCurrent?: boolean,
  }
) => {
  const meetingName = (isCurrent ? "Next Meeting - " : '') + meeting.name;

  return (
    <div className="meeting">
      <div className="next-meeting">
        <h1>{meetingName}</h1>
        <p>
          <Moment format="kk:mm, dddd MMMM Do">{moment.utc(meeting.date)}</Moment>
          {meeting.where != null && (<span> at {meeting.where}. </span>)}
        </p>
      </div>
      <div className="books">
        {meeting.book && <Book meeting={meeting} type="book" isCurrent={isCurrent}/>}
        {meeting.short && <Book meeting={meeting} type="short" isCurrent={isCurrent}/>}
        {meeting.film && <Book meeting={meeting} type="film" isCurrent={isCurrent}/>}
      </div>
    </div>
  );
};

export default Meeting;
