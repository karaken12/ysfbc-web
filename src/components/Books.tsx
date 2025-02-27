import React from "react";
import Book from "./Book";
import {Meeting as MeetingType} from "../data/types/meeting";

type BooksParams = { meetings: Array<MeetingType>, type: 'book' | 'short' | 'film' };

export function Books(props: BooksParams) {
  const type = props.type;
  const meetings = props.meetings;

  return <>
    <div className="books">
      {Object.entries(meetings).map((entry) => {
        var meeting = entry[1];
        return (meeting[type] === undefined) ? null : (
          <Book meeting={meeting} type={type} key={meeting.name}/>
        );
      })}
    </div>
  </>;
}
