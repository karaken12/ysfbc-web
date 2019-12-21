import React from 'react';
import './normalize.css';
import './style.css';
import Meeting from "./Meeting";

function App() {
  var meeting = {"date":"2019-12-19 19:00:00 +0000","where":"The Cross Keys","facebook":{"event_id":353283112176655},"name":"December 2019","book":{"title":"Lord of Light","author":"Roger Zelazny","meeting_for":"December 2019","slug":"lord-of-light","image-source":"https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1465576796l/8493781._SY475_.jpg","info-links":[{"name":"ISFDB","class":"isfdb","url":"http://www.isfdb.org/cgi-bin/title.cgi?1611"},{"name":"GoodReads","class":"goodreads","url":"https://www.goodreads.com/book/show/13821.Lord_of_Light"}],"store-links":[{"name":"Amazon paperback","class":"amazon","url":"https://www.amazon.co.uk/Lord-Light-MASTERWORKS-Roger-Zelazny/dp/0575094214"},{"name":"Amazon Kindle","class":"kindle","url":"https://www.amazon.co.uk/Lord-Light-Roger-Zelazny-ebook/dp/B07MSJZDFX"}],"ptype":"books","img-url":"/images/books/2019/lord-of-light.jpg"},"short":{"title":"Christmas Wedding","author":"Vylar Kaftan","meeting_for":"December 2019","slug":"christmas-wedding","image-source":"https://vylarkaftan.files.wordpress.com/2009/04/warrior_wisewoman.jpg","info-links":[{"name":"ISFDB","class":"isfdb","url":"http://www.isfdb.org/cgi-bin/title.cgi?1151999"},{"name":"GoodReads","class":"goodreads","url":"https://www.goodreads.com/book/show/19092067-christmas-wedding"}],"store-links":[{"name":"Escape Pod (free)","class":"escapepod free","url":"http://escapepod.org/2010/12/23/ep272-christmas-wedding"},{"name":"Giganotosaurus","class":"web free","url":"http://giganotosaurus.org/2013/12/01/christmas-wedding/"}],"ptype":"shorts","img-url":"/images/shorts/2019/christmas-wedding.jpg"},"film":{"title":"The Castle of Cagliostro","meeting_for":"December 2019","slug":"castle-of-cagliostro","image-source":"https://images.justwatch.com/poster/58748733/s592","info-links":[{"name":"IMDB","class":"imdb","url":"https://www.imdb.com/title/tt0079833"},{"name":"JustWatch","class":"justwatch","url":"https://www.justwatch.com/uk/movie/lupin-the-third-the-castle-of-cagliostro"}],"store-links":[{"name":"Netfix","class":"netflix","url":"https://www.netflix.com/title/0050576"}],"ptype":"films","img-url":"/images/films/2019/castle-of-cagliostro.jpg"}};

  return (
    <>

      <div className="header">
        <div className="logo">
          <img src={"/images/spaceship02.svg"} alt="York SciFi Book Club"/>
        </div>
        <ul className="nav">
          <li><a href="/">Home</a></li>
          <li><a href="https://www.facebook.com/YorkSciFiBookClub">Facebook</a></li>
          <li><a href="https://twitter.com/YorkSFBookClub">Twitter</a></li>
        </ul>
      </div>

      <Meeting
          key={meeting.name}
          name={meeting.name}
          where={meeting.where}
          facebook={meeting.facebook}
          date={meeting.date}
          book={meeting.book}
          short={meeting.short}
          film={meeting.film}
          isCurrent={true}
      />

        <div className="footer">
            <p>The York SciFi Book Club is pretty awesome, but they don't pay me to do this, so sorry if it's a bit
                rough.<br/>
                That said, if you have any comments, you can email me at <a
                    href="mailto:webz@yorkscifibookclub.co.uk">webz@yorkscifibookclub.co.uk</a>.</p>
            <p>
                Background image reproduced by permission of <a href="http://www.wojtala.com/">Maciej Wojtala</a>.
            </p>
        </div>
    </>

  );
}

export default App;
