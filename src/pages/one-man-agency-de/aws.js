import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const AwsLandingDePage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.aws.de} location={location} />
)

export default AwsLandingDePage
