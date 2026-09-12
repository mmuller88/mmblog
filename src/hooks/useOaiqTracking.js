import { useEffect } from "react"
import { captureOppref, measurePageViewed } from "../utils/oaiq"

/** Init oppref capture + page_viewed on agency / landing pages. */
const useOaiqTracking = () => {
 useEffect(() => {
  captureOppref()
  measurePageViewed()
 }, [])
}

export default useOaiqTracking
