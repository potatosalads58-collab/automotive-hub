'use client'
import { useEffect, useState, useRef, ReactNode } from 'react'
import { client, Car } from '../sanity/lib/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { urlFor } from '../sanity/lib/imageUrl'

const INSTAGRAM_URL = 'https://instagram.com/xmotors.me'
const CURRENCY = 'AED'
const EXPERIENCE_SINCE = 2011
const FOUNDED_YEAR = 2024
const FOLLOWERS_K = 750

const quickLinks = [
  { title: "Available Vehicles", img: "available-vehicles.jpg", href: "/inventory" },
  { title: "Sell Your Car", img: "Sell-your-car.jpg", href: "/sell-your-car" },
]

const showcase = [
  { n: '01', title: 'Classic Supercars', line: 'Icons that earned their reputation.', img: '/Xmotors-classic.jpg' },
  { n: '02', title: 'Hypercars', line: 'The extreme end of what is possible.', img: '/Xmotors-modern.jpg' },
  { n: '03', title: 'Luxury', line: 'Refinement, without compromise.', img: '/Xmotors-luxury.jpg' },
]

type MotorNewsItem = {
  category: string
  title: string
  link: string
  img: string
  date: string
}

type InstagramPost = {
  images: string[]
  likes: number
  comments: number
  date: string
  caption: string
}

const instagramPosts: InstagramPost[] = [
  {
    images: ["/instagram/post-1.jpg"],
    likes: 327,
    comments: 7,
    date: "January 16",
    caption: "Replace with your own X Motors posts.",
  },
  {
    images: ["/instagram/post-2.jpg"],
    likes: 230,
    comments: 6,
    date: "",
    caption: "Replace with your own X Motors posts.",
  },
  {
    images: ["/instagram/post-3.jpg"],
    likes: 397,
    comments: 4,
    date: "",
    caption: "𝐓𝐡𝐞 𝐀𝐫𝐭 𝐨𝐟 𝐒𝐮𝐛𝐭𝐥𝐞𝐭𝐲. Porsche 911 GT3 Touring: All the precision of a GT3, without the need to announce it.",
  },
  {
    images: ["/instagram/post-4.jpg"],
    likes: 6602,
    comments: 26,
    date: "11 JAN",
    caption: "𝐓𝐰𝐨 𝐓𝐢𝐦𝐞𝐥𝐞𝐬𝐬 𝐈𝐜𝐨𝐧𝐬 When the Mercedes McLaren SLR was launch in 2004, it rocked the hypercar world with its F1 inspired looks and usable approach to a hypercar. With over two decades of grandeur later, it has become a timeless icon, surprisingly comfortable and with its hyper GT attitude it continues to be as good as it was in cross continental travels as it is to look at. And what a looker it is! These two well kept Icons are available at X Motors for viewing & sale. DM to get in touch with us.",
  },
  {
    images: ["/instagram/post-5.jpg"],
    likes: 890,
    comments: 5,
    date: "",
    caption: "Replace with your own X Motors posts.",
  },
  {
    images: ["/instagram/post-6.jpg"],
    likes: 689,
    comments: 5,
    date: "",
    caption: "Replace with your own X Motors posts.",
  },
]

function HeartIcon({ filled = false, size = 16 }: { filled?: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7.5-4.6-10-9.1C.4 8.4 2 4.5 5.8 4c2.1-.3 4 .8 5.2 2.6C12.2 4.8 14.1 3.7 16.2 4c3.8.5 5.4 4.4 3.8 7.9C19.5 16.4 12 21 12 21z" />
    </svg>
  )
}
function CommentIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  )
}
function ChevronIcon({ direction = "left", size = 18 }: { direction?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}
function SoundOnIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  )
}
function SoundOffIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  )
}
function ReplayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

/* ============ ANIMATION TOOLKIT ============ */

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

function NofadeReveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(20px)',
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

// Counts up or down every time it scrolls into view.
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

