import React from 'react'
import Meeting from './Meeting'
import {graphql, useStaticQuery} from "gatsby";
import {translateContentfulMeeting} from "../data/translation/translateContentfulMeeting";

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
  const currentMeeting = translateContentfulMeeting(data.allContentfulMeeting.nodes[0]);
  return <Meeting meeting={currentMeeting} isCurrent={true} />
}

export default CurrentMeeting
