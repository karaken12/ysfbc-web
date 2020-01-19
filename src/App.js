import React, {useState} from 'react';
import {Link, Route, Switch} from "react-router-dom";
import './normalize.css';
import './style.scss';
import AsyncLoader from "./components/AsyncLoader";
import Meeting from "./components/Meeting";
import {Meetings} from "./components/Meetings";
import {Books} from "./components/Books";

const NEXT_MEETING_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/next_meeting.json';
const MEETINGS_SERVICE_URL = 'https://www-assets.yorkscifibookclub.co.uk/data/meetings.json';

function App() {
  const [currentMeeting, setCurrentMeeting] = useState(null);
  const [meetings, setMeetings] = useState(null);

  return <>
    <div className="header">
      <div className="logo">
        <Link to="/"><img src={"/images/spaceship02.svg"} alt="York SciFi Book Club"/></Link>
      </div>
      <ul className="nav">
        <li><Link to="/">Home</Link></li>
        <li><a href="https://www.facebook.com/YorkSciFiBookClub">Facebook</a></li>
        <li><a href="https://twitter.com/YorkSFBookClub">Twitter</a></li>
      </ul>
    </div>

    <Switch>
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
    </Switch>

    <div className="footer">
      <p>The York SciFi Book Club is pretty awesome, but they don't pay me to do this, so sorry if it's a bit
        rough.<br/>
        That said, if you have any comments, you can email me at <a
          href="mailto:webz@yorkscifibookclub.co.uk">webz@yorkscifibookclub.co.uk</a>.</p>
      <p>
        Background image reproduced by permission of <a href="http://www.wojtala.com/">Maciej Wojtala</a>.
      </p>
    </div>
  </>;
}

export default App;
