import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const GptLandingDePage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.gpt.de} location={location} />
)

export default GptLandingDePage
