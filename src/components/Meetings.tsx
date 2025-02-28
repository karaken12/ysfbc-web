import React from "react";
import Meeting from "./Meeting";
import {Meeting as MeetingType} from "../data/types/meeting";

export const Meetings = (
  {
    meetings,
  }: {
    meetings: Array<MeetingType>,
  }
) => (
  <>
    {Object.entries(meetings).map((entry) => {
      const meeting = entry[1];
      return <Meeting meeting={meeting} key={meeting.name}/>;
    })}
  </>
);
