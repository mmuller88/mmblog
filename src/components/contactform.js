import React, { Component } from "react"
import { navigate } from "gatsby"

class ContactForm extends Component {
 constructor(props) {
  super(props)
  this.ContactForm = React.createRef()
  this.state = {}
 }
 encode = (data) => {
  return Object.keys(data)
   .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
   .join("&")
 }
 handleChange = (e) => {
  this.setState({ [e.target.name]: e.target.value })
 }

 handleSubmit = (e) => {
  e.preventDefault()
  const form = this.ContactForm.current

  let url = window?.location?.href ?? "nothing"

  fetch("/api/forms", {
   method: "POST",
   headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
   },
   body: this.encode({
    "form-name": form.getAttribute("name"),
    ...this.state,
    url: url,
   }),
  })
   .then((response) => {
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    navigate("/thx/")
   })
   .catch((error) => {
    console.log("====================================")
    console.log(`error in submiting the form data:${error}`)
    console.log("====================================")
   })
 }

 render() {
  return (
   <form
    name="contact"
    method="post"
    action="/api/forms"
    onSubmit={this.handleSubmit}
    ref={this.ContactForm}
   >
    <input type="hidden" name="form-name" value="contact" />
    <input type="hidden" name="redirect" value="/thx/" />
    <p hidden>
     <label>
      Don’t fill this out:{" "}
      <input name="bot-field" onChange={this.handleChange} />
     </label>
    </p>
    <p hidden>
     <label>
      Don’t fill this out:{" "}
      <input type="text" name="url" onChange={this.handleChange} />
     </label>
    </p>
    <p>
     <label>
      Your name:
      <br />
      <input type="text" name="name" onChange={this.handleChange} />
     </label>
    </p>
    <p>
     <label>
      Your email:
      <br />
      <input type="email" name="email" onChange={this.handleChange} />
     </label>
    </p>
    <p>
     <label>
      Message:
      <br />
      <textarea
       name="message"
       rows={10}
       cols={40}
       onChange={this.handleChange}
      />
     </label>
    </p>
    <p>
     <button type="submit">Send</button>
    </p>
   </form>
  )
 }
}
export default ContactForm
