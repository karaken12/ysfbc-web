import * as React from "react"
import {graphql, HeadFC, PageProps} from "gatsby"
import '../style.scss'
import App from '../App'
import {Books} from '../components/Books'
import {translateContentfulMeeting} from "../data/translation/translateContentfulMeeting";

type DataProps = {
  allContentfulMeeting: Queries.ContentfulMeetingConnection,
}

const FilmsPage = ({data}: PageProps<DataProps>) => {
  const meetings = data.allContentfulMeeting.nodes.map(
    (meeting: Queries.ContentfulMeeting) => translateContentfulMeeting(meeting)
  )

  return (
    <App>
      <h1 className="books">Films</h1>
      <Books meetings={meetings} type="film"/>
    </App>
  )
}

export default FilmsPage

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
