import React from "react";
import Meeting from "./Meeting";
import {Meeting as MeetingType} from "../data/types/meeting";

type MeetingsParams = { meetings: Array<MeetingType> };

export function Meetings(props: MeetingsParams) {
  const meetings = props.meetings;

  return <>
    {Object.entries(meetings).map((entry) => {
      var meeting = entry[1];
      return <Meeting meeting={meeting} key={meeting.name}/>;
    })}
  </>;
};
