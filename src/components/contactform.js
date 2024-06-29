import React, { Component } from "react"
import { navigate } from "gatsby"

class ContactForm extends Component {
  constructor(props) {
    super(props)
    this.ContactForm = React.createRef()
    this.state = {}
  }
  encode = data => {
    return Object.keys(data)
      .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
      .join("&")
  }
  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value })
  }


  handleSubmit = e => {
    e.preventDefault()
    const form = this.ContactForm.current

    let url = window?.location?.href ?? 'nothing';

    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: this.encode({
        "form-name": form.getAttribute("name"),
        ...this.state,
        "url": url,
      }),
    })
      .then(response => {
        console.log("====================================")
        console.log(`${JSON.stringify(response, null, 2)}`)
        console.log("====================================")
        navigate(form.getAttribute("action"))
      })
      .catch(error => {
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
        action="/thx/"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={this.handleSubmit}
        ref={this.ContactForm}
      >
        <input type="hidden" name="form-name" value="contact" />
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
            <textarea name="message" rows={10} cols={40} onChange={this.handleChange} />
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