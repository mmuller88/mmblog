import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const LocalAiLandingDePage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.localAi.de} location={location} />
)

export default LocalAiLandingDePage