function WipeFrame({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.15, true)
  return (
    <div
      ref={ref}
      className={className}
      style={{
        clipPath: visible ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)',
        transition: `clip-path 1.3s cubic-bezier(0.77,0,0.175,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// Diagonal colour shift between sections.
function Wedge({ from, to, dir = 'right' }: { from: string; to: string; dir?: 'right' | 'left' }) {
  return (
    <div
      aria-hidden
      className="h-12 w-full md:h-24"
      style={{ background: `linear-gradient(to bottom ${dir}, ${from} 50%, ${to} 50%)` }}
    />
  )
}

function ShowcaseCard({ item, index }: { item: (typeof showcase)[number]; index: number }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.3)
  return (
    <div
      ref={ref}
      className={`relative ${index % 2 === 1 ? 'ml-[10%]' : 'mr-[10%]'} md:mx-0 ${index === 1 ? 'md:mt-24' : ''}`}
    >
      <p
        className="mb-3 select-none font-display font-light leading-none"
        style={{
          fontSize: 'clamp(3rem,14vw,5rem)',
          color: visible ? '#0a0a0a' : 'transparent',
          WebkitTextStroke: '1px #0a0a0a',
          transition: 'color 0.9s ease 0.2s',
        }}
      >
        {item.n}
      </p>
      <WipeFrame delay={index * 120}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-zinc-200">
          <ParallaxImage src={item.img} alt={item.title} className="h-full w-full" strength={0.8} scale={1.08} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <p className="mb-1 text-xs tracking-[0.3em] text-white">{item.title.toUpperCase()}</p>
            <p className="text-xs text-zinc-300">{item.line}</p>
          </div>
        </div>
      </WipeFrame>
    </div>
  )
}

function InstagramModal({ post, onClose }: { post: InstagramPost; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const next = () => setImgIndex((i) => (i + 1) % post.images.length)
  const prev = () => setImgIndex((i) => (i - 1 + post.images.length) % post.images.length)

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white hover:bg-black transition-colors">✕</button>
        <div className="relative bg-black">
          <img src={post.images[imgIndex]} alt="X Motors" className="w-full max-h-[55vh] object-cover" />
          {post.images.length > 1 && (
            <>
              <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white">
                <ChevronIcon direction="left" />
              </button>
              <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white">
                <ChevronIcon direction="right" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/30"}`} />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex items-center gap-3 px-5 pt-5">
          <img src="/logo-full-bg.png" alt="X Motors" className="w-9 h-9 object-contain rounded-full" />
          <div className="leading-tight">
            <p className="text-white text-sm font-medium">xmotors.me</p>
          </div>
        </div>
        <p className="px-5 pt-4 text-zinc-400 text-sm leading-relaxed whitespace-pre-line">{post.caption}</p>
        <div className="flex items-center gap-5 px-5 py-5 mt-2 border-t border-zinc-800 text-zinc-400">
          <span className="flex items-center gap-2 text-sm"><HeartIcon /> {post.likes}</span>
          <span className="flex items-center gap-2 text-sm"><CommentIcon /> {post.comments}</span>
          {post.date && <span className="ml-auto text-xs text-zinc-600 tracking-widest">{post.date.toUpperCase()}</span>}
        </div>
      </div>
    </div>
  )
}

