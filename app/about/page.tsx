'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/*
  ============================================================
  IMAGES NEEDED — drop these into /public with these exact names:

  /goldenn-hero.jpg          — wide showroom shot, several cars in one frame
  /goldenn-archive.jpg       — REAL 1980s archive photo if you have one,
                                otherwise a moody classic-car photo (no fake aging)
  /goldenn-today.jpg         — your strongest current hero car / showroom shot
  /goldenn-collection.jpg    — wide shot showing the range of categories
  /goldenn-cinematic.jpg     — the horse + supercar shot (mood break)
  /goldenn-classics-card.jpg — represents Golden N Classics
  /goldenn-mrp-card.jpg      — represents MRP (maintenance/restoration)
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

// Repeatable (re-triggers every time it enters view) — used only by CountNumber.
function useInViewRepeat<T extends HTMLElement>(threshold = 0.5): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, visible] = useInView<HTMLDivElement>()
  return (
    <div ref={ref} className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`} style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}>
      {children}
    </div>
  )
}

function RevealImage({ src, alt, className = '', delay = 0, drift = false }: { src: string; alt: string; className?: string; delay?: number; drift?: boolean }) {
  const [ref, visible] = useInView<HTMLImageElement>()
  return (
    <img
      ref={ref}
      src={src}
      alt={alt}
      className={`img-reveal ${visible ? 'img-reveal-visible' : ''} ${drift && visible ? 'kenburns' : ''} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : '0ms' }}
    />
  )
}

function RevealHeading({ text, as = 'h2', className = '', wordDelay = 70 }: { text: string; as?: 'h1' | 'h2'; className?: string; wordDelay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const content = text.split(' ').map((word, i) => (
    <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-bottom">
      <span
        className="inline-block"
        style={{
          transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * wordDelay}ms, opacity 0.6s ease ${i * wordDelay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0%)' : 'translateY(115%)',
        }}
      >
        {word}
      </span>
    </span>
  ))

  if (as === 'h1') return <h1 ref={ref} className={className}>{content}</h1>
  return <h2 ref={ref} className={className}>{content}</h2>
}

function LetterReveal({ text, className = '' }: { text: string; className?: string }) {
  const [ref, visible] = useInView<HTMLParagraphElement>(0.5)
  return (
    <p ref={ref} className={className}>
      {text.split('').map((ch, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0px)' : 'translateY(10px)',
            filter: visible ? 'blur(0px)' : 'blur(3px)',
            transition: `opacity 0.5s ease ${i * 22}ms, transform 0.5s ease ${i * 22}ms, filter 0.5s ease ${i * 22}ms`,
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </span>
      ))}
    </p>
  )
}

