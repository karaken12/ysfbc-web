import * as React from "react"
import {graphql, HeadFC, PageProps} from "gatsby"
import {renderRichText} from "gatsby-source-contentful/rich-text";
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {IndexPageContent} from '../components/PageContent.js'
// @ts-ignore
import CurrentMeeting from "../components/currentMeeting";

const IndexPage: React.FC<PageProps> = ({data}) => {
  return (
    <App>
      <div className="book">
        <div>{renderRichText(data.contentfulDescription.content)}</div>
      </div>
      <IndexPageContent />
      <CurrentMeeting />
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
