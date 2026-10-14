import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const SecurityAuditLandingPage = ({ location }) => (
 <AgencyLanding
  content={agencyLandingContent.securityAudit.en}
  location={location}
 />
)

export default SecurityAuditLandingPage
