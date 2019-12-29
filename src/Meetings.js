import React from "react";
import Meeting from "./Meeting";

export function Meetings(props) {
  const meetings = props.meetings;

  return <>
    <h1 className="books">Meetings</h1>
    {Object.entries(meetings).map((entry) => {
      var meeting = entry[1];
      return <Meeting meeting={meeting} key={meeting.name}/>;
    })}
  </>;
}
