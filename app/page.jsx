const services = [
  { title: "Business Strategy", text: "Turn complex decisions into a focused plan, clear priorities, and measurable next steps." },
  { title: "Digital Transformation", text: "Identify practical technology opportunities and improve the way your business works." },
  { title: "Growth & Operations", text: "Build stronger customer journeys, efficient processes, and a foundation for sustainable growth." },
];

export default function Home() {
  return (
    <main>
      <div className="wrap">
        <nav className="nav">
          <a className="brand" href="#">GLOBAL<span>CONSULT</span></a>
          <div className="links"><a href="#services">Services</a><a href="#approach">Our approach</a><a href="#contact">Contact</a></div>
          <a className="btn" href="#contact">Start a conversation</a>
        </nav>
        <header className="hero">
          <div className="eyebrow">Independent consulting · Worldwide</div>
          <h1>Clarity for your next move.</h1>
          <p>We help ambitious founders and businesses make confident decisions, solve meaningful challenges, and turn ideas into practical progress.</p>
          <div className="actions"><a className="btn" href="#contact">Discuss your goals ↗</a><a className="ghost" href="#services">Explore our services</a></div>
        </header>
      </div>
      <section className="section" id="services"><div className="wrap">
        <div className="eyebrow">What we do</div><h2>Practical advice. Meaningful impact.</h2>
        <p className="lead">Focused support for the decisions that move your business forward. Engagements are shaped around your goals, stage, and operating reality.</p>
        <div className="grid">{services.map((s)=><article className="card" key={s.title}><h3>{s.title}</h3><p>{s.text}</p></article>)}</div>
      </div></section>
      <section className="section" id="approach"><div className="wrap">
        <div className="eyebrow">Our approach</div><h2>Clear steps, from challenge to action.</h2>
        <div className="steps"><div className="step"><b>01 / DISCOVER</b><h3>Understand the challenge</h3><p>We listen, ask the right questions, and define what success should look like.</p></div><div className="step"><b>02 / DESIGN</b><h3>Build a focused plan</h3><p>We identify options, priorities, and a practical roadmap based on your needs.</p></div><div className="step"><b>03 / DELIVER</b><h3>Move forward with confidence</h3><p>We help turn recommendations into clear actions and measurable outcomes.</p></div></div>
      </div></section>
      <section className="section" id="contact"><div className="wrap">
        <div className="contact"><div><div className="eyebrow">Start a conversation</div><h2>What would you like to make possible?</h2><p className="lead">Tell us where you are and what you are working toward. We’ll take it from there.</p></div><a className="btn" href="mailto:hello@globalconsult.com?subject=Consultation%20enquiry">Email Global Consult ↗</a></div>
      </div></section>
      <footer className="footer"><div className="wrap">© {new Date().getFullYear()} Global Consult. All rights reserved.</div></footer>
    </main>
  );
}
