"use client";

import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AboutPage() {
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
          }
        });
      },
      { threshold: 0.15 }
    );

    const wordObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("vis");
          }
        });
      },
      { threshold: 0.25 }
    );

    document
      .querySelectorAll(".about-page [data-reveal], .about-page [data-wipe]")
      .forEach((el) => revealObserver.observe(el));

    document
      .querySelectorAll(".about-page [data-words], .about-page [data-vis]")
      .forEach((el) => wordObserver.observe(el));

    // Word animations
    document.querySelectorAll(".about-page [data-words]").forEach((el) => {
      const element = el as HTMLElement;
      const words = element.textContent?.trim().split(/\s+/) || [];
      element.innerHTML = "";

      let index = 0;

      words.forEach((word) => {
        if (word === "|") {
          element.appendChild(document.createElement("br"));
          return;
        }

        const wrapper = document.createElement("span");
        wrapper.className = "word-wrapper";

        const inner = document.createElement("span");
        inner.className = "word-inner";
        inner.style.setProperty("--i", String(index++));
        inner.textContent = word;

        wrapper.appendChild(inner);
        element.appendChild(wrapper);
      });
    });

    // Letter animations
    document.querySelectorAll(".about-page [data-letters]").forEach((el) => {
      const element = el as HTMLElement;
      const text = element.textContent || "";
      element.innerHTML = "";

      [...text].forEach((letter, index) => {
        const span = document.createElement("span");
        span.className = "letter";
        span.style.setProperty("--i", String(index));
        span.textContent = letter === " " ? "\u00a0" : letter;
        element.appendChild(span);
      });
    });

    // Counter animation
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target as HTMLElement;
          const from = Number(el.dataset.from || 0);
          const to = Number(el.dataset.to || 0);
          const suffix = el.dataset.suffix || "";
          const duration = 1500;
          const start = performance.now();

          const animate = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);

            el.textContent =
              Math.round(from + (to - from) * eased) + suffix;

            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };

          requestAnimationFrame(animate);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document
      .querySelectorAll(".about-page [data-count]")
      .forEach((el) => counterObserver.observe(el));

    // Marquee
    const marquee = document.querySelector(".about-page .marquee-track");

    if (marquee) {
      const items = ["LUXURY CARS", "PERFORMANCE", "ENGINEERING", "DUBAI"];

      marquee.innerHTML = Array(8)
        .fill(
          items
            .map(
              (item) =>
                `<div class="marquee-item"><span>${item}</span><i></i></div>`
            )
            .join("")
        )
        .join("");
    }

    // Scroll progress + navbar background
    const progress = document.querySelector(
      ".about-page .scroll-progress"
    ) as HTMLElement;

    const handleScroll = () => {
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      if (progress) {
        progress.style.width =
          (maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0) + "%";
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // Parallax
    const updateParallax = () => {
      document
        .querySelectorAll(".about-page [data-parallax]")
        .forEach((wrapper) => {
          const rect = wrapper.getBoundingClientRect();

          if (
            rect.bottom < -100 ||
            rect.top > window.innerHeight + 100
          )
            return;

          const image = wrapper.querySelector("img, .placeholder");
          if (!image) return;

          const position =
            (rect.top + rect.height / 2 - window.innerHeight / 2) /
            window.innerHeight;

          const offset = Math.max(-0.8, Math.min(0.8, position));

          (image as HTMLElement).style.transform =
            `translate3d(0, ${-offset * 40}px, 0) scale(1.18)`;
        });
    };

    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);
    updateParallax();

    return () => {
      revealObserver.disconnect();
      wordObserver.disconnect();
      counterObserver.disconnect();

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("scroll", updateParallax);
      window.removeEventListener("resize", updateParallax);
    };
  }, []);

  return (
    <main className="about-page">
      <div className="scroll-progress" />

      <Navbar />

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-streak" />
        <div className="hero-overlay" />

        <div className="hero-content">
          <p data-letters className="hero-label">
            ABOUT X MOTORS
          </p>

          <h1 data-words className="hero-title">
            Cars Are Not | Just Objects.
          </h1>

          <p data-reveal className="hero-description">
            A team of luxury car specialists with fifteen years of
            international experience — based in Dubai.
          </p>
        </div>

        <div className="scroll-cue">
          <span>SCROLL</span>
          <div />
        </div>

        <div className="marquee">
          <div className="marquee-track" />
        </div>
      </section>

      <div className="wedge wedge-white" />

      {/* THE TEAM + PHILOSOPHY */}
      <section className="white-section">
        <div className="container">
          <div data-reveal className="section-label">
            <span>01 / THE TEAM</span>
            <i />
          </div>

          <div className="team-heading">
            <p data-words>We are a group of experts</p>
            <p data-words className="indent-one">
              specialized in luxury car sales
            </p>
            <p data-words className="indent-two">
              with 15 years of international experience.
            </p>
          </div>

          <div data-reveal className="stats">
            <div>
              <h3>
                <span data-count data-from="0" data-to="15" data-suffix="+">
                  0+
                </span>
              </h3>
              <p>YEARS INTERNATIONAL</p>
            </div>

            <div>
              <h3>
                <span data-count data-from="0" data-to="750" data-suffix="K+">
                  0K+
                </span>
              </h3>
              <p>FOLLOWERS</p>
            </div>

            <div>
              <h3>DXB</h3>
              <p>BASED IN DUBAI</p>
            </div>
          </div>

          <div data-reveal className="section-label philosophy-label">
            <span>02 / PHILOSOPHY</span>
            <i />
          </div>

          <h2 data-words className="philosophy-heading">
            Not Assets. | A Way of Life.
          </h2>

          <p data-reveal className="philosophy-description">
            Cars are not just objects to us. We don’t treat them solely
            as assets — they’re an inseparable part of our lifestyles.
          </p>

          <div className="values">
            {[
              ["01", "Looks", "The first thing you notice."],
              ["02", "Engineering", "Why it works the way it does."],
              ["03", "Handling", "How it feels when it matters."],
            ].map(([number, title, description]) => (
              <div data-vis className="value-item" key={number}>
                <div className="value-top">
                  <span>{number}</span>
                  <span>{description}</span>
                </div>

                <h3 className="giant-word">{title}</h3>
                <div className="giant-line" />
              </div>
            ))}
          </div>

          <div data-wipe className="detail-image" data-parallax>
            <img
              src="/images/xm-about-detail-1.jpeg"
              alt="X Motors luxury cars"
            />
          </div>
        </div>
      </section>

      <div className="wedge wedge-black" />

      {/* FOUNDER */}
      <section className="founder-section">
        <div className="container">
          <div data-reveal className="section-label">
            <span>03 / THE FOUNDER</span>
            <i />
          </div>

          <h2 data-words className="founder-heading">
            Collector. | Racer. | Founder.
          </h2>

          <div className="founder-grid">
            <div data-wipe className="founder-image" data-parallax>
              <img src="/images/xm-founder.jpg" alt="X Motors founder" />
            </div>

            <div className="founder-text">
              <p data-reveal className="founder-intro">
                Our founder is not only an avid car collector — he has
                vast racing experience.
              </p>

              <p data-reveal>
                When he isn’t in the office, he’s racing.
              </p>

              <p data-reveal className="founder-quote">
                He’s been there and done that.
              </p>
            </div>
          </div>

          <div className="racing-list">
            {["Radicals", "GT3 Racers", "Le Mans Prototypes"].map(
              (item, index) => (
                <div data-vis className="race-item" key={item}>
                  <div className="race-sweep" />
                  <span>0{index + 1}</span>
                  <h3>{item}</h3>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* TRACK */}
      <section className="track-section" data-parallax>
        <img src="/images/xm-track.jpg" alt="Racing track" />

        <div className="track-overlay" />

        <h2 data-words>
          The track teaches what | no spec sheet can.
        </h2>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="ghost">X</div>

        <div className="cta-content">
          <div data-reveal className="cta-line" />

          <h2 data-words>
            Find the one | that moves you.
          </h2>

          <div data-reveal className="cta-links">
            <a href="#" className="cta-button">
              EXPLORE INVENTORY
            </a>

            <a href="#" className="showroom-link">
              VISIT THE SHOWROOM <span>→</span>
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Inter:wght@300;400;500;600;800&display=swap");

        .about-page {
          background: #000;
          color: #fff;
          font-family: "Inter", sans-serif;
          overflow: hidden;
        }

        .about-page * {
          box-sizing: border-box;
        }

        .scroll-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 2px;
          width: 0;
          background: white;
          z-index: 9999;
        }

        .about-page .hero {
          position: relative;
          height: 100svh;
          min-height: 620px;
          overflow: hidden;
          background: #000;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              60% 50% at 75% 28%,
              rgba(255, 255, 255, 0.14),
              transparent 60%
            ),
            linear-gradient(160deg, #181818, #070707 60%, #000);
          animation: ken 14s ease-out forwards;
        }

        @keyframes ken {
          from { transform: scale(1.12); }
          to { transform: scale(1); }
        }

        .hero-streak {
          position: absolute;
          top: -20%;
          bottom: -20%;
          width: 16%;
          left: -30%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.09),
            transparent
          );
          transform: skewX(-18deg);
          animation: streak 6.5s ease-in-out infinite;
        }

        @keyframes streak {
          0% { left: -30%; }
          60%, 100% { left: 130%; }
        }

        .hero-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.95),
            rgba(0, 0, 0, 0.35) 45%,
            rgba(0, 0, 0, 0.2)
          );
        }

        .hero-content {
          position: absolute;
          bottom: 100px;
          left: 6%;
          right: 6%;
          z-index: 2;
        }

        .hero-label {
          font-size: 12px;
          letter-spacing: 0.4em;
          color: #a1a1aa;
          margin-bottom: 20px;
        }

        .hero-title {
          font-family: "Cormorant Garamond", serif;
          font-weight: 300;
          line-height: 1.02;
          font-size: clamp(2.7rem, 11vw, 6.5rem);
          max-width: 850px;
          margin-bottom: 24px;
        }

        .hero-description {
          color: #d4d4d8;
          font-size: 14px;
          line-height: 1.8;
          max-width: 430px;
        }

        .scroll-cue {
          position: absolute;
          right: 6%;
          bottom: 90px;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 14px;
        }

        .scroll-cue span {
          writing-mode: vertical-rl;
          font-size: 9px;
          letter-spacing: 0.3em;
          color: #a1a1aa;
        }

        .scroll-cue div {
          width: 1px;
          height: 48px;
          background: white;
          animation: cue 2.2s ease-in-out infinite;
        }

        @keyframes cue {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .marquee {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          border-top: 1px solid rgba(255,255,255,.15);
          padding: 13px 0;
          color: #a1a1aa;
          z-index: 3;
        }

        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee 32s linear infinite;
        }

        .marquee-item {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .marquee-item span {
          padding: 0 24px;
          font-size: 11px;
          letter-spacing: .4em;
        }

        .marquee-item i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }

        @keyframes marquee {
          to { transform: translateX(-50%); }
        }

        .wedge {
          width: 100%;
          height: 56px;
        }

        .wedge-white {
          background: linear-gradient(to bottom right, #000 50%, #fff 50%);
        }

        .wedge-black {
          background: linear-gradient(to bottom left, #fff 50%, #000 50%);
        }

        .white-section {
          background: white;
          color: black;
          padding: 40px 24px 100px;
        }

        .container {
          max-width: 1050px;
          margin: auto;
        }

        .section-label {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 48px;
          font-size: 11px;
          letter-spacing: .3em;
          color: #71717a;
        }

        .section-label i {
          flex: 1;
          height: 1px;
          background: #d4d4d8;
        }

        .team-heading,
        .philosophy-heading,
        .founder-heading,
        .cta-content h2 {
          font-family: "Cormorant Garamond", serif;
          font-weight: 300;
        }

        .team-heading {
          font-size: clamp(1.8rem, 6.6vw, 3.8rem);
          line-height: 1.12;
        }

        .indent-one { margin-left: 10%; }
        .indent-two { margin-left: 20%; }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          text-align: center;
          border-top: 1px solid #d4d4d8;
          border-bottom: 1px solid #d4d4d8;
          margin-top: 64px;
        }

        .stats > div {
          padding: 32px 8px;
          border-right: 1px solid #d4d4d8;
        }

        .stats > div:last-child { border: 0; }

        .stats h3 {
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2rem, 8vw, 3.4rem);
          font-weight: 300;
          margin-bottom: 12px;
        }

        .stats p {
          font-size: 9px;
          letter-spacing: .2em;
          color: #71717a;
        }

        .philosophy-label { margin-top: 110px; }

        .philosophy-heading {
          font-size: clamp(2.2rem, 9vw, 5rem);
          line-height: 1.05;
          margin-bottom: 24px;
        }

        .philosophy-description {
          color: #52525b;
          font-size: 14px;
          line-height: 1.8;
          max-width: 440px;
          margin-bottom: 60px;
        }

        .value-item {
          padding: 28px 0;
          border-top: 1px solid #d4d4d8;
        }

        .value-top {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 12px;
          color: #71717a;
          font-size: 10px;
          letter-spacing: .2em;
        }

        .giant-word {
          color: transparent;
          -webkit-text-stroke: 1px #0a0a0a;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(2.4rem, 12vw, 8rem);
          font-weight: 300;
          text-transform: uppercase;
          line-height: .9;
          transition: color .9s ease;
        }

        .value-item.vis .giant-word { color: #0a0a0a; }

        .giant-line {
          height: 1px;
          background: black;
          margin-top: 20px;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 1.1s ease;
        }

        .value-item.vis .giant-line { transform: scaleX(1); }

        .detail-image {
          position: relative;
          overflow: hidden;
          width: 100%;
          aspect-ratio: 1280 / 830;
          margin-top: 80px;
        }

        .detail-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.18);
        }

        .founder-section {
          background: #000;
          padding: 40px 24px 100px;
        }

        .founder-heading {
          font-size: clamp(2.6rem, 11vw, 6.5rem);
          line-height: 1.02;
          margin-bottom: 55px;
        }

        .founder-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: start;
          margin-bottom: 80px;
        }

        .founder-image {
          aspect-ratio: 4 / 5;
          overflow: hidden;
        }

        .founder-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .founder-text {
          padding-top: 10px;
          color: #a1a1aa;
          font-size: 14px;
          line-height: 1.8;
        }

        .founder-intro {
          font-family: "Cormorant Garamond", serif;
          font-size: 28px;
          color: white;
          line-height: 1.3;
          margin-bottom: 24px;
        }

        .founder-quote {
          font-family: "Cormorant Garamond", serif;
          font-style: italic;
          font-size: 22px;
          color: #d4d4d8;
          margin-top: 40px;
        }

        .race-item {
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: baseline;
          gap: 24px;
          padding: 25px 0;
          border-top: 1px solid #27272a;
        }

        .race-item:last-child {
          border-bottom: 1px solid #27272a;
        }

        .race-item > span {
          color: #52525b;
          font-size: 13px;
        }

        .race-item h3 {
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,.85);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.9rem, 8vw, 5rem);
          font-weight: 300;
          text-transform: uppercase;
          transition: color .8s ease;
        }

        .race-item.vis h3 { color: white; }

        .race-sweep {
          position: absolute;
          inset: 0 auto 0 0;
          width: 35%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.16),
            transparent
          );
          transform: translateX(-120%);
        }

        .race-item.vis .race-sweep {
          animation: sweep 1.4s ease forwards;
        }

        @keyframes sweep {
          to { transform: translateX(380%); }
        }

        .track-section {
          position: relative;
          height: 70vh;
          min-height: 420px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          text-align: center;
          padding: 24px;
        }

        .track-section img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.18);
        }

        .track-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.55);
        }

        .track-section h2 {
          position: relative;
          z-index: 2;
          max-width: 650px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.8rem, 6vw, 3.2rem);
          font-weight: 300;
          line-height: 1.3;
        }

        .cta-section {
          position: relative;
          overflow: hidden;
          background: #090909;
          border-top: 1px solid #27272a;
          padding: 120px 24px;
          text-align: center;
        }

        .ghost {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-family: "Cormorant Garamond", serif;
          font-size: min(95vw, 860px);
          color: transparent;
          -webkit-text-stroke: 1px rgba(255,255,255,.08);
          pointer-events: none;
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-line {
          width: 140px;
          height: 1px;
          background: #52525b;
          margin: 0 auto 40px;
        }

        .cta-content h2 {
          font-size: clamp(2.2rem, 8vw, 4.5rem);
          line-height: 1.08;
          margin-bottom: 40px;
        }

        .cta-links {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }

        .cta-button {
          display: inline-block;
          border: 1px solid rgba(255,255,255,.7);
          padding: 14px 40px;
          font-size: 11px;
          letter-spacing: .3em;
          transition: .3s;
        }

        .cta-button:hover {
          background: white;
          color: black;
        }

        .showroom-link {
          font-size: 11px;
          letter-spacing: .3em;
          color: #a1a1aa;
        }

        .showroom-link span {
          display: inline-block;
          transition: transform .3s;
        }

        .showroom-link:hover span {
          transform: translateX(6px);
        }

        .word-wrapper {
          display: inline-block;
          overflow: hidden;
          margin-right: .28em;
          vertical-align: bottom;
          padding-bottom: .08em;
        }

        .word-inner {
          display: inline-block;
          transform: translateY(115%);
          opacity: 0;
          transition:
            transform .75s cubic-bezier(.16,1,.3,1) calc(var(--i) * 70ms),
            opacity .6s ease calc(var(--i) * 70ms);
        }

        .vis .word-inner {
          transform: none;
          opacity: 1;
        }

        .letter {
          display: inline-block;
          opacity: 0;
          transform: translateY(10px);
          transition: .5s ease calc(var(--i) * 22ms);
        }

        .hero-label.vis .letter {
          opacity: 1;
          transform: none;
        }

        [data-reveal],
        [data-wipe] {
          opacity: 0;
          transform: translateY(28px);
          filter: blur(6px);
          transition: .8s ease;
        }

        [data-reveal].in,
        [data-wipe].in {
          opacity: 1;
          transform: none;
          filter: none;
        }

        @media (max-width: 767px) {
          .founder-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .founder-image {
            max-height: 600px;
          }

          .team-heading .indent-one { margin-left: 5%; }
          .team-heading .indent-two { margin-left: 10%; }

          .stats > div {
            padding: 24px 4px;
          }

          .stats p {
            font-size: 7px;
            letter-spacing: .12em;
          }

          .hero-content {
            bottom: 100px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-page *,
          .about-page *::before,
          .about-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </main>
  );
}