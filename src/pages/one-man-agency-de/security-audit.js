import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const SecurityAuditLandingDePage = ({ location }) => (
 <AgencyLanding
  content={agencyLandingContent.securityAudit.de}
  location={location}
 />
)

export default SecurityAuditLandingDePage
