import React, {useEffect, useState} from "react";
import Meeting from "./Meeting";
import {LoadingSpinner} from "./LoadingSpinner";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';

const CurrentMeeting = () => {
  const [meeting, setMeeting] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function fetchData() {
    const res = await fetch(NEXT_MEETING_SERVICE_URL);
    res.json()
      .then(result => {
        setMeeting(result);
        setLoading(false);
      })
      .catch(e => {
        console.log(e);
      });
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner/>
  } else {
    return <Meeting meeting={meeting} isCurrent={true}/>;
  }
};

export default CurrentMeeting;
