import React from 'react'
// @ts-ignore
import Meeting from './Meeting.js'
import {graphql, useStaticQuery} from "gatsby";
import {GatsbyImage, getImage} from "gatsby-plugin-image";
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
            image {
              gatsbyImageData(width: 150)
            }
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
  const book = data.allContentfulMeeting.nodes[0].book;
  const imageData = getImage(book.image);
  const bookImage = imageData ? <GatsbyImage image={imageData} alt={book.title}/> : undefined;
  currentMeeting.book = {
    "info-links": book.infoLinks,
    "store-links": book.storeLinks,
    meeting: currentMeeting,
    "meeting_for": currentMeeting.name,
    title: book.title,
    author: book.author,
    "img-url": constructImageUrl("books", year, book.slug),
    image: bookImage,
  }
  return <Meeting meeting={currentMeeting} isCurrent={true} />
}

export default CurrentMeeting
