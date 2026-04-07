import React, { useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import { Link } from "react-router-dom";
import "./AboutStory.css";

const AboutStory: React.FC = () => {
  useEffect(() => {


  
  var revealEls = document.querySelectorAll('.hom-reveal, .hom-stagger');
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(function(el) { observer.observe(el); });

  var heroImg = document.getElementById('hom-hero-img');
  var heroBg  = document.getElementById('hom-hero-bg');
  var parallaxImgs = document.querySelectorAll('[data-parallax]');

  function onScroll() {
    var scrollY = window.pageYOffset;
    if (heroImg) heroImg.style.transform = 'translateY(' + (scrollY * 0.45) + 'px)';
    if (heroBg)  heroBg.style.transform  = 'translateY(' + (scrollY * 0.15) + 'px)';
    parallaxImgs.forEach(function(el) {
      const img = el as HTMLElement;
      var rate = parseFloat(img.getAttribute('data-parallax') ?? '0') || 0.2;
      var rect = img.getBoundingClientRect();
      var offset = (window.innerHeight / 2 - (rect.top + rect.height / 2)) * rate;
      img.style.transform = 'translateY(' + offset + 'px)';
    });
  }

  var ticking = false;
  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(function() { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  onScroll();

    // Cleanup
    return () => {
      if (typeof observer !== "undefined") observer.disconnect();
      window.removeEventListener("scroll", typeof onScroll !== "undefined" ? onScroll : () => {});
    };
  }, []);

  return (
    <Layout noPadding>
      {/*  HTML — 100% original, zero changes  */}
<div className="hom-story" id="hom-story-root">

  <section className="hom-hero">
    <div className="hom-hero__img-wrap">
      <img className="hom-hero__img" id="hom-hero-img"
        src="https://houseofmidas.in/cdn/shop/files/Our-mission-banner.jpg?v=1690886706"
        alt="House of Midas — Our Story" loading="eager" />
    </div>
    <div className="hom-hero__bg" id="hom-hero-bg"></div>
    <div className="hom-hero__overlay"></div>
    <div className="hom-hero__content">
      <p className="hom-hero__eyebrow">Est. 2020 &nbsp;·&nbsp; Surat, India</p>
      <h1 className="hom-hero__title">
        Our Story
        <span>House of Midas</span>
      </h1>
      <p className="hom-hero__sub">Where Fine Jewellery Meets Every Moment</p>
    </div>
    <div className="hom-hero__scroll">
      <span>Scroll</span>
      <div className="hom-scroll-line"></div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-mission">
    <div className="hom-container">
      <div className="hom-mission__layout">
        <div className="hom-reveal hom-reveal--left">
          <div className="hom-mission__image-wrap">
            <img className="hom-parallax-img" data-parallax="0.3"
              src="https://houseofmidas.in/cdn/shop/files/mission-images-1_png.webp?v=1690887697"
              alt="House of Midas fine jewellery" />
            <div className="hom-mission__badge">
              <span className="hom-mission__badge-year">25+</span>
              <span className="hom-mission__badge-label">Years</span>
            </div>
          </div>
        </div>
        <div className="hom-reveal hom-reveal--right">
          <p className="hom-section-label">Our Mission</p>
          <h2 className="hom-mission__heading">
            Bringing <em>accessible</em> hand-crafted fine jewellery — made in India, for the world.
          </h2>
          <p className="hom-mission__body">
            We believe jewellery is more than just an accessory. It is a power, an identity, a language — a form of self-love. Simple in form, yet it means something different to every person who wears it. What matters is that <em>you</em> give it meaning. Wear it whenever you want, buy it for yourself, gift it, celebrate with it, and most importantly — cherish it forever.
          </p>
        </div>
      </div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-origin">
    <div className="hom-container">
      <div className="hom-origin__header hom-reveal">
        <p className="hom-section-label" style={{justifyContent: 'center'}}>The Beginning</p>
        <h2 className="hom-origin__title">How It All Started</h2>
        <div className="hom-gold-line" style={{marginTop: '24px'}}></div>
      </div>
      <div className="hom-story-body">
        <div className="hom-story-para hom-story-para--first hom-reveal">
          <span className="hom-story-para__label">The Spark</span>
          <p className="hom-story-para__text">It began in January 2020 — not in a boardroom, but in a family home in Surat, Gujarat, the city of diamonds. A brother and sister, raised surrounded by the smell of polished metal and the sound of craftsmen at work, sat together with a single question: <em>why should fine jewellery feel out of reach?</em> Their father, one of the finest jewellers of his generation, had spent his life turning precious materials into something personal. This was their tribute to him — and the beginning of House of Midas.</p>
        </div>
        <blockquote className="hom-story-pull hom-reveal">
          <p className="hom-story-pull__text">"Fine jewellery does not need to be reserved for special occasions. It belongs to every day, and to every version of you."</p>
        </blockquote>
        <div className="hom-story-para hom-reveal">
          <span className="hom-story-para__label">The Discovery</span>
          <p className="hom-story-para__text">Growing up as second-generation jewellers, they saw both sides of the industry clearly. On one side, the extraordinary skill of artisans with decades of mastery. On the other, a market that kept fine jewellery locked behind glass — available only on birthdays, anniversaries, and gifting seasons. The idea that someone might simply buy themselves a beautiful piece, just because, felt almost radical. That was exactly the gap House of Midas was built to close.</p>
        </div>
        <div className="hom-story-para hom-reveal">
          <span className="hom-story-para__label">The Craft</span>
          <p className="hom-story-para__text">Rather than open a store, they went directly online — and directly to the source. Their in-house manufacturing unit, now 25 years old, is home to artisans who have spent 30 or more years perfecting their craft. Every piece of jewellery leaves their hands and travels straight to yours, with no middlemen, no markups, and no compromise on quality. The result is something rare: craftsmanship that is both exceptional and genuinely accessible.</p>
        </div>
        <div className="hom-story-para hom-reveal">
          <span className="hom-story-para__label">The Promise</span>
          <p className="hom-story-para__text">Today, House of Midas is more than a jewellery brand — it is a community built on the belief that beauty should be worn, not saved. Whether you are treating yourself, celebrating someone you love, or commissioning a piece that exists nowhere else in the world, House of Midas is here to make it real. This is not just a store. It is a conversation between you, an artisan, and a piece that will last a lifetime.</p>
        </div>
      </div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-dream">
    <div className="hom-dream__deco">Dream</div>
    <div className="hom-dream__content hom-reveal hom-reveal--scale">
      <p className="hom-section-label" style={{justifyContent: 'center'}}>Custom Creation</p>
      <blockquote className="hom-dream__quote">"A Piece of Your Dream"</blockquote>
      <p className="hom-dream__sub">Having access to the finest digital designers and master artisans means your dream piece is always within reach. Send us a picture or describe your vision — in just a matter of days, your bespoke jewellery will arrive at your doorstep.</p>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-founder">
    <div className="hom-container">
      <div className="hom-founder__layout">
        <div className="hom-reveal">
          <p className="hom-section-label">The Founder</p>
          <h2 className="hom-founder__heading">The Vision Behind<br />the Brand</h2>
          <div className="hom-founder__quote-block">
            <span className="hom-founder__quote-mark">"</span>
            <p className="hom-founder__quote-text">Through this platform, our goal is providing access to the core level of jewellery making and experienced artisans — from the comfort of wherever you are in India, or anywhere in the world.</p>
            <p className="hom-founder__attribution">— Priya Das, Founder</p>
          </div>
          <p className="hom-founder__body">Born into a lineage of craftspeople, Priya Das brings decades of inherited knowledge and a modern vision together — building a brand that honours tradition while embracing every person's right to wear something truly beautiful, every day.</p>
        </div>
      </div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-inspired">
    <div className="hom-inspired__bg-text">Inspired</div>
    <div className="hom-container">
      <div className="hom-inspired__layout">
        <div className="hom-reveal">
          <p className="hom-section-label">Inspired By You</p>
          <h2 className="hom-inspired__heading">
            Inspired<br /><em>By You</em>
          </h2>
          <p className="hom-founder__body">Our entire goal has been centred on serving your jewellery needs to the highest standard, and welcoming you as a part of the House of Midas community. We have actively listened, and will continue to listen — bringing new designs to life based on your requests. We have even named pieces after the clients who inspired them, because that piece belongs to you.</p>
        </div>
        <div className="hom-reveal hom-reveal--right">
          <div className="hom-mission__image-wrap">
            <img className="hom-parallax-img" data-parallax="0.25"
              src="https://houseofmidas.in/cdn/shop/files/inspired-hom_png.webp?v=1690888315"
              alt="House of Midas — Inspired by you" />
          </div>
        </div>
      </div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-pillars">
    <div className="hom-container">
      <div className="hom-pillars__header hom-reveal">
        <p className="hom-section-label" style={{justifyContent: 'center'}}>Our Commitment</p>
        <h2 className="hom-pillars__title">To Live Our Mission</h2>
        <div className="hom-gold-line" style={{marginTop: '20px'}}></div>
      </div>
      <div className="hom-pillars__grid hom-stagger">
        <div className="hom-pillar hom-stagger-child">
          <div className="hom-pillar__icon-wrap">
            <img className="hom-pillar__icon" src="https://houseofmidas.in/cdn/shop/files/mission-image-3-320x320.png?v=1690888483" alt="Quality" />
          </div>
          <p className="hom-pillar__num">01</p>
          <h3 className="hom-pillar__title">Quality</h3>
          <p className="hom-pillar__body">Every piece is produced in-house by our known and experienced artisans, assuring top-of-the-class craftsmanship in every detail.</p>
        </div>
        <div className="hom-pillar hom-stagger-child">
          <div className="hom-pillar__icon-wrap">
            <img className="hom-pillar__icon" src="https://houseofmidas.in/cdn/shop/files/mission-image-4-320x320.png?v=1690888483" alt="Community" />
          </div>
          <p className="hom-pillar__num">02</p>
          <h3 className="hom-pillar__title">Community</h3>
          <p className="hom-pillar__body">Building a community of people who express their love through jewellery — not only for the people around them, but for themselves.</p>
        </div>
        <div className="hom-pillar hom-stagger-child">
          <div className="hom-pillar__icon-wrap">
            <img className="hom-pillar__icon" src="https://houseofmidas.in/cdn/shop/files/mission-image-5-320x320.png?v=1690888483" alt="Touch of the Artiste" />
          </div>
          <p className="hom-pillar__num">03</p>
          <h3 className="hom-pillar__title">Touch of the Artiste</h3>
          <p className="hom-pillar__body">Do you have the ring of your dreams in mind? Create your own custom jewellery and become the artiste of your own masterpiece.</p>
        </div>
      </div>
    </div>
  </section>

  <hr className="hom-hr" />

  <section className="hom-cta">
    <div className="hom-cta__content hom-reveal hom-reveal--scale">
      <h2 className="hom-cta__title">
        <strong>House of Midas</strong>
        Where Exquisite Jewellery Meets Your Elegance
      </h2>
      <p className="hom-cta__sub">Elevate your style with craftsmanship that honours tradition and celebrates you.</p>
      <div className="hom-cta__buttons">
        <Link to="/collections" className="hom-btn hom-btn--fill">Shop Now</Link>
      </div>
    </div>
  </section>

</div>
    </Layout>
  );
};

export default AboutStory;
