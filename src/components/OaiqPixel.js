import React from "react"
import { Helmet } from "react-helmet"
import { OAIQ_LOADER_SCRIPT, OAIQ_PIXEL_ID } from "../utils/oaiq"

const OaiqPixel = () => (
 <Helmet>
  <link
   rel="stylesheet"
   href="https://assets.calendly.com/assets/external/widget.css"
  />
  <script>{`${OAIQ_LOADER_SCRIPT}oaiq("init",{pixelId:"${OAIQ_PIXEL_ID}"});`}</script>
 </Helmet>
)

export default OaiqPixel
