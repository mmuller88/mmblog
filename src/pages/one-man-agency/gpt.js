import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const GptLandingPage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.gpt.en} location={location} />
)

export default GptLandingPage
