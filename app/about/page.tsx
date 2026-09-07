'use client'
import { useEffect, useRef, useState } from 'react'

const PHONE = "01006666802" // خليها زي الرقم المستخدم عندك فعليًا في باقي الصفحات

function useReveal(threshold = 0.25) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, inView }
}

const values = [
  {
    title: "Curated, not stocked",
    text: "Every car on our floor is chosen by hand — we'd rather show you fifteen exceptional cars than a hundred ordinary ones.",
  },
  {
    title: "Prices you can trust",
    text: "No hidden fees, no last-minute surprises. What we quote is what you pay, from the first call to the handover.",
  },
  {
    title: "Service that outlasts the sale",
    text: "Our relationship with you doesn't end at delivery. Paperwork, maintenance referrals, resale — we stay reachable.",
  },
]

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150)
    return () => clearTimeout(t)
  }, [])

  const story = useReveal(0.2)
  const whyUs = useReveal(0.3)

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }

        .bar {
          display: block;
          width: 24px;
          height: 1px;
          background: white;
          transition: transform 0.4s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }

        .hero-fade {
          background: linear-gradient(
            to top,
            #000 0%,
            #000 32%,
            rgba(0,0,0,0.88) 48%,
            rgba(0,0,0,0.45) 68%,
            rgba(0,0,0,0.05) 88%,
            transparent 100%
          );
        }

        .reveal-up {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-up.in { opacity: 1; transform: translateY(0); }
        .reveal-delay-1 { transition-delay: 0.12s; }
        .reveal-delay-2 { transition-delay: 0.24s; }
        .reveal-delay-3 { transition-delay: 0.36s; }
      `}</style>

      {/* ========== NAVBAR ========== */}
      <nav className={`fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 py-5 transition-all duration-500 ${scrolled ? 'bg-black border-b border-zinc-800' : 'bg-transparent'}`}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="touch-manipulation cursor-pointer z-[60] relative flex flex-col gap-[5px]"
          aria-label="Menu"
        >
          <span className={`bar ${menuOpen ? 'bar-1-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-2-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-3-open' : ''}`}></span>
        </button>
        <a href="/"><img src="/logo-nav.png" alt="Automotive Hub" className="h-6 w-auto md:h-8" /></a>
        <div className="w-6" />
      </nav>

      {/* ========== MOBILE MENU ========== */}
      <div className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {['Inventory', 'Sell Your Car', 'Contact', 'About'].map((item, i) => (
          <a key={i} href="#"
            onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
            {item}
          </a>
        ))}
        <a href="https://instagram.com/automotivehubegy" target="_blank"
          onClick={() => setMenuOpen(false)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
          Instagram
        </a>
      </div>

      {/* ========== HERO ========== */}
      <section className="relative h-[62vh] md:h-[70vh] min-h-[420px] w-full overflow-hidden">
        <img
          src="/about-hero.jpg"
          alt="Automotive Hub showroom"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 hero-fade" />

        <div className="absolute bottom-10 md:bottom-14 left-0 right-0 px-6 md:px-16">
          <div
            className={`flex items-center gap-3 text-xs tracking-[0.3em] text-zinc-400 mb-5 transition-all duration-700 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
            }`}
          >
            <a href="/" className="hover:text-white transition-colors">HOME</a>
            <span className="text-zinc-700">/</span>
            <span className="relative text-white pb-0.5">
              ABOUT US
              <span className="absolute left-0 -bottom-0.5 h-px w-full bg-white" />
            </span>
          </div>

          <h1
            className={`font-display text-4xl md:text-6xl font-light leading-[1.1] max-w-xl transition-all duration-1000 ${
              loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            Cars we'd want to own ourselves.
          </h1>
        </div>
      </section>

      {/* ========== STORY ========== */}
<section className="bg-black px-6 md:px-16 py-20 md:py-28 border-t border-zinc-900">
  <div className="grid md:grid-cols-2 gap-12 md:gap-8 items-center max-w-6xl mx-auto">
    <div
      ref={story.ref}
      className={`reveal-up ${story.inView ? 'in' : ''} order-2 md:order-1'`}
    >
      <p className="text-xs tracking-[0.35em] text-zinc-500 mb-6">OUR STORY</p>
      <h2 className="font-display text-3xl md:text-4xl font-light mb-6 leading-snug">
        We started with one rule: never sell a car we wouldn't drive.
      </h2>
      <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-4 max-w-md">
        Automotive Hub began three years ago as a small team tired of the guesswork that
        comes with buying a used luxury car in Egypt. Since then, we've sold over a
        thousand vehicles — but the rule hasn't changed.
      </p>
      <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-md">
        Every car that reaches our floor is inspected, priced honestly, and backed by
        someone you can actually call back. That's the whole business model.
      </p>
    </div>

    <div
      className={`reveal-up reveal-delay-2 ${story.inView ? 'in' : ''} order-1 md:order-2`}
    >
      <img
        src="/about-story.jpg"
        alt="Inside the showroom"
        className="w-full rounded-2xl object-cover aspect-[4/5]"
      />
    </div>
  </div>
</section>

      {/* ========== WHY US ========== */}
      <section className="bg-black px-6 md:px-16 py-20 md:py-28 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div
            ref={whyUs.ref}
            className={`reveal-up ${whyUs.inView ? 'in' : ''} mb-14 max-w-lg`}
          >
            <p className="text-xs tracking-[0.35em] text-zinc-500 mb-5">WHY US</p>
            <h2 className="font-display text-3xl md:text-4xl font-light leading-snug">
              What you get when you buy through us.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 md:gap-10">
            {values.map((v, i) => {
              const { ref, inView } = useReveal(0.3)
              return (
                <div
                  key={i}
                  ref={ref}
                  className={`reveal-up ${inView ? 'in' : ''} border-t border-zinc-800 pt-6`}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <h3 className="font-display text-xl font-light mb-3 text-white">{v.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{v.text}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600" />
          <button type="submit" className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            SUBSCRIBE
          </button>
        </form>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-zinc-950 border-t border-zinc-800 px-6 py-14">
        <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-xs">
          Egypt&apos;s trusted ultimate exotics marketplace. Quality vehicles, transparent pricing, exceptional service.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">SHOWROOM</p>
            {['Inventory', 'Sell Your Car', 'Compare', 'News & Blogs'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">ABOUT US</p>
            {['About Us', 'Services', 'Terms & Conditions', 'Privacy Policy'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">FOLLOW US</p>
            <a href="https://instagram.com/automotivehubegy" target="_blank" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Instagram</a>
            {['TikTok', 'Facebook'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">CONTACT</p>
          <div className="flex flex-col gap-2">
            <a href={`tel:${PHONE}`} className="text-sm text-zinc-400 hover:text-white transition-colors">📞 {PHONE}</a>
            <a href="mailto:automotivehub@gmail.com" className="text-sm text-zinc-400 hover:text-white transition-colors">✉️ automotivehub@gmail.com</a>
            <p className="text-sm text-zinc-400">📍 Cairo, Egypt</p>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-10 text-center flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Automotive Hub. All rights reserved.</p>
          <img src="/logo-full.png" alt="Automotive Hub" className="h-10 w-auto opacity-80" />
        </div>
      </footer>
    </main>
  )
}