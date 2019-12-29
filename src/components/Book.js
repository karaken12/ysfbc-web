import React from 'react';
import {Link} from "react-router-dom";

function Book(props) {
    const type = props.type;
    const meeting = props.meeting;
    const isCurrent = props.isCurrent;

    const book = meeting[type];
    return (
        <section className="book">
            {isCurrent && CurrentHeader(type)}
            {Header(book)}
            {BookImage(book)}
            {book['store-links'] && StoreLinks(book)}
            {AdditionalInfo(book)}
            {MeetingName(book)}
            {isCurrent && PreviousLink(type)}
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
        <img src={"https://www-assets.yorkscifibookclub.co.uk" + props["img-url"]} alt={props.title}/>
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

export default Book;
