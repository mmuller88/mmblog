import React from "react"
import OneManAgency from "../components/OneManAgency"
import { oneManAgencyContent } from "../data/oneManAgencyContent"

const OneManAgencyDePage = ({ location }) => (
 <OneManAgency content={oneManAgencyContent.de} location={location} />
)

export default OneManAgencyDePage
