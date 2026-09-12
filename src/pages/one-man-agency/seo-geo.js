import React from "react"
import AgencyLanding from "../../components/AgencyLanding"
import { agencyLandingContent } from "../../data/agencyLandingContent"

const SeoGeoLandingPage = ({ location }) => (
 <AgencyLanding content={agencyLandingContent.seoGeo.en} location={location} />
)

export default SeoGeoLandingPage
