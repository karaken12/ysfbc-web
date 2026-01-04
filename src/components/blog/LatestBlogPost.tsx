import React from 'react'
import {graphql, useStaticQuery} from "gatsby";
import FullBlogPost from "./FullBlogPost";
import {translateContentfulBlogPost} from "../../data/translation/translateContentfulBlogPost";

const LatestBlogPost = () => {
  const data = useStaticQuery<Queries.Query>(graphql`
    query {
      allContentfulBlogPost(
        limit: 1,
        sort: {publishDate: DESC},
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
  `);

  const latestBlogPost = translateContentfulBlogPost(data.allContentfulBlogPost.nodes.at(0));
  if (!latestBlogPost) {
    return undefined;
  }

  return <FullBlogPost post={latestBlogPost}/>;
}

export default LatestBlogPost
