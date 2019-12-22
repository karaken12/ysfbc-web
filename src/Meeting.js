import React from 'react';
import {Link} from "react-router-dom";

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

export function Book(props) {
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
        {/*<img src={props["img-url"]} alt={props.title}/>*/}
        <img src={"https://s3-eu-west-1.amazonaws.com/www.yorkscifibookclub.co.uk" + props["img-url"]} alt={props.title}/>
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
    return (
        <ul className="info-links">
            {props['info-links'].map((link) =>
                <li key={link.url}><a className={link.class} href={link.url}>{link.name}</a></li>
            )}
        </ul>
    );
}

function MeetingName(props) {
    return <p className="meeting">{props.meeting_for}</p>;
}

function PreviousLink(type) {
    switch (type) {
        case 'book':
            return (
                <div className="prevbooks"><Link to="/books">Previous books</Link></div>
            );
        case 'short':
            return (
                <div className="prevshorts"><Link to="/shorts">Previous short stories</Link></div>
            );
        case 'film':
            return (
                <div className="prevfilms"><Link to="/films">Previous films</Link></div>
            );
        default:
            return;
    }
}

export default Meeting;
