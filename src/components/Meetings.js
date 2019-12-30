import React from "react";
import Meeting from "./Meeting";

export function Meetings(props) {
  const meetings = props.meetings;

  return <>
    {Object.entries(meetings).map((entry) => {
      var meeting = entry[1];
      return <Meeting meeting={meeting} key={meeting.name}/>;
    })}
  </>;
}
