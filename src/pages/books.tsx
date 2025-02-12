import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {BooksPageContent} from '../components/PageContent.js'

const BooksPage: React.FC<PageProps> = () => {
  return (
    <App>
      <BooksPageContent />
    </App>
  )
}

export default BooksPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
