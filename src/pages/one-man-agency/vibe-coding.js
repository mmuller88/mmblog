import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const VibeCodingLandingPage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.vibeCoding.en} location={location} />
)

export default VibeCodingLandingPage
