'use client'
import { useEffect, useState, useRef, ReactNode } from 'react'
import { client, Car } from '../sanity/lib/client'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { urlFor } from '../sanity/lib/imageUrl'

const INSTAGRAM_URL = 'https://instagram.com/goldenneg'

const quickLinks = [
  { title: "Available Vehicles", img: "available-vehicles.jpg", href: "/inventory" },
  { title: "Sell Your Car", img: "sell-your-car.jpg", href: "/sell-your-car" },
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
    caption: "Replace with your own Golden N posts.",
  },
  {
    images: ["/instagram/post-2.jpg"],
    likes: 230,
    comments: 6,
    date: "",
    caption: "Replace with your own Golden N posts.",
  },
  {
    images: ["/instagram/post-3.jpg"],
    likes: 615,
    comments: 2,
    date: "",
    caption: "Replace with your own Golden N posts.",
  },
  {
    images: ["/instagram/post-4.jpg"],
    likes: 158,
    comments: 5,
    date: "",
    caption: "Replace with your own Golden N posts.",
  },
  {
    images: ["/instagram/post-5.jpg"],
    likes: 890,
    comments: 5,
    date: "",
    caption: "Replace with your own Golden N posts.",
  },
  {
    images: ["/instagram/post-6.jpg"],
    likes: 689,
    comments: 5,
    date: "",
    caption: "Replace with your own Golden N posts.",
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

/* ============ ANIMATION ============ */

function useInView<T extends HTMLElement>(threshold = 0.15): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms, filter 0.7s ease ${delay}ms`,
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

function RevealHeading({
  text, as = 'h2', className = '', wordDelay = 70,
}: { text: string; as?: 'h1' | 'h2'; className?: string; wordDelay?: number }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.3 }
    )
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

// Letter-by-letter reveal — used for short punchy labels only.
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

// Counts a number up or down whenever it scrolls into view, every time.
function CountNumber({ from, to, suffix = '', duration = 1500 }: { from: number; to: number; suffix?: string; duration?: number }) {
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
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [visible, from, to, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

function InstagramModal({ post, onClose }: { post: InstagramPost; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)
  const next = () => setImgIndex((i) => (i + 1) % post.images.length)
  const prev = () => setImgIndex((i) => (i - 1 + post.images.length) % post.images.length)

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-zinc-800" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white hover:bg-black transition-colors">✕</button>
        <div className="relative bg-black">
          <img src={post.images[imgIndex]} alt="Golden N" className="w-full max-h-[55vh] object-cover" />
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
          <img src="/logo-full-bg.png" alt="Golden N" className="w-9 h-9 object-contain rounded-full" />
          <div className="leading-tight">
            <p className="text-white text-sm font-medium">goldenn_eg</p>
            <p className="text-zinc-500 text-xs tracking-widest">SHOWROOM SINCE 1984</p>
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
  const yearsOfTrust = currentYear - 1984

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
        .news-scroll::-webkit-scrollbar { display: none; }
        .news-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .quick-link-img { transition: filter 0.4s ease, transform 0.5s ease; }
        .quick-link:hover .quick-link-img { filter: brightness(1.15); transform: scale(1.03); }
        .heritage-diag-top { clip-path: polygon(0 0, 100% 0, 100% 100%, 0 calc(100% - 64px)); }
        .heritage-diag-bottom { clip-path: polygon(0 64px, 100% 0, 100% 100%, 0 100%); }
        .heritage-img { transition: transform 0.6s cubic-bezier(0.16,1,0.3,1); }
        .heritage-img:hover { transform: scale(1.03); }
        .divider-grow { transition: width 1.1s cubic-bezier(0.16,1,0.3,1) 200ms; }
      `}</style>

      <Navbar />

      {/* HERO — video only, no poster, autoplay muted, sound toggle, no auto-loop */}
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

        <div className="absolute inset-0 z-10" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,1) 100%)' }} />

        {/* sound toggle */}
        <button
          onClick={toggleSound}
          aria-label="Toggle sound"
          className={`absolute top-24 right-6 z-30 w-12 h-12 rounded-full border border-white/70 bg-black/40 flex items-center justify-center text-white transition-colors duration-300 ${!soundOn ? 'sound-pulse' : ''}`}
        >
          {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
        <p className="absolute top-[7.7rem] right-6 z-30 text-[9px] tracking-[0.25em] text-zinc-300">
          {soundOn ? 'SOUND ON' : 'TAP FOR SOUND'}
        </p>

        {/* replay, shown when video ends */}
        {videoEnded && (
          <div className="absolute inset-0 z-30 flex items-center justify-center animate-fadeUp">
            <button
              onClick={replay}
              className="w-16 h-16 rounded-full border border-white/80 bg-black/50 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300"
              aria-label="Replay video"
            >
              <ReplayIcon />
            </button>
          </div>
        )}

        <div className="absolute bottom-24 left-0 right-0 text-center px-6 z-20 animate-fadeUp">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">CAIRO&apos;S MOST COMPLETE SHOWROOM</p>
          <RevealHeading
            as="h1"
            text="EVERY CAR. EVERY ERA."
            className="font-display text-4xl md:text-5xl font-light tracking-wider mb-8 leading-tight text-white"
          />
          <a href="/inventory"
            className="inline-block border border-white/70 text-white px-10 py-3.5 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            EXPLORE INVENTORY
          </a>
        </div>
      </section>

      {/* HERITAGE — white section, diagonal shift, no misleading years on the photos */}
      <section className="relative bg-black overflow-hidden">
        <div className="relative bg-white text-black -mt-16 pt-24 pb-24 heritage-diag-top">
          <div className="text-center mb-14 px-6">
            <LetterReveal text="SINCE 1984" className="text-xs tracking-[0.5em] text-zinc-500 mb-4" />
            <RevealHeading
              as="h2"
              text="Every Class. Every Era. One Address."
              className="font-display text-3xl md:text-5xl font-light leading-tight"
            />
            <Reveal delay={150}>
              <p className="text-zinc-600 text-sm max-w-md mx-auto mt-5 leading-relaxed">
                From the icons that built our name over four decades ago to the newest arrivals
                on the floor today — Golden N has never stopped at one category. It never will.
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 max-w-5xl mx-auto">
            <Reveal delay={100}>
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200">
                <img src="/goldenn-classic.jpg" alt="Golden N heritage" className="heritage-img w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-xs tracking-[0.3em]">WHERE IT BEGAN</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={220}>
              <div className="relative rounded-2xl overflow-hidden border border-zinc-200">
                <img src="/goldenn-modern.jpg" alt="Golden N today" className="heritage-img w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-5">
                  <p className="text-white text-xs tracking-[0.3em]">WHERE WE STAND TODAY</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={300} className="flex justify-center mt-16 mb-10">
            <DividerGrow />
          </Reveal>

          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto text-center px-6">
            <div>
              <p className="text-2xl font-display font-light mb-1">
                <CountNumber from={0} to={yearsOfTrust} suffix="+" />
              </p>
              <p className="text-zinc-500 text-[10px] tracking-widest">YEARS OF TRUST</p>
            </div>
            <div className="border-x border-zinc-200">
              <p className="text-2xl font-display font-light mb-1">ALL</p>
              <p className="text-zinc-500 text-[10px] tracking-widest">SEGMENTS</p>
            </div>
            <div>
              <p className="text-2xl font-display font-light mb-1">
                <CountNumber from={currentYear} to={1
