"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent("Consultation enquiry — Global Consult");
    const body = encodeURIComponent(
      [
        "New consultation enquiry",
        "",
        `Name: ${data.get("name")}`,
        `Email: ${data.get("email")}`,
        `Company: ${data.get("company") || "-"}`,
        `Area of interest: ${data.get("service")}`,
        "",
        "What would you like help with?",
        data.get("message"),
      ].join("\n")
    );
    window.location.href = `mailto:hello@globalconsult.com?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Your name<input name="name" required placeholder="Full name" /></label>
        <label>Email address<input name="email" type="email" required placeholder="you@example.com" /></label>
      </div>
      <label>Company or organisation <span className="optional">(optional)</span><input name="company" placeholder="Company name" /></label>
      <label>What would you like help with?
        <select name="service" defaultValue="Business Strategy">
          <option>Business Strategy</option>
          <option>Digital Transformation</option>
          <option>Growth & Operations</option>
          <option>Other / Not sure yet</option>
        </select>
      </label>
      <label>Tell us a little about your goals<textarea name="message" required rows={5} placeholder="Describe your challenge, goals, or the support you need..." /></label>
      <button className="btn form-submit" type="submit">Prepare consultation request ↗</button>
      <p className="form-note">This opens your email app with your enquiry prepared. You can review it before sending.</p>
      {sent && <p className="form-note" role="status">Your email app should open now. Please send the prepared message to complete your enquiry.</p>}
    </form>
  );
}
