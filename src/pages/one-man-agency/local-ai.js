import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const LocalAiLandingPage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.localAi.en} location={location} />
)

export default LocalAiLandingPage
