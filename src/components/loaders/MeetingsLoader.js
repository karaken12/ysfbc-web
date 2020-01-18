import React, {useState} from "react";
import {Route, Switch} from "react-router-dom";
import {Meetings} from "../Meetings";
import {Books} from "../Books";
import AsyncLoader from "./AsyncLoader";

const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const MeetingsLoader = () => {
  const [meetings, setMeetings] = useState(null);

  if (meetings) {
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
  } else {
    return <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} setData={setMeetings}/>;
  }
};

export default MeetingsLoader;
