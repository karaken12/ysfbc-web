import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {IndexPageContent} from '../components/PageContent.js'

const IndexPage: React.FC<PageProps> = () => {
  return (
    <App>
      <IndexPageContent />
    </App>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
