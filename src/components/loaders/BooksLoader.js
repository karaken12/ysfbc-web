import React, {useEffect, useState} from "react";
import {LoadingSpinner} from "../LoadingSpinner";
import {Books} from "../Books";

const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const BooksLoader = (props) => {
  const [meetings, setMeetings] = useState({});
  const [isLoading, setLoading] = useState(true);
  const type = props.type;

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
    return <Books meetings={meetings} type={type}/>;
  }
};

export default BooksLoader;
