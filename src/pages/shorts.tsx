import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {ShortsPageContent} from '../components/PageContent.js'

const ShortsPage: React.FC<PageProps> = () => {
  return (
    <App>
      <ShortsPageContent />
    </App>
  )
}

export default ShortsPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
