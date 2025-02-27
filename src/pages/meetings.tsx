import * as React from "react"
import {graphql, HeadFC, PageProps} from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {Meetings} from '../components/Meetings.js'
import {translateContentfulMeeting} from "../data/translation/translateContentfulMeeting";

const MeetingsPage: React.FC<PageProps> = ({data}) => {
  const meetings = data.allContentfulMeeting.nodes.map(
    (meeting: Queries.ContentfulMeeting) => translateContentfulMeeting(meeting)
  )

  return (
    <App>
      <h1 className="books">Meetings</h1>
      <Meetings meetings={meetings}/>
    </App>
  )
}

export default MeetingsPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>

export const query = graphql`
  query {
    allContentfulMeeting(
      sort: {date: DESC}
    ) {
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
`
