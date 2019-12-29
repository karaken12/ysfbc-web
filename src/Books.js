import React, {useEffect, useState} from "react";
import {Book} from "./Meeting";

const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const Books = (props) => {
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
    return <h1>Loading...</h1>;
  } else {
    return <>
      <div className="books">
        {Object.entries(meetings).map((entry) => {
          var meeting = entry[1];
          return (meeting[type] === undefined) ? null : (
            <Book {...(meeting[type])} type={type} key={meeting.name}/>
          );
        })}
      </div>
    </>;
  }
};

export default Books;
