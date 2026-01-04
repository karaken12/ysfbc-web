import {GatsbyImage, getImage} from "gatsby-plugin-image";
import React from "react";
import moment from "moment";
import {type BlogPost} from "../types/blog";

const getImageElement = (image: Queries.ContentfulAsset) => {
  const imageData = getImage(image);
  if (!imageData) {
    return undefined;
  }
  const altText = image?.description ?? image?.title ?? '';
  const titleText = image?.title ?? '';
  return <GatsbyImage image={imageData} alt={altText} title={titleText}/>;
};

export const translateContentfulBlogPost = (data: Queries.ContentfulBlogPost | undefined): BlogPost | undefined => {
  if (!data) {
    return undefined
  }
  const image = data.image ?? undefined;
  const image2 = getImageElement(image);

  return {
    title: (data.title ?? undefined) ?? '',
    authorTemp: (data.authorTemp ?? undefined) ?? '',
    publishDate: moment(data.publishDate).toDate(),
    content: data.content ? {
      raw: data.content.raw,
    } : undefined,
    image2,
  };
}
