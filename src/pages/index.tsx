import * as React from "react"
import {graphql, HeadFC, PageProps} from "gatsby"
import {renderRichText} from "gatsby-source-contentful/rich-text";
import '../style.scss'
import App from '../App'
import CurrentMeeting from "../components/currentMeeting";
import LatestBlogPost from "../components/LatestBlogPost";

const IndexPage: React.FC<PageProps> = ({data}) => {
  return (
    <App>
      <div className="book">
        <div>{renderRichText(data.contentfulDescription.content)}</div>
      </div>
      <CurrentMeeting />
      <LatestBlogPost />
    </App>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>

export const query = graphql`
  query {
    contentfulDescription(title: {eq: "Front page"}) {
      id
      content {
        raw
      }
      title
    }
  }
`
