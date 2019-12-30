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
      <Route path={"/meetings"}><Meetings meetings={meetings}/></Route>
      <Route path={"/books"}><Books meetings={meetings} type="book"/></Route>
      <Route path={"/shorts"}><Books meetings={meetings} type="short"/></Route>
      <Route path={"/films"}><Books meetings={meetings} type="film"/></Route>
    </Switch>;
  }
};

export default MeetingsLoader;
