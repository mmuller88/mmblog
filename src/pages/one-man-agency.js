import React from "react"
import OneManAgency from "../components/OneManAgency"
import { oneManAgencyContent } from "../data/oneManAgencyContent"

const OneManAgencyPage = ({ location }) => (
 <OneManAgency content={oneManAgencyContent.en} location={location} />
)

export default OneManAgencyPage
