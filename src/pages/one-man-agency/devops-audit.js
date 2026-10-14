import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const DevopsAuditLandingPage = ({ location }) => (
 <AgencyLanding
  content={agencyLandingContent.devopsAudit.en}
  location={location}
 />
)

export default DevopsAuditLandingPage
