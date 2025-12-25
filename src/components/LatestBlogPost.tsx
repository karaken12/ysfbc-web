import React from 'react'
import {graphql, useStaticQuery} from "gatsby";
import {Meeting as MeetingType} from "../data/types/meeting";
import Moment from "react-moment";
import moment from "moment/moment";
import Book from "./Book";
import {
  ContentfulRichTextGatsbyReference,
  renderRichText,
  RenderRichTextData
} from "gatsby-source-contentful/rich-text";
import {GatsbyImage, getImage} from "gatsby-plugin-image";

type BlogPost = {
  title: string;
  authorTemp: string;
  publishDate: Date;
  content?: RenderRichTextData<ContentfulRichTextGatsbyReference>,
  image?: any,
}

const LatestBlogPost = () => {
  const data = useStaticQuery(graphql`
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
          }
        }
      }
    }
  `);

  const translateContentfulBlogPost = (data: any) => data as BlogPost;

  const latestBlogPost = translateContentfulBlogPost(data.allContentfulBlogPost.nodes[0]);

  const post = latestBlogPost;
  const imageData = getImage(post.image);
  const image = imageData ? <GatsbyImage image={imageData} alt={'Banner image'}/> : undefined;

  return (
    <div className="meeting">
      <div className="next-blog-post">
        <h1>{post.title}, by {post.authorTemp}</h1>
        <Moment format="DD MMMM YYYY">{post.publishDate}</Moment>
        {image && (<div>{image}</div>)}
        <div>
          {post.content && renderRichText(post.content)}
        </div>
      </div>
    </div>
  );
}

export default LatestBlogPost
