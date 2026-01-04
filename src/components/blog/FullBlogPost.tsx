import Moment from "react-moment";
import {renderRichText} from "gatsby-source-contentful/rich-text";
import React from "react";
import {type BlogPost} from "../../data/types/blog";

const FullBlogPost = ({post}: { post: BlogPost }) => (
  <div className="meeting">
    <div className="next-blog-post">
      <h1>{post.title}, by {post.authorTemp}</h1>
      <Moment format="DD MMMM YYYY">{post.publishDate}</Moment>
      {post.image2 && (<div>{post.image2}</div>)}
      <div>
        {post.content && renderRichText(post.content)}
      </div>
    </div>
  </div>
);

export default FullBlogPost;
