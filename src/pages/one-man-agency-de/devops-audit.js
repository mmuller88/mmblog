import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const DevopsAuditLandingDePage = ({ location }) => (
 <AgencyLanding
  content={agencyLandingContent.devopsAudit.de}
  location={location}
 />
)

export default DevopsAuditLandingDePage
