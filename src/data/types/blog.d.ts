import {ContentfulRichTextGatsbyReference, RenderRichTextData} from "gatsby-source-contentful/rich-text";
import {ReactElement} from "react";

export type BlogPost = {
  title: string;
  authorTemp: string;
  publishDate: Date;
  content?: RenderRichTextData<ContentfulRichTextGatsbyReference>,
  image?: any,
  image2?: ReactElement,
}
