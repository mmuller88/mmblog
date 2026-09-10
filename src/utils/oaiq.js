export const OAIQ_PIXEL_ID = "1tUq9Gtv8XLgjUkRRiQmcH"
export const OAIQ_SDK_URL = "https://bzrcdn.openai.com/sdk/oaiq.min.js"

export const OAIQ_LOADER_SCRIPT = `!function(w,d,s,u){if(w.oaiq)return;var q=function(){q.q.push(arguments)};q.q=[];w.oaiq=q;var j=d.createElement(s);j.async=1;j.src=u;var f=d.getElementsByTagName(s)[0];f.parentNode.insertBefore(j,f)}(window,document,"script","${OAIQ_SDK_URL}");`

export const measureAppointmentScheduled = () => {
 if (typeof window !== "undefined" && window.oaiq) {
  window.oaiq("measure", "appointment_scheduled", { type: "customer_action" })
 }
}

export const measureLeadCreated = () => {
 if (typeof window !== "undefined" && window.oaiq) {
  window.oaiq("measure", "lead_created", { type: "customer_action" })
 }
}
