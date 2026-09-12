import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const AwsLandingPage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.aws.en} location={location} />
)

export default AwsLandingPage
