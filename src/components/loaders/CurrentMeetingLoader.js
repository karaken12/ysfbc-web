import React, {useState} from "react";
import Meeting from "../Meeting";
import AsyncLoader from "./AsyncLoader";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';

const CurrentMeetingLoader = () => {
  const [meeting, setMeeting] = useState(null);

  if (meeting) {
    return <Meeting meeting={meeting} isCurrent={true}/>;
  } else {
    return <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} setData={setMeeting}/>;
  }
};

export default CurrentMeetingLoader;
