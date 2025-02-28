import React, {ReactNode} from 'react';
import {Link} from 'gatsby';
import {Meeting as MeetingType} from "../data/types/meeting";
import {MediaType, Media} from "../data/types/media";

const Book = (
  {
    isCurrent,
    meeting,
    type,
  }: {
    meeting: MeetingType,
    type: MediaType,
    isCurrent?: boolean,
  }
) => {
  const book = meeting[type];
  if (!book) {
    return;
  }

  return (
    <section className="book">
      {isCurrent && CurrentHeader(type)}
      {Header(book)}
      {BookImage(book)}
      {book['store-links'] && StoreLinks(book)}
      {book['info-links'] && AdditionalInfo(book)}
      {MeetingName(book)}
      {isCurrent && PreviousLink(type)}
    </section>
  );
};

const CurrentHeader = (type: MediaType) => {
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
};

const Header = (
  {
    title,
    author,
  }: {
    title: string,
    author?: string,
  }
) => (
  <header>
    <h2>{title}</h2>
    {author && (
      <p>by {author}</p>)
    }
  </header>
);

const BookImage = (
  {
    image,
    title,
    "img-url": imgUrl,
  }: {
    image?: ReactNode,
    title: string,
    "img-url": string,
  }
) => {
  if (image) {
    return <div className="bookimg">
      {image}
    </div>;
  }
  return <div className="bookimg">
    <img src={"https://www-assets.yorkscifibookclub.co.uk" + imgUrl} alt={title}/>
  </div>;
};

const StoreLinks = ({'store-links': storeLinks}: Media) => {
  return (
    <ul className="affiliate-links">
      {storeLinks.map((link) =>
        <li key={link.url}><a className={link.class} href={link.url}>{link.name}</a></li>
      )}
    </ul>
  );
};

const AdditionalInfo = ({'info-links': infoLinks}: Media) => {
  return (
    <ul className="info-links">
      {infoLinks.map((link) =>
        <li key={link.url}><a className={link.class} href={link.url}>{link.name}</a></li>
      )}
    </ul>
  );
};

const MeetingName = ({meeting_for: meetingFor}: Media) => {
  return <p className="meeting">{meetingFor}</p>;
};

const PreviousLink = (type: MediaType) => {
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
};

export default Book;
