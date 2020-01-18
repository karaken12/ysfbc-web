import React, {useEffect, useState} from "react";
import {LoadingSpinner} from "../LoadingSpinner";
import Meeting from "../Meeting";
import ErrorMessage from "../ErrorMessage";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';

const AsyncLoader = (props) => {
  const [errorMessage, setErrorMessage] = useState(null);
  const setData = props.setData;
  const serviceUrl = props.serviceUrl;

  async function fetchData() {
    const res = await fetch(serviceUrl);
    res.json()
      .then(result => {
        setData(result);
      })
      .catch(e => {
        console.log(e);
        setErrorMessage('An error occurred!');
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (errorMessage) {
    return <ErrorMessage message={errorMessage}/>
  } else {
    return <LoadingSpinner/>;
  }
};

const CurrentMeetingLoader = () => {
  const [meeting, setMeeting] = useState(null);

  if (meeting) {
    return <Meeting meeting={meeting} isCurrent={true}/>;
  } else {
    return <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} setData={setMeeting}/>;
  }
};

export default CurrentMeetingLoader;
