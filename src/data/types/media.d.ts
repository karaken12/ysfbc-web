import {Meeting} from "./meeting";
import React from "react";

export type Book = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: Meeting;
  meeting_for: string;
  title: string;
  author: string;
  "img-url": string;
  image?: React.ReactElement;
};

export type Short = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: Meeting;
  meeting_for: string;
  title: string;
  author: string;
  "img-url": string;
  image?: React.ReactElement;
};

export type Film = {
  "info-links": Array<Queries.ContentfulInfoLink>;
  "store-links": any;
  meeting: Meeting;
  meeting_for: string;
  title: string;
  "img-url": string;
  image?: React.ReactElement;
};
