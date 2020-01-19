import React, {useState} from "react";
import {Route, Switch} from "react-router-dom";
import AsyncLoader from "./AsyncLoader";
import {Meetings} from "./Meetings";
import {Books} from "./Books";
import Meeting from "./Meeting";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';
const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

const PageContent = () => {
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [meetings, setMeetings] = useState(null);

  return <Switch>
    <Route path={"/(meetings|books|shorts|films)"}>
      <AsyncLoader serviceUrl={MEETINGS_SERVICE_URL} state={[meetings, setMeetings]}>
        <Switch>
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
      </AsyncLoader>
    </Route>
    <Route path={"/"}>
      <AsyncLoader serviceUrl={NEXT_MEETING_SERVICE_URL} state={[currentMeeting, setCurrentMeeting]}>
        <Meeting meeting={currentMeeting} isCurrent={true}/>;
      </AsyncLoader>
    </Route>
  </Switch>;
};

export default PageContent;
