import React from "react"
import TalkDetail from "../components/TalkDetail"
import { getTalk } from "../data/talksContent"

const createTalkPage = (slug, locale) => {
 const TalkPage = ({ location }) => (
  <TalkDetail talk={getTalk(slug, locale)} location={location} />
 )
 TalkPage.displayName = `TalkPage(${slug}, ${locale})`
 return TalkPage
}

export default createTalkPage
