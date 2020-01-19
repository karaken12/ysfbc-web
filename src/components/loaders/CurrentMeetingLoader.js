import React from "react";
import Meeting from "../Meeting";
import AsyncLoader from "./AsyncLoader";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';

const CurrentMeetingLoader = ({meeting, setMeeting}) => (
  <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} data={meeting} setData={setMeeting}>
    <Meeting meeting={meeting} isCurrent={true}/>;
  </AsyncLoader>
);

export default CurrentMeetingLoader;
