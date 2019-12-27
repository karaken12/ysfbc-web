import React from 'react';
import './normalize.css';
import './style.scss';
import CurrentMeeting from "./CurrentMeeting";
import {Link, Route, Switch} from "react-router-dom";
import Meetings from "./Meetings";
import Books from "./Books";

function App() {
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
      <Route path={"/meetings"} component={Meetings}/>
      <Route path={"/books"}><Books type="book"/></Route>
      <Route path={"/shorts"}><Books type="short"/></Route>
      <Route path={"/films"}><Books type="film"/></Route>
      <Route path={"/"} component={CurrentMeeting}/>
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