export default function Home() {
  const [cars, setCars] = useState<Car[]>([])
  const [newsFilter, setNewsFilter] = useState('All')
  const [email, setEmail] = useState('')
  const [igActiveIndex, setIgActiveIndex] = useState<number | null>(null)
  const [motorNews, setMotorNews] = useState<MotorNewsItem[]>([])

  const videoRef = useRef<HTMLVideoElement>(null)
  const [soundOn, setSoundOn] = useState(false)
  const [videoEnded, setVideoEnded] = useState(false)

  const currentYear = new Date().getFullYear()
  const yearsOfExperience = currentYear - EXPERIENCE_SINCE

  useEffect(() => {
    client.fetch(`*[_type == "car"] | order(_createdAt desc)[0...6]`)
      .then((data) => setCars(data))
      .catch((err) => console.error(err))
  }, [])

  useEffect(() => {
    fetch('/api/motor1-news')
      .then((res) => res.json())
      .then((data) => setMotorNews(data))
      .catch((err) => console.error(err))
  }, [])

  const filteredNews = newsFilter === 'All' ? motorNews : motorNews.filter(n => n.category === newsFilter)

  const toggleSound = () => {
    if (!videoRef.current) return
    videoRef.current.muted = soundOn
    setSoundOn(!soundOn)
  }

  const replay = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setVideoEnded(false)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease, transform 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(255,255,255,0.15), 0 20px 40px -20px rgba(0,0,0,0.6); }
        .car-card:hover img { transform: scale(1.04); }
        .car-card img { transition: transform 0.5s ease; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
        @keyframes heroZoom { from { transform: scale(1.08); } to { transform: scale(1); } }
        .hero-video-zoom { animation: heroZoom 12s ease-out forwards; }
        @keyframes pulseRing {
          0% { box-shadow: 0 0 0 0 rgba(255,255,255,0.45); }
          70% { box-shadow: 0 0 0 14px rgba(255,255,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(255,255,255,0); }
        }
        .sound-pulse { animation: pulseRing 2.2s ease-out infinite; }
        @keyframes marquee { to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 32s linear infinite; }
        .outline-text { color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.32); }
        @keyframes cue {
          0% { transform: scaleY(0); transform-origin: top; }
          45% { transform: scaleY(1); transform-origin: top; }
          55% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }
        .cue-line { animation: cue 2.2s ease-in-out infinite; }
        .news-scroll::-webkit-scrollbar { display: none; }
        .news-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .quick-link-img { transition: filter 0.4s ease, transform 0.5s ease; }
        .quick-link:hover .quick-link-img { filter: brightness(1.15); transform: scale(1.03); }
      `}</style>

      <ScrollProgress />
      <Navbar />

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          onEnded={() => setVideoEnded(true)}
          className={`hero-video-zoom absolute inset-0 w-full h-full object-cover object-center z-0 transition-[filter] duration-700 ${videoEnded ? 'blur-md' : ''}`}
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0 z-10"
          style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 28%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.92) 100%)' }}
        />

        {/* replay when the video ends */}
        {videoEnded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center animate-fadeUp">
            <button
              onClick={replay}
              aria-label="Replay video"
              className="w-16 h-16 rounded-full border border-white/80 bg-black/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
            >
              <ReplayIcon />
            </button>
          </div>
        )}

        <div className="absolute bottom-24 left-0 right-0 z-20 px-6 text-center">
          <LetterReveal text="DUBAI · LUXURY · PERFORMANCE" className="mb-5 text-[11px] tracking-[0.4em] text-zinc-300" />
          <RevealHeading
            as="h1"
            text="EXTRAORDINARY CARS. | EXPERT HANDS."
            className="mb-6 font-display font-light leading-[1.05] tracking-wider text-white text-[clamp(2.2rem,9.5vw,4.6rem)]"
          />
          <Reveal delay={400}>
            <p className="mx-auto mb-8 max-w-sm text-sm leading-relaxed text-zinc-300">
              Supercars, hypercars and refined luxury, handled by specialists with {yearsOfExperience} years of international experience.
            </p>
          </Reveal>
          <Reveal delay={550}>
            <a
              href="/inventory"
              className="inline-block border border-white/70 px-10 py-3.5 text-xs tracking-[0.3em] text-white transition-all duration-300 hover:bg-white hover:text-black"
            >
              EXPLORE INVENTORY
            </a>
          </Reveal>
        </div>

        {/* scroll cue */}
        <div className="absolute right-6 bottom-16 z-20 flex flex-col items-center gap-3">
          <span className="text-[9px] tracking-[0.3em] text-zinc-400" style={{ writingMode: 'vertical-rl' }}>SCROLL</span>
          <div className="cue-line h-12 w-px bg-white/75" />
        </div>

        {/* marquee strip */}
        <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/15 py-3 text-zinc-400">
          <Marquee
            items={['CLASSIC SUPERCARS', 'HYPERCARS', 'LUXURY', 'DUBAI']}
            itemClassName="text-[11px] tracking-[0.4em]"
          />
        </div>
      </section>

      <Wedge from="#000" to="#fff" dir="right" />

      {/* THE COLLECTION — white section */}
      <section className="bg-white px-6 pb-28 pt-10 text-black">
        <div className="mx-auto max-w-5xl">

          <div className="mb-20 text-center">
            <LetterReveal text="THE COLLECTION" className="mb-5 text-xs tracking-[0.5em] text-zinc-500" />
            <RevealHeading
              as="h2"
              text="Three Worlds. | One Standard."
              className="font-display text-4xl font-light leading-[1.05] md:text-6xl"
            />
            <Reveal delay={150}>
              <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-zinc-600">
                From timeless supercar icons to the newest hypercars and refined luxury, every car on our floor
                is chosen by people who have spent {yearsOfExperience} years in this world. We know what to look for.
                And what to walk away from.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-14 md:grid-cols-3 md:items-start md:gap-8">
            {showcase.map((item, i) => (
              <ShowcaseCard key={item.n} item={item} index={i} />
            ))}
          </div>

          <Reveal delay={100}>
            <div className="mx-auto mt-28 grid max-w-xl grid-cols-3 border-y border-zinc-300 text-center">
              <div className="border-r border-zinc-300 px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.2rem)]">
                  <CountNumber from={0} to={yearsOfExperience} suffix="+" />
                </p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">YEARS OF EXPERIENCE</p>
              </div>
              <div className="border-r border-zinc-300 px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.2rem)]">
                  <CountNumber from={0} to={FOLLOWERS_K} suffix="K+" />
                </p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">FOLLOWERS</p>
              </div>
              <div className="px-2 py-8">
                <p className="mb-3 font-display font-light leading-none text-[clamp(2rem,8vw,3.2rem)]">
                  <CountNumber from={FOUNDED_YEAR + 11} to={FOUNDED_YEAR} duration={1800} />
                </p>
                <p className="text-[10px] leading-relaxed tracking-[0.25em] text-zinc-500">ESTABLISHED</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <Wedge from="#fff" to="#000" dir="left" />

      {/* FEATURED CARS */}
      <section className="bg-black px-6 pb-16 pt-8">
        <LetterReveal text="AVAILABLE NOW" className="mb-3 text-xs tracking-[0.4em] text-zinc-500" />
        <RevealHeading as="h2" text="Featured Cars" className="mb-10 font-display text-4xl font-light" />
        {cars.length === 0 ? (
          <p className="text-zinc-600 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, i) => (
              <Reveal key={car._id} delay={i * 80}>
                <a href={`/vehicle/${car._id}`} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
                  <div className="relative w-full bg-zinc-800 overflow-hidden" style={{ aspectRatio: '2000/1670' }}>
                    {car.thumbnail && (
                      <img
                        src={urlFor(car.thumbnail).width(800).url()}
                        alt={car.title}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute left-4 top-4 rounded-full bg-black/50 px-2.5 py-1 text-[10px] tracking-[0.3em] text-white/90 backdrop-blur">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-white text-xl font-light mb-3">{car.title}</p>
                    <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                      <span>{car.mileage?.toLocaleString()} km</span>
                      <span>·</span>
                      <span>{car.year}</span>
                    </div>
                    <p className="text-white font-medium text-lg">{CURRENCY} {car.price?.toLocaleString()}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
        <a
          href="/inventory"
          className="group mt-10 block border border-zinc-700 py-4 text-center text-xs tracking-[0.3em] text-zinc-400 transition-all duration-300 hover:border-white hover:text-white"
        >
          SEE ALL CARS{' '}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
        </a>
      </section>

      {/* BIG OUTLINE MARQUEE */}
      <section className="overflow-hidden border-y border-zinc-900 bg-black py-10">
        <Marquee
          items={['X MOTORS', 'EXTRAORDINARY CARS', 'EXPERT HANDS']}
          itemClassName="outline-text font-display font-light uppercase leading-none text-[clamp(2.8rem,11vw,7rem)]"
          speed={55}
        />
      </section>

      {/* QUICK LINKS */}
      <section className="bg-black px-6 pb-16 pt-16">
        <div className="grid grid-cols-1 gap-5">
          {quickLinks.map((link, i) => (
            <Reveal key={i} delay={i * 100}>
              <a href={link.href} className="quick-link relative overflow-hidden rounded-2xl block h-80 group">
                <img
                  src={`/${link.img}`}
                  alt={link.title}
                  className="quick-link-img absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                  <p className="text-white text-xl font-light font-display">{link.title}</p>
                  <span className="text-white text-xl transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </section>

      {/* NEWS SECTION */}
      <section className="bg-zinc-950 py-16 border-t border-zinc-900">
        <div className="px-6 mb-8">
          <LetterReveal text="STAY UPDATED" className="mb-2 text-xs tracking-[0.4em] text-zinc-500" />
          <RevealHeading as="h2" text="News & Reviews" className="mb-6 font-display text-3xl font-light" />
          <div className="flex gap-3">
            {['All', 'News', 'Reviews'].map(f => (
              <button key={f} onClick={() => setNewsFilter(f)}
                className={`px-4 py-2 text-xs tracking-widest border rounded-full transition-all duration-200 ${newsFilter === f ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <p className="px-6 text-zinc-600 text-sm">Loading...</p>
        ) : (
          <div className="news-scroll flex gap-5 overflow-x-auto px-6 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
            {filteredNews.map((news, i) => (
              <NofadeReveal key={i} delay={i * 70} className="flex-shrink-0">
                <a href={news.link} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 w-72 bg-zinc-900 rounded-2xl overflow-hidden block"
                  style={{ scrollSnapAlign: 'start' }}>
                  <div className="w-full h-44 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs overflow-hidden">
                    {news.img ? (
                      <img src={news.img} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <span>X Motors</span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-400 text-xs tracking-widest mb-2">{news.category.toUpperCase()}</p>
                    <p className="text-white text-base font-light mb-2 leading-snug">{news.title}</p>
                    <p className="text-zinc-500 text-xs">{news.date}</p>
                  </div>
                </a>
              </NofadeReveal>
            ))}
          </div>
        )}

        <div className="px-6">
          <a href="/news"
            className="block text-center border border-zinc-700 text-zinc-400 py-4 mt-6 text-xs tracking-[0.3em] hover:border-white hover:text-white transition-all duration-300">
            SEE ALL NEWS
          </a>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-black py-16 px-6 border-t border-zinc-900">
        <div className="text-center mb-10">
          <LetterReveal text="STAY CONNECTED" className="mb-3 text-xs tracking-[0.4em] text-zinc-500" />
          <RevealHeading as="h2" text="X Motors on Instagram" className="mb-4 font-display text-3xl font-light" />
          <p className="mb-3 text-sm text-zinc-500">{FOLLOWERS_K}K+ enthusiasts follow the journey.</p>
          <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="text-white text-sm tracking-widest hover:text-zinc-400 transition-colors duration-300">
            @xmotors.me
          </a>
        </div>

        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          {instagramPosts.map((post, i) => (
            <NofadeReveal key={i} delay={i * 60}>
              <button
                onClick={() => setIgActiveIndex(i)}
                className="group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800 w-full"
              >
                <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                  <span className="flex items-center gap-1.5 text-white text-xs font-medium">
                    <HeartIcon filled size={14} /> {post.likes}
                  </span>
                  <span className="flex items-center gap-1.5 text-white text-xs font-medium">
                    <CommentIcon size={14} /> {post.comments}
                  </span>
                </div>
              </button>
            </NofadeReveal>
          ))}
        </div>
      </section>

      {igActiveIndex !== null && (
        <InstagramModal post={instagramPosts[igActiveIndex]} onClose={() => setIgActiveIndex(null)} />
      )}

      {/* NEWSLETTER */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <LetterReveal text="STAY IN THE LOOP" className="mb-3 text-xs tracking-[0.4em] text-zinc-500" />
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600"
          />
          <button type="submit"
            className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            SUBSCRIBE
          </button>
        </form>
      </section>

      <Footer />

    </main>
  )
}