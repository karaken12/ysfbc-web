import type { GatsbyConfig } from "gatsby"

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
        spaceId: `3ygf5yadm911`,
        accessToken: `6fjoJngK3XE-8s6xQgABZxM69MTrTArf_32jcXn77G4`,
      },
    },
  ]
}

export default config
