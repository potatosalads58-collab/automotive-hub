'use client'

import { useEffect, useRef, useState, ReactNode } from 'react'
import Footer from '@/components/Footer'

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

function useInView<T extends HTMLElement>(threshold = 0.2): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
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

// Text / block reveal — fade + rise
function Reveal({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const [ref, visible] = useInView<HTMLDivElement>()
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

// Image reveal — fade + slow zoom-out on entry, then an optional
// gentle continuous drift (kenburns) once it's actually on screen.
function RevealImage({
  src,
  alt,
  className = '',
  delay = 0,
  drift = false,
}: {
  src: string
  alt: string
  className?: string
  delay?: number
  drift?: boolean
}) {
  const [ref, visible] = useInView<HTMLImageElement>()
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`img-reveal ${visible ? 'img-reveal-visible' : ''} ${
        drift && visible ? 'kenburns' : ''
      } ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    />
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
        <RevealImage
          src="/wraith-hero.jpg"
          alt="Rolls-Royce Wraith at Automotive Hub"
          className="absolute inset-0 h-full w-full object-cover"
          drift
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
          <RevealImage
            src="/wraith-detail-main.jpg"
            alt="Rolls-Royce Wraith sill plate detail"
            className="h-full w-full object-cover"
            drift
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
            <RevealImage
              src="/wraith-detail-1.jpg"
              alt="control dial detail"
              className="h-full w-full object-cover"
              delay={0}
            />
          </div>
          <div className="aspect-[3/2.1] overflow-hidden">
            <RevealImage
              src="/wraith-detail-2.jpg"
              alt="dashboard screen detail"
              className="h-full w-full object-cover"
              delay={120}
            />
          </div>
          <div className="aspect-[3/2.1] overflow-hidden">
            <RevealImage
              src="/wraith-detail-3.jpg"
              alt="headrest detail"
              className="h-full w-full object-cover"
              delay={240}
            />
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
        <RevealImage
          src="/wraith-cinematic.jpg"
          alt="Rolls-Royce Wraith door handle detail"
          className="absolute inset-0 h-full w-full object-cover"
          drift
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
          <RevealImage
            src="/showroom.jpg"
            alt="Automotive Hub showroom"
            className="h-full w-full object-cover"
            drift
          />
        </div>
      </section>

      {/* ========== 08 — CLOSING ========== */}
      <section className="relative px-6 py-28 min-h-[380px] flex items-end overflow-hidden">
        <RevealImage
          src="/wraith-closing.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          drift
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
<Footer />

      <style jsx global>{`
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .reveal-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .img-reveal {
          opacity: 0;
          transform: scale(1.12);
          transition: opacity 1.3s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .img-reveal-visible {
          opacity: 1;
          transform: scale(1);
        }
        .kenburns {
          animation: kenburns 16s ease-out forwards;
          animation-delay: 0.3s;
        }
        @keyframes kenburns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.09);
          }
        }
        .bar {
          display: block;
          width: 24px;
          height: 1px;
          background: white;
          transition: transform 0.4s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bar-1-open {
          transform: translateY(5px) rotate(45deg);
        }
        .bar-2-open {
          opacity: 0;
          transform: scaleX(0);
        }
        .bar-3-open {
          transform: translateY(-5px) rotate(-45deg);
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal,
          .img-reveal {
            transition: none;
            opacity: 1;
            transform: none;
          }
          .kenburns {
            animation: none;
          }
        }
      `}</style>
    </main>
  )
}

      
