import React, {useEffect, useState} from "react";
import {Book} from "./Meeting";

const MEETINGS_SERVICE_URL = 'http://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const Books = (props) => {
  const [meetings, setMeetings] = useState({});
  const type = props.type;

  async function fetchData() {
    const res = await fetch(MEETINGS_SERVICE_URL);
    res.json()
      .then(result => setMeetings(result))
      .catch(e => {
        console.error(e);
      })
  }

  useEffect(() => {
    fetchData();
  }, []);


  return <>
    <div className="books">
      {Object.entries(meetings).map((entry) => {
        var meeting = entry[1];
        return (meeting[type] === undefined) ? null : (
          <Book {...(meeting[type])} type={type} key={meeting.name}/>
        );
      })}
    </div>
  </>
};

export default Books;
