'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'

const PHONE = '01010166333'
const EMAIL = 'Info@automotivehub.com'
const INSTAGRAM_URL = 'https://instagram.com/automotivehubegy'
const THREADS_URL = 'https://www.threads.net/@automotivehubegy'
const FACEBOOK_URL = 'https://www.facebook.com/share/14nBzBzMDiU/'

const NAV_LINKS = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Sell Your Car', href: '/sell-your-car' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'Threads', href: THREADS_URL },
  { label: 'Facebook', href: FACEBOOK_URL },
]

/*
  ============================================================
  IMAGES — drop these into your /public folder with these
  exact filenames:

  /logo-nav.png            — existing navbar logo
  /logo-full.png           — existing footer logo
  /wraith-hero.jpg         — blue Wraith outside showroom (HERO)
  /wraith-detail-main.jpg  — "WRAITH" sill plate (DETAIL — main)
  /wraith-detail-1.jpg     — silver control dial (DETAIL — mosaic)
  /wraith-detail-2.jpg     — dashboard screen (DETAIL — mosaic)
  /wraith-detail-3.jpg     — headrest / starlight (DETAIL — mosaic)
  /wraith-cinematic.jpg    — door handle + RR badge, dusk (CINEMATIC BREAK)
  /showroom.jpg            — black Wraith front end (SHOWROOM)
  /wraith-closing.jpg      — steering wheel wide shot (CLOSING bg)
  ============================================================
*/

