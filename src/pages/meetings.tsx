import * as React from "react"
import type { HeadFC, PageProps } from "gatsby"
import '../style.scss'
// @ts-ignore
import App from '../App.js'
// @ts-ignore
import {MeetingsPageContent} from '../components/PageContent.js'

const MeetingsPage: React.FC<PageProps> = () => {
  return (
    <App>
      <MeetingsPageContent />
    </App>
  )
}

export default MeetingsPage

export const Head: HeadFC = () => <title>York SciFi Book Club</title>
