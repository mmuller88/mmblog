import React from "react"
import { Helmet } from "react-helmet-async"
import { CARACHAT_BOT_ID, CARACHAT_WIDGET_URL } from "../utils/carachat"

export const CaraChatScript = () => (
 <Helmet
  script={[
   {
    src: CARACHAT_WIDGET_URL,
    async: true,
    "data-carachat-bot": CARACHAT_BOT_ID,
   },
  ]}
 />
)

export const CaraChatInline = () => (
 <div
  data-carachat-inline
  data-carachat-bot={CARACHAT_BOT_ID}
  className="mt-10 min-h-[28rem] w-full"
  data-testid="carachat-inline"
 />
)

const CaraChat = () => (
 <>
  <CaraChatScript />
  <CaraChatInline />
 </>
)

export default CaraChat
