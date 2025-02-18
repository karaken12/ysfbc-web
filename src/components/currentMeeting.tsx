import React from 'react'
// @ts-ignore
import Meeting from './Meeting.js'
import {graphql, useStaticQuery} from "gatsby";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import moment from "moment/moment";

const constructImageUrl = (type: string, year: number, slug: string, extension: string = 'jpg') =>
  `/images/${type}/${year}/${slug}.${extension}`;

type BookType = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: MeetingType;
  meeting_for: string;
  title: string;
  author: string;
  "img-url": string;
  image?: React.ReactElement;
};

type ShortType = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: MeetingType;
  meeting_for: string;
  title: string;
  author: string;
  "img-url": string;
  image?: React.ReactElement;
};

type FilmType = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: MeetingType;
  meeting_for: string;
  title: string;
  "img-url": string;
  image?: React.ReactElement;
};

type MeetingType = {
  name: string | null;
  date: string | null;
  where: any;
  book?: BookType;
  short?: ShortType;
  film?: FilmType
};

const getBook = (book: Queries.ContentfulBook, currentMeeting: MeetingType): BookType => {
  const year = moment.utc(currentMeeting.date).year()
  const imageData = getImage(book.image);
  const image = imageData ? <GatsbyImage image={imageData} alt={book.title ?? ''}/> : undefined;
  return {
    "info-links": book.infoLinks,
    "store-links": book.storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: book.title,
    author: book.author,
    "img-url": constructImageUrl("books", year, book.slug),
    image: image,
  }
};

const getShort = (short: Queries.ContentfulShort, currentMeeting: MeetingType): BookType => {
  const year = moment.utc(currentMeeting.date).year()
  const imageData = getImage(short.image);
  const image = imageData ? <GatsbyImage image={imageData} alt={short.title ?? ''}/> : undefined;
  return {
    "info-links": short.infoLinks,
    "store-links": short.storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: short.title,
    author: short.author,
    "img-url": constructImageUrl("books", year, short.slug),
    image: image,
  }
};

const getFilm = (film: Queries.ContentfulFilm, currentMeeting: MeetingType): BookType => {
  const year = moment.utc(currentMeeting.date).year()
  const imageData = getImage(film.image);
  const image = imageData ? <GatsbyImage image={imageData} alt={film.title ?? ''}/> : undefined;
  return {
    "info-links": film.infoLinks,
    "store-links": film.storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: film.title,
    "img-url": constructImageUrl("books", year, film.slug),
    image: image,
  }
};

const CurrentMeeting = () => {
  const data = useStaticQuery(graphql`
    query {
      allContentfulMeeting(limit: 1, sort: {date: DESC}) {
        nodes {
          contentful_id
          title
          date
          location {
            name
          }
          book {
            author
            slug
            title
            image {
              gatsbyImageData(width: 150)
            }
            infoLinks {
              class
              url
            }
            storeLinks {
              name
              class
              url
            }
          }
          short {
            author
            slug
            title
            image {
              gatsbyImageData(width: 150)
            }
            infoLinks {
              class
              url
            }
            storeLinks {
              name
              class
              url
            }
          }
          film {
            slug
            title
            image {
              gatsbyImageData(width: 150)
            }
            infoLinks {
              class
              url
            }
            storeLinks {
              name
              class
              url
            }
          }
        }
      }
    }
  `)
  const meeting = data.allContentfulMeeting.nodes[0];
  const currentMeeting: MeetingType = {
    name: meeting.title,
    date: meeting.date,
    where: meeting.location.name,
  }
  currentMeeting.book = meeting.book ? getBook(meeting.book, currentMeeting) : undefined
  currentMeeting.short = meeting.short ? getShort(meeting.short, currentMeeting) : undefined
  currentMeeting.film = meeting.film ? getFilm(meeting.film, currentMeeting) : undefined
  return <Meeting meeting={currentMeeting} isCurrent={true} />
}

export default CurrentMeeting
