import * as React from "react"
import {graphql, HeadFC, PageProps} from "gatsby"
import '../style.scss'
import App from '../App'
import {translateContentfulMeeting} from "../data/translation/translateContentfulMeeting";
import {BlogPosts} from "../components/blog/BlogPosts";
import moment from "moment";
import {translateContentfulBlogPost} from "../data/translation/translateContentfulBlogPost";
import {BlogPost} from "../data/types/blog";

type DataProps = {
  allContentfulBlogPost: Queries.ContentfulBlogPostConnection;
}

const BlogPage = ({data}: PageProps<DataProps>) => {
  const blogPosts = data.allContentfulBlogPost.nodes.map(translateContentfulBlogPost).filter(Boolean) as BlogPost[];

  return (
    <App>
      <h1 className="books">Messages, missives, and musings</h1>
      <BlogPosts posts={blogPosts}/>
    </App>
  )
}

export default BlogPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>

export const query = graphql`
  query {
    allContentfulBlogPost(
      sort: {publishDate: DESC}
    ) {
      nodes {
        title
        publishDate
        authorTemp
        content {
          raw
        }
        image {
          gatsbyImageData(width: 300)
          title
          description
        }
      }
    }
  }
`
