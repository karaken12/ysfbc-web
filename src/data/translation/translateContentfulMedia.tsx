import moment from "moment/moment";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
import React from "react";

import {Meeting} from "../types/meeting";
import {Book, Short, Film} from "../types/media";

export const constructImageUrl = (type: string, year: number, slug: string, extension: string = 'jpg') =>
  `/images/${type}/${year}/${slug}.${extension}`;

export const translateContentfulBook = (book: Queries.ContentfulBook, currentMeeting: Meeting): Book => {
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

export const translateContentfulShort = (short: Queries.ContentfulShort, currentMeeting: Meeting): Short => {
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
    "img-url": constructImageUrl("shorts", year, short.slug),
    image: image,
  }
};

export const translateContentfulFilm = (film: Queries.ContentfulFilm, currentMeeting: Meeting): Film => {
  const year = moment.utc(currentMeeting.date).year()
  const imageData = getImage(film.image);
  const image = imageData ? <GatsbyImage image={imageData} alt={film.title ?? ''}/> : undefined;
  return {
    "info-links": film.infoLinks,
    "store-links": film.storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: film.title,
    "img-url": constructImageUrl("films", year, film.slug),
    image: image,
  }
};
