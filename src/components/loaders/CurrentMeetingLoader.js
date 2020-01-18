import React from "react";
import Meeting from "../Meeting";
import AsyncLoader from "./AsyncLoader";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';

const CurrentMeetingLoader = ({meeting, setMeeting}) => {
  if (meeting) {
    return <Meeting meeting={meeting} isCurrent={true}/>;
  } else {
    return <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} setData={setMeeting}/>;
  }
};

export default CurrentMeetingLoader;
