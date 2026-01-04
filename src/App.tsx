import React, {ReactNode} from 'react';
import {Link} from 'gatsby';
import './normalize.css';
import './style.scss';

function App({children}: {children?: ReactNode}) {
  return <>
    <div className="header">
      <div className="logo">
        <Link to="/"><img src={"/images/spaceship02.svg"} alt="York SciFi Book Club"/></Link>
      </div>
      <ul className="nav">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/meetings">Past meetings</Link></li>
        <li><Link to="/books">Previous books</Link></li>
        <li><Link to="/posts">Messages</Link></li>
      </ul>
    </div>

    {children}

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
