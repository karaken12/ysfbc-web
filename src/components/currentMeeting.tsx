import React from 'react'
// @ts-ignore
import Meeting from './Meeting.js'
import {graphql, useStaticQuery} from "gatsby";
// import {GatsbyImage, getImage} from "gatsby-plugin-image";
import moment from "moment/moment";

const constructImageUrl = (type: string, year: number, slug: string, extension: string = 'jpg') =>
  `/images/${type}/${year}/${slug}.${extension}`;

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
            infoLinks {
              class
              url
            }
            storeLinks {
              class
              url
            }
          }
        }
      }
    }
  `)
  const currentMeeting = {
    name: data.allContentfulMeeting.nodes[0].title,
    date: data.allContentfulMeeting.nodes[0].date,
    where: data.allContentfulMeeting.nodes[0].location.name,
    book: null,
    short: null,
    film: null,
  }
  const year = moment.utc(currentMeeting.date).year()
  let slug = data.allContentfulMeeting.nodes[0].book.slug;
  const infoLinks = data.allContentfulMeeting.nodes[0].book.infoLinks;
  const storeLinks = data.allContentfulMeeting.nodes[0].book.storeLinks;
  currentMeeting.book = {
    "info-links": infoLinks,
    "store-links": storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: data.allContentfulMeeting.nodes[0].book.title,
    author: data.allContentfulMeeting.nodes[0].book.author,
    "img-url": constructImageUrl("books", year, slug)
  }
  return <Meeting meeting={currentMeeting} isCurrent={true} />
}

export default CurrentMeeting
