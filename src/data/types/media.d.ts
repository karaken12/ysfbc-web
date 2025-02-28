import {Meeting} from "./meeting";
import React from "react";

type CommonMedia = {
  meeting: Meeting;
  meeting_for: string;
  "img-url": string;
  image?: React.ReactElement;
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
}

export type Book = CommonMedia & {
  title: string;
  author: string;
};

export type Short = CommonMedia & {
  title: string;
  author: string;
};

export type Film = CommonMedia & {
  title: string;
};

export type MediaType = 'book' | 'short' | 'film';

export type Media = Book | Short | Film;
