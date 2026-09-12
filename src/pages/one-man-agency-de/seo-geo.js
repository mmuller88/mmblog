import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const SeoGeoLandingDePage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.seoGeo.de} location={location} />
)

export default SeoGeoLandingDePage
