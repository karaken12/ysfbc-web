import type { GatsbyConfig } from "gatsby"
import dotenv from 'dotenv'

dotenv.config()

const useContentfulPreview = process.env.NODE_ENV === 'development'

const config: GatsbyConfig = {
  siteMetadata: {
    title: `York SciFi Book Club`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    'gatsby-plugin-image',
    `gatsby-plugin-sass`,
    'gatsby-plugin-sharp',
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
        ...(useContentfulPreview ? {host: `preview.contentful.com`} : {}),
      },
    },
  ]
}

export default config
