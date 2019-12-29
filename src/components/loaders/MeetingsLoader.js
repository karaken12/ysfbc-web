import React, {useEffect, useState} from "react";
import {LoadingSpinner} from "../LoadingSpinner";
import {Meetings} from "../Meetings";

const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const MeetingsLoader = () => {
  const [meetings, setMeetings] = useState({});
  const [isLoading, setLoading] = useState(true);

  async function fetchData() {
    const res = await fetch(MEETINGS_SERVICE_URL);
    res.json()
      .then(result => {
        setMeetings(result);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
      })
  }

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner/>
  } else {
    return <Meetings meetings={meetings}/>;
  }
};

export default MeetingsLoader;
