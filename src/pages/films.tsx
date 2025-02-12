import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {FilmsPageContent} from '../components/PageContent.js'

const FilmsPage: React.FC<PageProps> = () => {
  return (
    <App>
      <FilmsPageContent />
    </App>
  )
}

export default FilmsPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
