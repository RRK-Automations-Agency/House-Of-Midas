import React, { useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import "./Contact.css";

const Contact: React.FC = () => {
  useEffect(() => {


  

  /* ── Reveal observer ── */
  var selectors = [
    '.hcp-reveal','.hcp-reveal-left','.hcp-reveal-right',
    '.hcp-reveal-scale','#hcp-hr','.hcp-hr--2','.hcp-hr--3','#hcp-or'
  ];
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){ e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  },{ threshold:0.10, rootMargin:'0px 0px -40px 0px' });

  selectors.forEach(function(sel){
    document.querySelectorAll(sel).forEach(function(el){ io.observe(el); });
  });

  /* ── Hero parallax ── */
  var heroWrap    = document.querySelector('.hcp-hero-wrap') as HTMLElement;
  var heroContent = document.querySelector('.hcp-hero__content') as HTMLElement;
  var heroScroll  = document.querySelector('.hcp-scroll') as HTMLElement;
  var flipName    = document.querySelector('.hcp-flip-name') as HTMLElement;
  var flipBack    = document.querySelector('.hcp-flip-back') as HTMLElement;

  function onScroll(){
    if(!heroContent || !heroWrap) return;
    var sectionTop = heroWrap.getBoundingClientRect().top + window.scrollY;
    var sy = Math.max(0, window.scrollY - sectionTop);
    heroContent.style.transform = 'translateY(' + (sy * -0.20) + 'px)';
    heroContent.style.opacity   = Math.max(0, 1 - sy / 380).toString();
    if(heroScroll)  heroScroll.style.opacity  = Math.max(0, 1 - sy / 140).toString();
    if(flipBack)    flipBack.style.transform  = 'translateY(' + (sy * 0.10) + 'px)';
    if(flipName)    flipName.style.transform  = 'translateY(' + (sy * 0.06) + 'px)';
  }

  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();


    // Cleanup
    return () => {
      if (typeof io !== "undefined") io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <Layout noPadding>
      <div className="hcp" id="hcp-root">

  {/*  ══════════════════════
       SECTION 1 — HERO
  ══════════════════════  */}
  <div className="hcp-hero-wrap">
    <section className="hcp-hero">

      <div className="hcp-flip-stage" aria-hidden="true">
        <span className="hcp-flip-back">House of Midas</span>
        <span className="hcp-flip-name">House of Midas</span>
      </div>

      <div className="hcp-orb hcp-orb--1"></div>
      <div className="hcp-orb hcp-orb--2"></div>
      <div className="hcp-orb hcp-orb--3"></div>
      <div className="hcp-hero__overlay"></div>

      <div className="hcp-hero__content">
        <p className="hcp-hero__eyebrow">Contact Us &nbsp;·&nbsp; Surat, India</p>
        <h1 className="hcp-hero__title">
          <em>Get in Touch</em>
          Let's Talk Jewellery
        </h1>
        <p className="hcp-hero__sub">
          Whether it's a custom piece, a question about your order,<br />
          or simply a conversation — we are always here for you.
        </p>
      </div>

      <div className="hcp-scroll">
        <span>Reach Us</span>
        <div className="hcp-scroll-line"></div>
      </div>

    </section>
  </div>

  <hr className="hcp-hr" id="hcp-hr" />

  {/*  Contact cards + socials  */}
  <section className="hcp-body">
    <div className="hcp-container">

      <div className="hcp-details">
        <p className="hcp-label hcp-reveal">Contact Details</p>

        <h2 className="hcp-details__h hcp-reveal hcp-d1">
          We'd love to <strong>hear from you</strong>
        </h2>

        <p className="hcp-details__intro hcp-reveal hcp-d2">
          Our team is available to assist you with custom jewellery enquiries, order support, and anything else on your mind.
        </p>

        <div className="hcp-cards">
          <a href="mailto:houseofmidas.luxe@gmail.com" className="hcp-card hcp-reveal-left hcp-d1">
            <div className="hcp-card__icon">
              <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <div className="hcp-card__text">
              <span className="hcp-card__lbl">Email us</span>
              <span className="hcp-card__val">houseofmidas.luxe@gmail.com</span>
            </div>
          </a>

          <a href="tel:+917733979115" className="hcp-card hcp-reveal hcp-d2">
            <div className="hcp-card__icon">
              <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4A2 2 0 0 1 3.58 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6.13 6.13l1.12-.88a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </div>
            <div className="hcp-card__text">
              <span className="hcp-card__lbl">Call us</span>
              <span className="hcp-card__val">+91 77339 79115</span>
            </div>
          </a>

          <div className="hcp-card hcp-reveal-right hcp-d3" style={{cursor: 'default'}}>
            <div className="hcp-card__icon">
              <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="hcp-card__text">
              <span className="hcp-card__lbl">Based in</span>
              <span className="hcp-card__val">Surat, Gujarat — India</span>
            </div>
          </div>
        </div>
      </div>

      {/*  OR  */}
      <div className="hcp-or" id="hcp-or">
        <div className="hcp-or__circle hcp-reveal-scale">
          <span className="hcp-or__text">OR</span>
        </div>
      </div>

      {/*  Socials  */}
      <div className="hcp-socials">
        <a href="https://www.instagram.com/houseofmidasluxe/" className="hcp-social hcp-reveal-scale hcp-d1" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
          <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
        <a href="https://www.facebook.com/profile.php?id=61565578125138" className="hcp-social hcp-reveal-scale hcp-d2" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
        </a>
        <a href="https://www.tiktok.com/@houseofmidas.luxe?_r=1&_t=ZN-93ofdmSWn1K" className="hcp-social hcp-reveal-scale hcp-d3" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.92-.35-2.81.07-.59.29-1.07.73-1.4 1.3-.44.73-.55 1.63-.33 2.46.22 1.05.9 1.99 1.8 2.5 1.05.62 2.37.66 3.44.11 1.02-.51 1.69-1.52 1.83-2.63.09-2.73.04-5.46.05-8.18l.04-10.34z"/></svg>
        </a>
      </div>

    </div>
  </section>

  <hr className="hcp-hr hcp-hr--2" />

  {/*  ══════════════════════
       SECTION 2 — FORM (LIGHT)
  ══════════════════════  */}
  <section className="hcp-form-section">
    <div className="hcp-form-wrap">

      <div className="hcp-form-header hcp-reveal">
        <p className="hcp-form-eyebrow">Send a Message</p>
        <h2 className="hcp-form-title">Send us a message</h2>
        <p className="hcp-form-sub">Fill in the details below and we'll get back to you within 24 hours.</p>
      </div>

      <form className="hcp-form hcp-reveal hcp-d2" action="/contact" method="POST" acceptCharset="UTF-8">
        <input type="hidden" name="form_type" value="contact" />
        <input type="hidden" name="utf8" value="✓" />

        <div className="hcp-form-row">
          <div className="hcp-field">
            <input type="text" name="contact[name]" placeholder="Your Name *" required />
          </div>
          <div className="hcp-field">
            <input type="email" name="contact[email]" placeholder="Email Address *" required />
          </div>
        </div>

        <div className="hcp-field">
          <input type="tel" name="contact[phone]" placeholder="Phone Number *" />
        </div>

        <div className="hcp-field">
          <textarea name="contact[body]" placeholder="Your message... (optional)"></textarea>
        </div>

        <div className="hcp-form-submit">
          <button type="submit" className="hcp-btn"><span>Send Message</span></button>
        </div>

      </form>

    </div>
  </section>

  <hr className="hcp-hr hcp-hr--3" />

  {/*  ══════════════════════
       SECTION 3 — STRIP (DARK)
  ══════════════════════  */}
  <section className="hcp-strip">
    <div className="hcp-strip__corner-br"></div>
    <div className="hcp-strip__inner hcp-reveal">
      <p className="hcp-strip__label">A note from us</p>
      <p className="hcp-strip__text">
        Every conversation begins with a single message —<br />
        <em>yours could become your next treasured piece.</em>
      </p>
      <div className="hcp-strip__rule"></div>
      <span className="hcp-strip__sig">— House of Midas, Surat</span>
    </div>
  </section>

</div>
    </Layout>
  );
};

export default Contact;