function CountNumber({ from, to, suffix = '', duration = 1500 }: { from: number; to: number; suffix?: string; duration?: number }) {
  const [ref, visible] = useInViewRepeat<HTMLSpanElement>(0.5)
  const [value, setValue] = useState(from)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (!visible) {
      setValue(from)
      return
    }
    const start = performance.now()
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(from + (to - from) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [visible, from, to, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

function DividerGrow({ className = '' }: { className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.6)
  return <div ref={ref} className={`divider-grow h-px bg-zinc-600 ${className}`} style={{ width: visible ? '140px' : '0px' }} />
}

export default function AboutPage() {
  return (
    <main className="bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* ========== HERO ========== */}
      <section className="relative h-screen min-h-[640px] w-full overflow-hidden">
        <RevealImage src="/goldenn-hero.jpg" alt="Golden N showroom" className="absolute inset-0 h-full w-full object-cover" drift />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-16">
          <LetterReveal text="A LEGACY SINCE 1984" className="text-xs tracking-[0.4em] text-zinc-400 mb-5" />
          <RevealHeading as="h1" text="More Than Cars. A History." className="font-display text-4xl md:text-6xl font-light leading-[1.1] mb-6 max-w-lg" />
          <Reveal delay={250}>
            <p className="text-sm text-zinc-300 leading-relaxed max-w-xs mb-10">
              A journey shaped by exceptional automobiles, four decades of passion, and a collection that has never stopped evolving.
            </p>
          </Reveal>
          <Reveal delay={400}>
            <div className="flex items-center gap-2 text-zinc-500">
              <span className="text-[10px] tracking-[0.3em]">SCROLL</span>
              <span className="text-sm">↓</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== 01 — WHERE IT BEGAN / THEN & NOW ========== */}
      <section className="bg-black px-6 py-24">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs tracking-[0.3em] text-zinc-500">01 / THE BEGINNING</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
        </Reveal>

        <Reveal>
          <p className="font-display text-7xl md:text-8xl font-light leading-none mb-4">
            <CountNumber from={new Date().getFullYear()} to={1984} duration={1800} />
          </p>
          <p className="text-xs tracking-[0.3em] text-zinc-500 mb-6">WHERE IT BEGAN</p>
          <h2 className="font-display text-2xl font-light leading-snug mb-5 max-w-sm">The First Chapter.</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mb-14">
            Golden N&apos;s story began in 1984 — long before &quot;showroom&quot; meant what it does today.
            What started with a single idea has carried through four decades of changing tastes,
            changing roads, and an ever-growing collection.
          </p>
        </Reveal>

        <div className="grid grid-cols-2 gap-4">
          <Reveal delay={100}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <RevealImage src="/goldenn-archive.jpg" alt="Golden N heritage" className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-[10px] tracking-[0.3em]">THEN</p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <RevealImage src="/goldenn-today.jpg" alt="Golden N today" className="h-full w-full object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <p className="text-white text-[10px] tracking-[0.3em]">NOW</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ========== 02 — THE COLLECTION ========== */}
      <section className="bg-black px-6 py-24 border-t border-zinc-900">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs tracking-[0.3em] text-zinc-500">02 / THE COLLECTION</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-3xl md:text-4xl font-light leading-snug mb-6 max-w-md">
            Different Eras. One Roof.
          </h2>
        </Reveal>
        <Reveal delay={200}>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-md mb-12">
            From the classics that built our name to the newest arrivals on the floor today,
            Golden N continues its story through a single, curated destination — the bridge
            between everything we&apos;ve been, and everything still to come.
          </p>
        </Reveal>
        <div className="w-full aspect-[16/10] overflow-hidden rounded-xl">
          <RevealImage src="/goldenn-collection.jpg" alt="Golden N collection" className="h-full w-full object-cover" drift />
        </div>
      </section>

      {/* ========== 03 — THE GOLDEN N APPROACH ========== */}
      <section className="bg-black px-6 py-24 border-t border-zinc-900">
        <Reveal>
          <p className="text-xs tracking-[0.3em] text-zinc-500 mb-2">THE GOLDEN N APPROACH</p>
        </Reveal>
        <span className="block h-px w-10 bg-zinc-700 mb-14 mt-4" />

        <div className="divide-y divide-zinc-900">
          {[
            { n: '01', title: 'BREADTH', body: "We never believed one category was enough. From everyday classics to the rarest machines, if it has a story worth telling, it has a place here." },
            { n: '02', title: 'CONDITION', body: 'Every vehicle, regardless of class, meets the same standard before it reaches our floor.' },
            { n: '03', title: 'EXPERIENCE', body: "Four decades in, how you're treated still matters as much as what you're buying." },
          ].map((item, i) => (
            <Reveal key={item.n} delay={i * 100}>
              <div className="py-8 flex gap-6">
                <span className="font-display text-4xl font-light text-zinc-600 leading-none w-12 shrink-0">{item.n}</span>
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

      {/* ========== 04 — CINEMATIC BREAK ========== */}
      <section className="relative h-[70vh] min-h-[460px] w-full overflow-hidden flex items-center justify-center">
        <RevealImage src="/goldenn-cinematic.jpg" alt="Golden N" className="absolute inset-0 h-full w-full object-cover" drift />
        <div className="absolute inset-0 bg-black/45" />
        <Reveal className="relative text-center px-6">
          <p className="font-display text-2xl font-light mb-3">Exceptional is in the details.</p>
          <p className="text-[10px] tracking-[0.35em] text-zinc-300">GOLDEN N</p>
        </Reveal>
      </section>

      {/* ========== 05 — BEYOND THE SHOWROOM ========== */}
      <section className="bg-black px-6 py-24 border-t border-zinc-900">
        <Reveal>
          <div className="flex items-center gap-4 mb-10">
            <span className="text-xs tracking-[0.3em] text-zinc-500">03 / BEYOND THE SHOWROOM</span>
            <span className="h-px flex-1 bg-zinc-800" />
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="font-display text-3xl font-light leading-snug mb-12 max-w-md">More to Discover.</h2>
        </Reveal>

        <div className="grid gap-5">
          <Reveal delay={150}>
            <a href="#" className="venture-card group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-800">
              <RevealImage src="/goldenn-classics-card.jpg" alt="Golden N Classics" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs tracking-[0.3em] text-zinc-300 mb-2">GOLDEN N CLASSICS</p>
                <p className="text-white text-lg font-display font-light mb-4 leading-snug max-w-xs">A dedicated gallery for collectible and classic automobiles.</p>
                <span className="text-xs tracking-[0.25em] text-white border-b border-white/50 pb-1">EXPLORE CLASSICS ↗</span>
              </div>
            </a>
          </Reveal>
          <Reveal delay={250}>
            <a href="#" className="venture-card group relative block aspect-[16/10] overflow-hidden rounded-2xl border border-zinc-800">
              <RevealImage src="/goldenn-mrp-card.jpg" alt="MRP" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <p className="text-xs tracking-[0.3em] text-zinc-300 mb-2">MAINTENANCE &amp; RESTORATION</p>
                <p className="text-white text-lg font-display font-light mb-4 leading-snug max-w-xs">Restoration, PPF, customization, and specialist care.</p>
                <span className="text-xs tracking-[0.25em] text-white border-b border-white/50 pb-1">DISCOVER MORE ↗</span>
              </div>
            </a>
          </Reveal>
        </div>
      </section>

      {/* ========== 06 — CLOSING ========== */}
      <section className="relative px-6 py-28 bg-zinc-950 border-t border-zinc-900 text-center overflow-hidden">
        <Reveal className="flex justify-center mb-10">
          <DividerGrow />
        </Reveal>
        <Reveal delay={100}>
          <h3 className="font-display text-3xl md:text-4xl font-light leading-snug mb-8">
            The Next Chapter<br />Is On The Road.
          </h3>
        </Reveal>
        <Reveal delay={220}>
          <a href="/inventory" className="inline-block border border-white/70 text-white px-10 py-3.5 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            EXPLORE THE COLLECTION
          </a>
        </Reveal>
      </section>

      {/* ========== NEWSLETTER ========== */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600" />
          <button type="submit" className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            SUBSCRIBE
          </button>
        </form>
      </section>

      <Footer />

      <style jsx global>{`
        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.9s cubic-bezier(0.16,1,0.3,1), transform 0.9s cubic-bezier(0.16,1,0.3,1); }
        .reveal-visible { opacity: 1; transform: translateY(0); }
        .img-reveal { opacity: 0; transform: scale(1.12); transition: opacity 1.3s cubic-bezier(0.16,1,0.3,1), transform 1.6s cubic-bezier(0.16,1,0.3,1); }
        .img-reveal-visible { opacity: 1; transform: scale(1); }
        .kenburns { animation: kenburns 16s ease-out forwards; animation-delay: 0.3s; }
        @keyframes kenburns { 0% { transform: scale(1); } 100% { transform: scale(1.09); } }
        .divider-grow { transition: width 1.1s cubic-bezier(0.16,1,0.3,1) 200ms; }
        .venture-card { transition: border-color 0.3s ease; }
        .venture-card:hover { border-color: rgba(255,255,255,0.6); }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .img-reveal { transition: none; opacity: 1; transform: none; }
          .kenburns { animation: none; }
        }
      `}</style>
    </main>
  )
              }
