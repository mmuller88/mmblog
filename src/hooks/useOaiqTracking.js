import { useEffect, useState } from "react"
import { buildCalendlyUrl, captureOppref, measurePageViewed } from "../utils/oaiq"

/** Init oppref capture + page_viewed; return Calendly URL with utm_content=oppref. */
const useOaiqTracking = () => {
 const [calendlyUrl, setCalendlyUrl] = useState(() => buildCalendlyUrl())

 useEffect(() => {
  captureOppref()
  setCalendlyUrl(buildCalendlyUrl())
  measurePageViewed()
 }, [])

 return calendlyUrl
}

export default useOaiqTracking
