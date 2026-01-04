import React from "react";
import {BlogPost} from "../../data/types/blog";
import FullBlogPost from "./FullBlogPost";

const BlogPosts = (
  {
    posts,
  }: {
    posts: Array<BlogPost>,
  }
) => (
  <>
    {posts.map((post) => <FullBlogPost post={post}/>)}
  </>
);

export {BlogPosts};
