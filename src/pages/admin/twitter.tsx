import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../../style.scss'
// @ts-ignore
import App from '../../App.js'
// @ts-ignore
import {TwitterPageContent} from '../../components/PageContent.js'

const TwitterPage: React.FC<PageProps> = () => {
  return (
    <App>
      <TwitterPageContent />
    </App>
  )
}

export default TwitterPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