function useReveal(threshold = 0.2): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [ref, visible] = useReveal()
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    setSocialOpen(false)
  }

  return (
    <main className="bg-black text-white overflow-x-hidden">
      {/* ========== NAVBAR ========== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 py-5 transition-all duration-500 ${
          scrolled ? 'bg-black border-b border-zinc-800' : 'bg-transparent'
        }`}
      >
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="touch-manipulation cursor-pointer z-[60] relative flex flex-col gap-[5px]"
          aria-label="Menu"
        >
          <span className={`bar ${menuOpen ? 'bar-1-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-2-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-3-open' : ''}`}></span>
        </button>
        <a href="/">
          <img src="/logo-nav.png" alt="Automotive Hub" className="h-6 w-auto md:h-8" />
        </a>
        <div className="w-6" />
      </nav>

      {/* ========== MOBILE MENU ========== */}
      <div
        className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 overflow-y-auto transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {NAV_LINKS.map((item, i) => (
          <a
            key={i}
            href={item.href}
            onClick={closeMenu}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300"
          >
            {item.label}
          </a>
        ))}

        {/* Social dropdown */}
        <button
          onClick={() => setSocialOpen(!socialOpen)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300 flex items-center justify-between w-full text-left"
        >
          Social
          <span
            className="text-lg transition-transform duration-300"
            style={{ transform: socialOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            ↓
          </span>
        </button>
        <div
          className="overflow-hidden transition-all duration-400"
          style={{ maxHeight: socialOpen ? `${SOCIAL_LINKS.length * 64}px` : '0px' }}
        >
          {SOCIAL_LINKS.map((social, i) => (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              className="block font-display text-xl font-light tracking-widest py-4 pl-4 border-b border-zinc-900 text-zinc-400 hover:text-white transition-colors duration-300"
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>

      {/* ========== 01 — HERO ========== */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <img
          src="/wraith-hero.jpg"
          alt="Rolls-Royce Wraith at Automotive Hub"
          className="kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16">
          <Reveal delay={0}>
            <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">ABOUT AUTOMOTIVE HUB</p>
          </Reveal>
          <Reveal delay={150}>
            <h1 className="font-display text-4xl font-light leading-[1.15] mb-6">
              A different standard
              <br />
              of automotive.
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-xs mb-10">
              Automotive Hub is an Egypt-based premium automotive house built around
              exceptional cars, considered selection, and an uncompromising approach
              to quality.
            </p>
          </Reveal>
          <Reveal delay={450}>
            <div className="flex flex-col items-start gap-2 text-zinc-500">
              <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
              <span className="text-sm">↓</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== 02 — BRAND PHILOSOPHY ========== */}
      <section className="bg-black px-6 py-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-8">
            <span className="text-xs tracking-[0.3em] text-zinc-500">01 / THE HOUSE</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-display text-3xl font-light leading-snug max-w-sm">
            We believe the right car should feel exceptional before you even
            drive it.
          </h2>
        </Reveal>
      </section>

      {/* ========== 03 — OUR STORY ========== */}
      <section className="bg-black px-6 pb-24">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-zinc-500 mb-8">OUR STORY</p>
        </Reveal>
        <div className="space-y-6 text-zinc-400 text-[15px] leading-relaxed max-w-md">
          {[
            'Automotive Hub was created with a simple idea: exceptional cars deserve a different kind of destination.',
            'We curate a collection defined not by volume, but by character — bringing together premium automobiles, rare specifications and remarkable examples for clients who understand the difference.',
            'From the moment a car enters our collection to the moment it finds its next owner, every detail is considered.',
            'Because at this level, the experience surrounding the car matters just as much as the car itself.',
          ].map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <p>{p}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== 04 — DETAIL SPREAD ========== */}
      <section className="bg-black">
        <div className="w-full aspect-[4/5] overflow-hidden">
          <img
            src="/wraith-detail-main.jpg"
            alt="Rolls-Royce Wraith sill plate detail"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="px-6 py-14">
          <Reveal>
            <p className="text-xs tracking-[0.3em] text-zinc-500 mb-6">DETAIL MATTERS.</p>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="font-display text-2xl font-light leading-snug mb-6 max-w-sm">
              Our approach is defined by the details others overlook.
            </h3>
          </Reveal>
          <Reveal delay={240}>
            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              It's in the materials, the craftsmanship, the finishes, and the
              little things that turn a great car into something unforgettable.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-[1.2fr_1fr] gap-[2px] px-6 pb-24">
          <div className="row-span-2 aspect-[3/4] overflow-hidden">
            <img src="/wraith-detail-1.jpg" alt="control dial detail" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-[3/2.1] overflow-hidden">
            <img src="/wraith-detail-2.jpg" alt="dashboard screen detail" className="h-full w-full object-cover" />
          </div>
          <div className="aspect-[3/2.1] overflow-hidden">
            <img src="/wraith-detail-3.jpg" alt="headrest detail" className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      {/* ========== 05 — THE AUTOMOTIVE HUB APPROACH ========== */}
      <section className="bg-black px-6 py-24">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-zinc-500 mb-2">
            THE AUTOMOTIVE HUB APPROACH
          </p>
        </Reveal>
        <span className="block h-px w-10 bg-zinc-700 mb-14" />

        <div className="divide-y divide-zinc-900">
          {[
            {
              n: '01',
              title: 'CURATION',
              body: "We don't aim to offer everything. We aim to offer the right things.",
            },
            {
              n: '02',
              title: 'CONDITION',
              body: 'Every vehicle represents the standard we want Automotive Hub to be known for.',
            },
            {
              n: '03',
              title: 'EXPERIENCE',
              body: 'From selection to presentation, every interaction should feel considered.',
            },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 100}>
              <div className="py-8 flex gap-6">
                <span className="font-display text-4xl font-light text-zinc-600 leading-none w-12 shrink-0">
                  {item.n}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <span className="text-xs tracking-[0.25em] text-white">{item.title}</span>
                    <span className="h-px flex-1 bg-zinc-800" />
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ========== 06 — CINEMATIC VISUAL BREAK ========== */}
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden flex items-center justify-center">
        <img
          src="/wraith-cinematic.jpg"
          alt="Rolls-Royce Wraith door handle detail"
          className="kenburns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />
        <Reveal className="relative text-center px-6">
          <p className="font-display text-2xl font-light mb-3">
            Exceptional is in the details.
          </p>
          <p className="text-[10px] tracking-[0.35em] text-zinc-400">AUTOMOTIVE HUB</p>
        </Reveal>
      </section>

      {/* ========== 07 — THE SHOWROOM ========== */}
      <section className="bg-black px-6 py-24">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-zinc-500 mb-6">THE SHOWROOM</p>
        </Reveal>
        <Reveal delay={120}>
          <h3 className="font-display text-2xl font-light leading-snug mb-6 max-w-xs">
            A physical destination built around the cars themselves.
          </h3>
        </Reveal>
        <Reveal delay={240}>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-10">
            Located in Egypt, Automotive Hub was designed to give exceptional
            automobiles the environment they deserve — considered, private and
            focused entirely on the experience of the car.
          </p>
        </Reveal>
        <div className="ml-10 w-[calc(100%-2.5rem)] aspect-[4/3] overflow-hidden">
          <img
            src="/showroom.jpg"
            alt="Automotive Hub showroom"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      {/* ========== 08 — CLOSING ========== */}
      <section className="relative px-6 py-28 min-h-[380px] flex items-end overflow-hidden">
        <img
          src="/wraith-closing.jpg"
          alt=""
          className="kenburns absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-black/65" />
        <Reveal className="relative">
          <h3 className="font-display text-3xl font-light leading-snug mb-8">
            Some cars are
            <br />
            simply different.
          </h3>
          <a
            href="/inventory"
            className="text-xs tracking-[0.3em] text-zinc-300 hover:text-white transition-colors"
          >
            EXPLORE THE COLLECTION →
          </a>
        </Reveal>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            alert('Subscribed!')
          }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            required
            placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600"
          />
          <button
            type="submit"
            className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="bg-zinc-950 border-t border-zinc-800 px-6 py-14">
        <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-xs">
          Egypt&apos;s trusted ultimate exotics marketplace. Quality vehicles, transparent pricing, exceptional service.
        </p>
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">SHOWROOM</p>
            <a href="/inventory" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Inventory</a>
            <a href="/sell-your-car" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Sell Your Car</a>
            <a href="/news" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">News</a>
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">ABOUT US</p>
            <a href="/about" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">About Us</a>
            <a href="/contact" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Contact</a>
            <a href="/privacy" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Privacy Policy &amp; Terms</a>
          </div>
        </div>
        <div className="mb-10">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">FOLLOW US</p>
          <div className="flex gap-4">
            <a href={INSTAGRAM_URL} target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Instagram</a>
            <a href={THREADS_URL} target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Threads</a>
            <a href={FACEBOOK_URL} target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">CONTACT</p>
          <div className="flex flex-col gap-3">
            <a href={`tel:${PHONE}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              0101 016 6333
            </a>
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
              {EMAIL}
            </a>
            <p className="flex items-center gap-3 text-sm text-zinc-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              6th of October, Cairo, Egypt
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-10 text-center flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Automotive Hub. All rights reserved.</p>
         
