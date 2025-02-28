import React from "react";
import Book from "./Book";
import {Meeting} from "../data/types/meeting";

export const Books = (
  {
    type,
    meetings,
  }: {
    meetings: Array<Meeting>,
    type: 'book' | 'short' | 'film',
  }
) => (
  <>
    <div className="books">
      {Object.entries(meetings).map((entry) => {
        var meeting = entry[1];
        return (meeting[type] === undefined) ? null : (
          <Book meeting={meeting} type={type} key={meeting.name}/>
        );
      })}
    </div>
  </>
);
