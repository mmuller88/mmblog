import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const VibeCodingLandingDePage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.vibeCoding.de} location={location} />
)

export default VibeCodingLandingDePage
