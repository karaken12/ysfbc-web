import React, {useEffect, useState} from "react";
import Meeting from "./Meeting";

const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const Meetings = () => {
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
    return <h1>Loading...</h1>;
  } else {
    return <>
      <h1 className="books">Meetings</h1>
      {Object.entries(meetings).map((entry) => {
        var meeting = entry[1];
        return (
          <Meeting
            key={meeting.name}
            name={meeting.name}
            where={meeting.where}
            facebook={meeting.facebook}
            date={meeting.date}
            book={meeting.book}
            short={meeting.short}
            film={meeting.film}
            isCurrent={false}
          />
        )
      })}
    </>;
  }
};

export default Meetings;
