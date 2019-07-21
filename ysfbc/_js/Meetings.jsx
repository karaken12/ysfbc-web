fetch('/data/meetings.json')
    .then(response => response.json())
    .then((jsonData) => {
        const next_meeting = Object.keys(jsonData)[0];
        ReactDOM.render(
            (
                <div>
                    <h1 className="books">Meetings</h1>
                    {Object.entries(jsonData).map((entry) => {
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
                                isCurrent={(meeting.name == next_meeting)}
                            />
                        )
                    })}
                </div>
            ),
            document.getElementById('root')
        );
    })
    .catch((error) => {
        console.error(error);
    });

function Meeting(props) {
    var meetingName = (props.isCurrent ? "Next Meeting - " : '') + props.name;
    return (
        <div className="meeting">
            <div className="next-meeting">
                <h1>{meetingName}</h1>
                <p>
                    {props.date}
                    {props.where != null && (<span> at {props.where}. </span>)}
                    {props.facebook && (
                        <a href={"https://www.facebook.com/events/" + props.facebook.event_id + "/"}>
                            <img src="../images/facebook-icon.png" alt="Facebook Event"
                                 style={{verticalAlign: 'text-top'}}/>
                        </a>
                    )}
                </p>
            </div>
            <div className="books">
                {props.book && <Book {...props.book} type="book" isCurrent={props.isCurrent}/>}
                {props.short && <Book {...props.short} type="short" isCurrent={props.isCurrent}/>}
                {props.film && <Book {...props.film} type="film" isCurrent={props.isCurrent}/>}
            </div>
        </div>
    );
}

function Book(props) {
    return (
        <section className="book">
            {props.isCurrent && CurrentHeader(props.type)}
            {Header(props)}
            {BookImage(props)}
            {props['store-links'] && StoreLinks(props)}
            {AdditionalInfo(props)}
            {MeetingName(props)}
            {props.isCurrent && PreviousLink(props.type)}
        </section>
    );
}

function CurrentHeader(type) {
    switch (type) {
        case 'book':
            return <h1>Current book</h1>;
        case 'short':
            return <h1>Current short story</h1>;
        case 'film':
            return <h1>Current film</h1>;
        default:
            return;
    }
}

function Header(props) {
    return <header>
        <h2>{props.title}</h2>
        {props.author && (
            <p>by {props.author}</p>)
        }
    </header>;
}

function BookImage(props) {
    return <div className="bookimg">
        <img src={props["img-url"]} alt={props.title}/>
    </div>;
}

function StoreLinks(props) {
    return (
        <ul className="affiliate-links">
            {props['store-links'].map((link) =>
                <li key={link.url}><a className={link.class} href={link.url}>{link.name}</a></li>
            )}
        </ul>
    );
}

function AdditionalInfo(props) {
    return <div>
        {props.isfdb &&
        <a className="isfdb" href={"http://www.isfdb.org/cgi-bin/title.cgi?" + props.isfdb}>ISFDB</a>}
        {" "}
        {props.goodreads &&
        <a className="goodreads" href={"http://www.goodreads.com/book/show/" + props.goodreads}>GoodReads</a>}
        {" "}
        {props.imdb && <a className="imdb" href={"http://www.imdb.com/title/" + props.imdb}>IMDB</a>}
    </div>;
}

function MeetingName(props) {
    return <p className="meeting">{props.meeting_for}</p>;
}

function PreviousLink(type) {
    switch (type) {
        case 'book':
            return (
                <div className="prevbooks"><a href="/books.html">Previous books</a></div>
            );
        case 'short':
            return (
                <div className="prevshorts"><a href="/shorts.html">Previous short stories</a></div>
            );
        case 'film':
            return (
                <div className="prevfilms"><a href="/films.html">Previous films</a></div>
            );
        default:
            return;
    }
}
