import React, {useEffect, useState} from "react";
import {Route, Switch} from "react-router-dom";
import {LoadingSpinner} from "../LoadingSpinner";
import {Meetings} from "../Meetings";
import {Books} from "../Books";

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
    return <Switch>
      <Route path={"/meetings"}>
        <h1 className="books">Meetings</h1>
        <Meetings meetings={meetings}/>
      </Route>
      <Route path={"/books"}>
        <h1 className="books">Books</h1>
        <Books meetings={meetings} type="book"/>
      </Route>
      <Route path={"/shorts"}>
        <h1 className="books">Shorts</h1>
        <Books meetings={meetings} type="short"/>
      </Route>
      <Route path={"/films"}>
        <h1 className="books">Films</h1>
        <Books meetings={meetings} type="film"/>
      </Route>
    </Switch>;
  }
};

export default MeetingsLoader;
