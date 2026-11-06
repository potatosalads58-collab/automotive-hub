'use client'
import { useEffect, useRef, useState, ReactNode } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

/*
  IMAGES (put in /public):
  /xm-about-hero.jpg   dark, cinematic car shot
  /xm-studio.jpg       studio shot on pure white background, no text on it
  /xm-detail.jpg       close-up detail on white background (wing, wheel, headlight)
*/

const EXPERIENCE_SINCE = 2011
const FOLLOWERS_K = 750

function useInView<T extends HTMLElement>(threshold = 0.15, once = false): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          if (once) obs.disconnect()
        } else if (!once) {
          setVisible(false)
        }
      },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])

  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter 0.8s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(28px)',
        filter: visible ? 'blur(0px)' : 'blur(6px)',
      }}
    >
      {children}
    </div>
  )
}

// Word-by-word heading. Use "|" inside the text to force a line break.
function RevealHeading({
  text, as = 'h2', className = '', wordDelay = 70,
}: { text: string; as?: 'h1' | 'h2' | 'h3'; className?: string; wordDelay?: number }) {
  const [ref, visible] = useInView<HTMLHeadingElement>(0.3)
  let index = 0

  const content = text.split(' ').map((word, i) => {
    if (word === '|') return <br key={`br-${i}`} />
    const d = index * wordDelay
    index += 1
    return (
      <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-bottom pb-[0.08em]">
        <span
          className="inline-block"
          style={{
            transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${d}ms, opacity 0.6s ease ${d}ms`,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0%)' : 'translateY(115%)',
          }}
        >
          {word}
        </span>
      </span>
    )
  })

  if (as === 'h1') return <h1 ref={ref} className={className}>{content}</h1>
  if (as === 'h3') return <h3 ref={ref} className={className}>{content}</h3>
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

function CountNumber({
  from, to, suffix = '', duration = 1500,
}: { from: number; to: number; suffix?: string; duration?: number }) {
  const [ref, visible] = useInView<HTMLSpanElement>(0.5)
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
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [visible, from, to, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

function ScrollProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight
      setP(h > 0 ? window.scrollY / h : 0)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 z-[70] h-[2px] bg-white mix-blend-difference"
      style={{ width: `${p * 100}%` }}
    />
  )
}

function Marquee({
  items, className = '', itemClassName = '', speed = 32,
}: { items: string[]; className?: string; itemClassName?: string; speed?: number }) {
  const row = items.map((t, i) => (
    <span key={i} className="flex shrink-0 items-center">
      <span className={itemClassName}>{t}</span>
      <span className="mx-6 h-1 w-1 rounded-full bg-current opacity-50" />
    </span>
  ))
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee-track flex w-max" style={{ animationDuration: `${speed}s` }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="flex shrink-0 items-center">{row}</div>
        ))}
      </div>
    </div>
  )
}

function ParallaxImage({
  src, alt, className = '', strength = 1, scale = 1.15,
}: { src: string; alt: string; className?: string; strength?: number; scale?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      const wrap = wrapRef.current
      const img = imgRef.current
      if (!wrap || !img) return
      const rect = wrap.getBoundingClientRect()
      const vh = window.innerHeight
      if (rect.bottom < -100 || rect.top > vh + 100) return
      let p = (rect.top + rect.height / 2 - vh / 2) / vh
      p = Math.max(-0.8, Math.min(0.8, p))
      img.style.transform = `translate3d(0, ${(-p * 40 * strength).toFixed(1)}px, 0) scale(${scale})`
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength, scale])

  return (
    <div ref={wrapRef} className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{ transform: `scale(${scale})` }}
      />
    </div>
  )
}

function WipeFrame({
  children, className = '', style, delay = 0,
}: { children: ReactNode; className?: string; style?: React.CSSProperties; delay?: number }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.15, true)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
        transition: `clip-path 1.3s cubic-bezier(0.77,0,0.175,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

function Wedge({ from, to, dir = 'right' }: { from: string; to: string; dir?: 'right' | 'left' }) {
  return (
    <div
      aria-hidden
      className="h-12 w-full md:h-24"
      style={{ background: `linear-gradient(to bottom ${dir}, ${from} 50%, ${to} 50%)` }}
    />
  )
}

// Big outline word that fills in when it scrolls into view.
function GiantWord({ n, word, line }: { n: string; word: string; line: string }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.45)
  return (
    <div ref={ref} className="border-t border-zinc-300 py-7">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[10px] tracking-[0.35em] text-zinc-500">{n}</span>
        <span
          className="text-right text-[11px] text-zinc-500"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0px)' : 'translateY(8px)',
            transition: 'all 0.7s ease 0.5s',
          }}
        >
          {line}
        </span>
      </div>
      <p
        className="whitespace-nowrap font-display font-light uppercase leading-[0.9]"
        style={{
          fontSize: 'clamp(2.4rem,12vw,8rem)',
          color: visible ? '#0a0a0a' : 'transparent',
          WebkitTextStroke: '1px #0a0a0a',
          transition: 'color 0.9s ease 0.15s',
        }}
      >
        {word}
      </p>
      <div
        className="mt-5 h-px bg-black"
        style={{
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: 'left',
          transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1) 0.2s',
        }}
      />
    </div>
  )
}

function CtaRow({
  n, label, title, href, last = false,
}: { n: string; label: string; title: string; href: string; last?: boolean }) {
  return (
    <a
      href={href}
      className={`cta-row group relative flex items-center justify-between overflow-hidden border-t border-zinc-800 py-7 md:py-9 ${last ? 'border-b' : ''}`}
    >
      <span className="cta-fill absolute inset-0 bg-white" />
      <span className="relative z-10 flex items-baseline gap-5 transition-colors duration-300 group-hover:text-black">
        <span className="font-display text-sm text-zinc-600">{n}</span>
        <span>
          <span className="mb-2 block text-[10px] tracking-[0.35em] text-zinc-500">{label}</span>
          <span className="block font-display font-light leading-none" style={{ fontSize: 'clamp(1.8rem,7vw,3.6rem)' }}>
            {title}
          </span>
        </span>
      </span>
      <span className="relative z-10 text-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:text-black">→</span>
    </a>
  )
}

export default function AboutPage() {
  const [email, setEmail] = useState('')
  const yearsOfExperience = new Date().getFullYear() - EXPERIENCE_SINCE

  return (
    <main className="bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 32s linear infinite; }
        @keyframes kenburns { from { transform: scale(1.12); } to { transform: scale(1); } }
        .about-hero-img { animation: kenburns 14s ease-out forwards; }
        @keyframes cue {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .cue-line { animation: cue 2.2s ease-in-out infinite; }
        @keyframes ghostFloat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -53%) scale(1.05); }
        }
        .ghost-x {
          position: absolute; left: 50%; top: 50%;
          font-family: 'Cormorant Garamond', serif;
          font-size: min(95vw, 860px); line-height: 1;
          color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.08);
          animation: ghostFloat 9s ease-in-out infinite;
          pointer-events: none; user-select: none;
        }
        .cta-fill { transform: scaleX(0); transform-origin: left; transition: transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .cta-row:hover .cta-fill { transform: scaleX(1); }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track, .about-hero-img, .cue-line, .ghost-x { animation: none; }
        }
      `}</style>

      <ScrollProgress />
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen min-h-[620px] w-full overflow-hidden bg-black">
        <img
          src="/xm-about-hero.jpg"
          alt="X Motors"
          className="about-hero-img absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.25) 100%)' }}
        />

        <div className="absolute inset-x-0 bottom-0 px-6 pb-24">
          <LetterReveal text="ABOUT X MOTORS" className="mb-5 text-xs tracking-[0.4em] text-zinc-400" />
          <RevealHeading
            as="h1"
            text="Cars Are Not | Just Objects."
            className="mb-6 max-w-2xl font-display font-light leading-[1.02] text-[clamp(2.7rem,11vw,6.5rem)]"
          />
          <Reveal delay={350}>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-300 md:max-w-md">
              A team of luxury car specialists with {yearsOfExperience} years of international experience, based in Dubai.
            </p>
          </Reveal>
        </div>

        <div className="absolute bottom-20 right-6 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-zinc-400" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
          <div className="cue-line h-12 w-px bg-white/75" />
        </div>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/15 py-3 text-zinc-400">
          <Marquee
            items={['LUXURY CARS', 'PERFORMANCE', 'ENGINEERING', 'DUBAI']}
            itemClassName="text-[11px] tracking-[0.4em]"
          />
        </div>
      </section>

      <Wedge from="#000" to="#fff" dir="right" />

      {/* WHITE: TEAM + PHILOSOPHY */}
      <section className="bg-white px-6 pb-24 pt-10 text-black">
        <div className="mx-auto max-w-5xl">

          <Reveal>
            <div className="mb-12 flex items-center gap-4">
              <span className="text-xs tracking-[0.3em] text-zinc-500">01 / THE TEAM</span>
              <span className="h-px flex-1 bg-zinc-300" />
            </div>
          </Reveal>

          <div className="font-display font-light leading-[1.12] text-[clamp(1.8rem,6.6vw,3.8rem)]">
            <RevealHeading as="h2" text="We are a group of experts" />
            <div style={{ marginLeft: '10%' }}>
              <RevealHeading as="h3" text="specialized in luxury car sales" wordDelay={60} />
            </div>
            <div style={{ marginLeft: '20%' }}>
              <RevealHeading as="h3" text={`with ${yearsOfExperience} years of international experience.`} wordDelay={50} />
            </div>
          </div>

          <Reveal delay={100}>
            <div className="mt-16 grid grid-cols-3 border-y border-zinc-300 text-center">
              <div className="border-r border-zinc-300 px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.4rem)]">
                  <CountNumber from={0} to={yearsOfExperience} suffix="+" />
                </p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">YEARS INTERNATIONAL</p>
              </div>
              <div className="border-r border-zinc-300 px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.4rem)]">
                  <CountNumber from={0} to={FOLLOWERS_K} suffix="K+" />
                </p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">FOLLOWERS</p>
              </div>
              <div className="px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.4rem)]">DXB</p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">BASED IN DUBAI</p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mb-10 mt-28">
            <div className="flex items-center gap-4">
              <span className="text-xs tracking-[0.3em] text-zinc-500">02 / PHILOSOPHY</span>
              <span className="h-px flex-1 bg-zinc-300" />
            </div>
          </Reveal>

          <RevealHeading
            as="h2"
            text="Not Assets. | A Way of Life."
            className="mb-6 font-display font-light leading-[1.05] text-[clamp(2.2rem,9vw,5rem)]"
          />
          <Reveal>
            <p className="mb-14 max-w-md text-sm leading-relaxed text-zinc-600">
              Cars are not just objects to us. We don&apos;t treat them solely as assets. They are an inseparable part
              of our lifestyles.
            </p>
          </Reveal>

          <div>
            <GiantWord n="01" word="Looks" line="The first thing you notice." />
            <GiantWord n="02" word="Engineering" line="Why it works the way it does." />
            <GiantWord n="03" word="Handling" line="How it feels when it matters." />
          </div>

          <div className="mt-20">
            <WipeFrame style={{ aspectRatio: '1280 / 830' }}>
              <ParallaxImage src="/xm-studio.jpg" alt="X Motors studio" className="h-full w-full" />
            </WipeFrame>
            <WipeFrame
              delay={250}
              style={{
                aspectRatio: '1280 / 1320',
                width: '62%',
                marginLeft: 'auto',
                marginTop: '-48px',
                border: '6px solid #fff',
                position: 'relative',
                boxShadow: '0 30px 60px -30px rgba(0,0,0,0.35)',
              }}
            >
              <ParallaxImage src="/xm-detail.jpg" alt="X Motors detail" className="h-full w-full" />
            </WipeFrame>
          </div>
        </div>
      </section>

      <Wedge from="#fff" to="#000" dir="left" />

      {/* WORK WITH US */}
      <section className="relative overflow-hidden bg-black px-6 pb-28 pt-10">
        <div className="ghost-x" aria-hidden>X</div>
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <div className="mb-10 flex items-center gap-4 pt-8">
              <span className="text-xs tracking-[0.3em] text-zinc-500">03 / WORK WITH US</span>
              <span className="h-px flex-1 bg-zinc-800" />
            </div>
          </Reveal>
          <RevealHeading
            as="h2"
            text="Find the one | that moves you."
            className="mb-14 font-display font-light leading-[1.05] text-[clamp(2.4rem,10vw,6rem)]"
          />
          <Reveal>
            <CtaRow n="01" label="BUY" title="Explore the Inventory" href="/inventory" />
          </Reveal>
          <Reveal delay={120}>
            <CtaRow n="02" label="SELL" title="Sell Your Car" href="/sell-your-car" />
          </Reveal>
          <Reveal delay={240}>
            <CtaRow n="03" label="TALK" title="Visit the Showroom" href="/contact" last />
          </Reveal>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="border-t border-zinc-900 bg-zinc-950 px-6 py-16 text-center">
        <LetterReveal text="STAY IN THE LOOP" className="mb-3 text-xs tracking-[0.4em] text-zinc-500" />
        <h3 className="mb-6 font-display text-2xl font-light">Subscribe to our Newsletter</h3>
        <form
          onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
          className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 rounded-lg border border-zinc-700 bg-black px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 text-xs tracking-widest text-black transition-colors hover:bg-zinc-200"
          >
            SUBSCRIBE
          </button>
        </form>
      </section>

      <Footer />
    </main>
  )
}