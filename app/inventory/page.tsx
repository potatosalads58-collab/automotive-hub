'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/imageUrl'

type CarListItem = {
  _id: string
  title: string
  price?: number | string // number, or a string like "POD"
  year?: number
  mileage?: number
  bodyType?: string
  specs?: string
  thumbnail?: any
}

type MotorNewsItem = {
  category: string
  title: string
  link: string
  img: string
  date: string
}

const LOGO_DEV_TOKEN = process.env.NEXT_PUBLIC_LOGO_DEV_TOKEN
const deriveMake = (title: string) => title?.trim().split(' ')[0] ?? ''

// Brand slider — fetched live from logo.dev by domain, no files needed in /public
const brands = [
  { name: 'Rolls-Royce', domain: 'rolls-roycemotorcars.com' },
  { name: 'Bentley', domain: 'bentleymotors.com' },
  { name: 'Ferrari', domain: 'ferrari.com' },
  { name: 'Lamborghini', domain: 'lamborghini.com' },
  { name: 'Porsche', domain: 'porsche.com' },
  { name: 'Mercedes-Benz', domain: 'mercedes-benz.com' },
  { name: 'BMW', domain: 'bmw.com' },
  { name: 'McLaren', domain: 'mclaren.com' },
]
const logoUrl = (domain: string) => `https://img.logo.dev/${domain}?token=${LOGO_DEV_TOKEN}&size=200&format=png`

const priceBands = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under EGP 2M', min: 0, max: 2000000 },
  { label: 'EGP 2M – 5M', min: 2000000, max: 5000000 },
  { label: 'EGP 5M – 10M', min: 5000000, max: 10000000 },
  { label: 'EGP 10M+', min: 10000000, max: Infinity },
]

const sortOptions = [
  { label: 'Newest first', value: 'year-desc' },
  { label: 'Price: low to high', value: 'price-asc' },
  { label: 'Price: high to low', value: 'price-desc' },
  { label: 'Lowest mileage', value: 'km-asc' },
]

const CARS_PER_PAGE = 12
const NEWS_LIMIT = 8

// Extracts a number from the price. "POD" or any non-numeric text returns 0.
const parsePriceNumber = (price?: number | string): number => {
  if (price === undefined || price === null) return 0
  if (typeof price === 'number') return price
  const parsed = parseFloat(price.replace(/[^0-9.]/g, ''))
  return isNaN(parsed) ? 0 : parsed
}

// Numbers get thousands separators; text prices (e.g. "POD") are shown as written
const displayPrice = (price?: number | string): string => {
  const n = parsePriceNumber(price)
  if (n > 0) return n.toLocaleString('en-US')
  return typeof price === 'string' ? price : ''
}

// Fades an image in once it has loaded (also handles already-cached images)
const fadeInImage = (el: HTMLImageElement | null) => {
  if (el && el.complete) el.classList.add('loaded')
}

function useInView<T extends HTMLElement>(threshold = 0.15, once = true): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true)
        if (once) obs.disconnect()
      } else if (!once) {
        setVisible(false)
      }
    }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, once])
  return [ref, visible]
}

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.1)
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, filter 0.9s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px) scale(1)' : 'translateY(36px) scale(0.98)',
        filter: visible ? 'blur(0px)' : 'blur(4px)',
      }}
    >
      {children}
    </div>
  )
}

// Word-by-word masked headline
function RevealHeading({ text, as = 'h2', className = '', wordDelay = 80, startDelay = 0 }: {
  text: string; as?: 'h1' | 'h2'; className?: string; wordDelay?: number; startDelay?: number
}) {
  const [ref, visible] = useInView<HTMLHeadingElement>(0.3)
  const content = text.split(' ').map((word, i) => (
    <span key={i} className="reveal-word inline-block overflow-hidden mr-[0.24em] align-bottom pb-[0.12em] -mb-[0.12em]">
      <span
        className="inline-block"
        style={{
          transition: `transform 1.1s cubic-bezier(0.16,1,0.3,1) ${startDelay + i * wordDelay}ms, opacity 0.8s ease ${startDelay + i * wordDelay}ms`,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0%)' : 'translateY(110%)',
        }}
      >
        {word}
      </span>
    </span>
  ))
  if (as === 'h1') return <h1 ref={ref} className={className}>{content}</h1>
  return <h2 ref={ref} className={className}>{content}</h2>
}

// Thin brass rule that draws itself when scrolled into view
function DrawLine({ className = '' }: { className?: string }) {
  const [ref, visible] = useInView<HTMLSpanElement>(0.5)
  return (
    <span
      ref={ref}
      className={`draw-line block h-px bg-brass ${className}`}
      style={{ width: visible ? '72px' : '0px', transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1) 0.3s' }}
    />
  )
}

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}>
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
function ReplayIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  )
}

// Auto-scrolling marquee driven by CSS (reliable on every browser, pauses on hover)
function BrandSlider() {
  const loop = [...brands, ...brands, ...brands, ...brands]
  return (
    <section className="bg-black py-16 border-t border-b border-zinc-900 overflow-hidden">
      <p className="text-center text-[11px] tracking-[0.35em] text-zinc-500 mb-10">THE MARQUES WE DEAL IN</p>
      <div className="marquee-mask overflow-hidden">
        <div className="marquee-track flex w-max">
          {loop.map((b, i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0 select-none px-8 md:px-10">
              <img
                src={logoUrl(b.domain)}
                alt={b.name}
                draggable={false}
                className="h-10 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-500"
              />
              <span className="text-[9px] tracking-[0.25em] text-zinc-500 whitespace-nowrap">{b.name.toUpperCase()}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// One row of the filter drawer: label + dropdown-styled trigger that
// expands into a chip list beneath it.
function FilterSection({
  label, value, options, isOpen, onToggle, onSelect,
}: {
  label: string
  value: string
  options: string[]
  isOpen: boolean
  onToggle: () => void
  onSelect: (v: string) => void
}) {
  if (options.length <= 1) return null
  return (
    <div className="border-b border-white/10 py-5">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between text-left"
      >
        <span className="font-display text-xl font-light text-white">{label}</span>
        <span className="flex items-center gap-3 text-sm text-zinc-400">
          <span className={value.startsWith('All') ? '' : 'text-brass'}>{value}</span>
          <ChevronDown open={isOpen} />
        </span>
      </button>
      <div className="overflow-hidden transition-all duration-500" style={{ maxHeight: isOpen ? '320px' : '0px' }}>
        <div className="flex gap-2 flex-wrap pt-5 pb-1">
          {options.map((opt, i) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              style={{
                opacity: isOpen ? 1 : 0,
                transform: isOpen ? 'translateY(0px)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${isOpen ? i * 35 : 0}ms, transform 0.4s ease ${isOpen ? i * 35 : 0}ms, background-color 0.3s, border-color 0.3s, color 0.3s`,
              }}
              className={`px-4 py-2 text-xs tracking-wide border rounded-full ${
                value === opt
                  ? 'bg-brass text-black border-brass'
                  : 'border-white/15 text-zinc-300 hover:border-brass hover:text-white'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function Inventory() {
  const [cars, setCars] = useState<CarListItem[]>([])
  const [carsLoading, setCarsLoading] = useState(true)

  const [selectedType, setSelectedType] = useState('All body types')
  const [selectedMake, setSelectedMake] = useState('All Brands')
  const [selectedSpecs, setSelectedSpecs] = useState('All specifications')
  const [selectedYear, setSelectedYear] = useState('All Years')
  const [selectedPriceLabel, setSelectedPriceLabel] = useState('All Prices')
  const [sortBy, setSortBy] = useState('year-desc')
  const [page, setPage] = useState(1)

  const [filterOpen, setFilterOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)
  const [sortMenuOpen, setSortMenuOpen] = useState(false)

  const [motorNews, setMotorNews] = useState<MotorNewsItem[]>([])
  const [newsFilter, setNewsFilter] = useState('All')
  const [email, setEmail] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLElement>(null)
  const [videoEnded, setVideoEnded] = useState(false)
  const replay = () => {
    if (!videoRef.current) return
    videoRef.current.currentTime = 0
    videoRef.current.play()
    setVideoEnded(false)
  }

  useEffect(() => {
    client
      .fetch(`*[_type == "car" && isAvailable == true] | order(_createdAt desc){
        _id, title, price, year, mileage, thumbnail, bodyType, specs
      }`)
      .then((data) => { setCars(data); setCarsLoading(false) })
      .catch((err) => { console.error(err); setCarsLoading(false) })
  }, [])

  useEffect(() => {
    fetch('/api/motor1-news')
      .then((res) => res.json())
      .then((data) => setMotorNews(data))
      .catch((err) => console.error(err))
  }, [])

  // Scroll effects: progress bar, hero parallax, hero content fade-out
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let ticking = false
    const update = () => {
      const y = window.scrollY
      const vh = window.innerHeight
      if (progressRef.current) {
        const max = document.documentElement.scrollHeight - vh
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
      }
      if (!reduce && y < vh * 1.2) {
        if (videoWrapRef.current) videoWrapRef.current.style.transform = `translate3d(0, ${y * 0.25}px, 0)`
        if (heroContentRef.current) {
          heroContentRef.current.style.opacity = String(Math.max(0, 1 - y / (vh * 0.6)))
          heroContentRef.current.style.transform = `translate3d(0, ${y * -0.12}px, 0)`
        }
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    update()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock page scroll + Escape to close while the filter drawer is open
  useEffect(() => {
    if (!filterOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setFilterOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [filterOpen])

  const typeOptions = ['All body types', ...Array.from(new Set(cars.map((c) => c.bodyType).filter(Boolean)))] as string[]
  const makeOptions = ['All Brands', ...Array.from(new Set(cars.map((c) => deriveMake(c.title)).filter(Boolean)))] as string[]
  const specsOptions = ['All specifications', ...Array.from(new Set(cars.map((c) => c.specs).filter(Boolean)))] as string[]
  const yearOptions = ['All Years', ...Array.from(new Set(cars.map((c) => c.year).filter(Boolean))).sort((a: any, b: any) => b - a).map(String)]
  const priceOptions = priceBands.map((p) => p.label)

  const activePriceBand = priceBands.find((p) => p.label === selectedPriceLabel) ?? priceBands[0]

  const filtered = cars
    .filter((c) => selectedType === 'All body types' || c.bodyType === selectedType)
    .filter((c) => selectedMake === 'All Brands' || deriveMake(c.title) === selectedMake)
    .filter((c) => selectedSpecs === 'All specifications' || c.specs === selectedSpecs)
    .filter((c) => selectedYear === 'All Years' || String(c.year) === selectedYear)
    .filter((c) => {
      const numPrice = parsePriceNumber(c.price)
      // When a price filter is active, "price on demand" cars (0) are hidden
      if (selectedPriceLabel !== 'All Prices' && numPrice === 0) return false
      return numPrice >= activePriceBand.min && numPrice < (activePriceBand.max === Infinity ? Infinity : activePriceBand.max + 1)
    })
    .sort((a, b) => {
      const priceA = parsePriceNumber(a.price)
      const priceB = parsePriceNumber(b.price)
      if (sortBy === 'price-asc') return priceA - priceB
      if (sortBy === 'price-desc') return priceB - priceA
      if (sortBy === 'km-asc') return (a.mileage ?? 0) - (b.mileage ?? 0)
      return (b.year ?? 0) - (a.year ?? 0)
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * CARS_PER_PAGE, page * CARS_PER_PAGE)
  const activeFilterCount = [selectedType, selectedMake, selectedSpecs, selectedYear, selectedPriceLabel]
    .filter((v) => !v.startsWith('All')).length

  const filteredNews = (newsFilter === 'All' ? motorNews : motorNews.filter((n) => n.category === newsFilter)).slice(0, NEWS_LIMIT)

  const clearFilters = () => {
    setSelectedType('All body types')
    setSelectedMake('All Brands')
    setSelectedSpecs('All specifications')
    setSelectedYear('All Years')
    setSelectedPriceLabel('All Prices')
    setPage(1)
  }

  const toggleSection = (key: string) => setOpenSection((prev) => (prev === key ? null : key))
  const currentSortLabel = sortOptions.find((o) => o.value === sortBy)?.label ?? 'Sort'
  const scrollToGrid = () => gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap');
        :root { --brass: #b89b6a; }
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; letter-spacing: -0.01em; }
        .text-brass { color: var(--brass); }
        .bg-brass { background-color: var(--brass); }
        .border-brass { border-color: var(--brass); }
        ::selection { background: var(--brass); color: #000; }
        button:focus-visible, a:focus-visible, input:focus-visible { outline: 1px solid var(--brass); outline-offset: 3px; }

        @keyframes heroZoom { from { transform: scale(1.1); } to { transform: scale(1); } }
        .hero-zoom { animation: heroZoom 16s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { opacity: 0; animation: fadeUp 1s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes scrollCue { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        .scroll-cue { animation: scrollCue 2s cubic-bezier(0.65,0,0.35,1) infinite; }

        /* Hero buttons — identical size, never wrap, fill slides in on hover */
        .hero-btn {
          position: relative; overflow: hidden; isolation: isolate;
          display: inline-flex; align-items: center; justify-content: center;
          height: 56px; padding: 0 40px; border-radius: 9999px;
          font-size: 14px; font-weight: 400; letter-spacing: 0.04em; white-space: nowrap;
          transition: color 0.5s ease, border-color 0.5s ease;
        }
        .hero-btn::before {
          content: ''; position: absolute; inset: 0; z-index: -1;
          transform: translateY(101%); transition: transform 0.55s cubic-bezier(0.16,1,0.3,1);
        }
        .hero-btn:hover::before { transform: translateY(0); }
        .hero-btn-solid { background: #fff; color: #000; }
        .hero-btn-solid::before { background: var(--brass); }
        .hero-btn-line { border: 1px solid rgba(255,255,255,0.4); color: #fff; }
        .hero-btn-line::before { background: #fff; }
        .hero-btn-line:hover { color: #000; border-color: #fff; }

        /* Brand marquee */
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 45s linear infinite; will-change: transform; }
        .marquee-track:hover { animation-play-state: paused; }
        .marquee-mask {
          -webkit-mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
          mask-image: linear-gradient(to right, transparent, black 8%, black 92%, transparent);
        }

        /* Car card (original look) with lift, brass glow and image fade-in */
        .car-card { transition: box-shadow 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1); }
        .car-card:hover { transform: translateY(-6px); box-shadow: 0 0 0 1px rgba(184,155,106,0.5), 0 18px 50px rgba(184,155,106,0.12); }
        .car-photo { transition: transform 1.4s cubic-bezier(0.16,1,0.3,1), opacity 0.9s ease; }
        .img-fade { opacity: 0; transform: scale(1.08); }
        .img-fade.loaded { opacity: 1; transform: scale(1); }
        .car-card:hover .img-fade.loaded { transform: scale(1.06); }

        /* News card */
        .news-card:hover .car-photo { transform: scale(1.045); }
        .news-card .news-rule { transition: background-color 0.5s ease; }
        .news-card:hover .news-rule { background-color: var(--brass); }

        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @media (prefers-reduced-motion: reduce) {
          .hero-zoom, .fade-in, .fade-up, .scroll-cue, .marquee-track { animation: none !important; }
          .fade-up { opacity: 1; }
          .reveal, .reveal-word > span { transition: none !important; opacity: 1 !important; transform: none !important; filter: none !important; }
          .draw-line { width: 72px !important; transition: none !important; }
          .car-card, .car-photo, .img-fade { transition: none; }
          .img-fade { opacity: 1; transform: none; }
        }
      `}</style>

      {/* Scroll progress */}
      <div
        ref={progressRef}
        className="fixed top-0 left-0 right-0 h-[2px] bg-brass origin-left z-[120] pointer-events-none"
        style={{ transform: 'scaleX(0)' }}
      />

      <Navbar />

      {/* HERO */}
      <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
        <div ref={videoWrapRef} className="absolute left-0 right-0 top-[-20%] h-[120%] will-change-transform">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            onTimeUpdate={() => {
              if (videoRef.current && !videoEnded) {
                // Stop 0.3s before the end and hold the last frame under a soft blur
                if (videoRef.current.duration - videoRef.current.currentTime < 0.3) {
                  videoRef.current.pause()
                  setVideoEnded(true)
                }
              }
            }}
            className={`hero-zoom absolute inset-0 w-full h-full object-cover object-center z-0 transition-[filter] duration-1000 ${
              videoEnded ? 'blur-sm' : ''
            }`}
          >
            <source src="/inventory-hero.mp4" type="video/mp4" />
          </video>
        </div>

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 70%, #000 100%), radial-gradient(ellipse at 20% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />

        <div ref={heroContentRef} className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-16 pb-20 md:pb-28 will-change-transform">
          <RevealHeading
            as="h1"
            text="Exceptional cars, carefully chosen."
            startDelay={300}
            wordDelay={110}
            className="font-display font-light text-[clamp(2.8rem,9vw,8.5rem)] leading-[0.95] max-w-5xl"
          />
          <div className="mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <p className="fade-up text-zinc-300 text-sm md:text-base font-light leading-relaxed max-w-md" style={{ animationDelay: '1.3s' }}>
              Browse what is available today, or tell us what to find.
            </p>
            <div className="fade-up flex flex-col sm:flex-row gap-3 w-full md:w-auto md:flex-shrink-0" style={{ animationDelay: '1.6s' }}>
              <button onClick={scrollToGrid} className="hero-btn hero-btn-solid w-full sm:w-auto">
                View collection
              </button>
              <a href="/contact" className="hero-btn hero-btn-line w-full sm:w-auto">
                Request a car
              </a>
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="fade-in hidden md:block absolute left-1/2 bottom-6 z-20 w-px h-12 overflow-hidden bg-white/10" style={{ animationDelay: '2.2s', opacity: 0 }}>
          <div className="scroll-cue w-full h-full bg-white/70" />
        </div>

        {/* replay, shown when video ends */}
        {videoEnded && (
          <div className="absolute top-28 right-6 md:right-16 z-30 fade-in">
            <button
              onClick={replay}
              className="w-12 h-12 rounded-full border border-white/40 bg-black/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors duration-300 backdrop-blur-sm"
              aria-label="Replay video"
            >
              <ReplayIcon />
            </button>
          </div>
        )}
      </div>

      {/* INTRO */}
      <section ref={gridRef} className="bg-black px-6 md:px-16 pt-24 pb-16 scroll-mt-24">
        <Reveal>
          <h2 className="font-display font-light text-5xl md:text-7xl leading-none">Available now</h2>
        </Reveal>
        <DrawLine className="mt-8 mb-6" />
        <Reveal delay={150}>
          <p className="text-zinc-500 text-sm md:text-base font-light max-w-md leading-relaxed">
            Each listing is a car we hold, ready to be seen.
          </p>
        </Reveal>
      </section>

      {/* CONTROL BAR — results count, filters, sort */}
      <section className="bg-black/85 backdrop-blur-md px-6 md:px-16 py-4 border-t border-b border-white/10 sticky top-[72px] z-40">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 tracking-wide">
            {carsLoading ? 'Loading' : `${filtered.length} ${filtered.length === 1 ? 'car' : 'cars'}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 border border-white/15 hover:border-brass text-zinc-200 text-xs tracking-wide px-5 py-2.5 rounded-full transition-colors"
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-brass text-black text-[10px] font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setSortMenuOpen((o) => !o)}
                aria-expanded={sortMenuOpen}
                className="flex items-center gap-2 border border-white/15 hover:border-brass text-zinc-200 text-xs tracking-wide px-5 py-2.5 rounded-full transition-colors"
              >
                {currentSortLabel} <ChevronDown open={sortMenuOpen} />
              </button>
              {sortMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[70]" onClick={() => setSortMenuOpen(false)} />
                  <div className="fade-up absolute right-0 top-[calc(100%+10px)] z-[71] bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden w-56 shadow-2xl" style={{ animationDuration: '0.4s' }}>
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSortBy(o.value); setSortMenuOpen(false); setPage(1) }}
                        className={`block w-full text-left px-5 py-3.5 text-xs tracking-wide transition-colors ${
                          sortBy === o.value ? 'text-brass' : 'text-zinc-300 hover:bg-white/5'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {[selectedMake, selectedYear, selectedPriceLabel, selectedType, selectedSpecs]
              .filter((v) => !v.startsWith('All'))
              .map((v) => (
                <span key={v} className="fade-in border border-white/15 text-zinc-300 text-xs px-3 py-1.5 rounded-full">{v}</span>
              ))}
            <button onClick={clearFilters} className="text-zinc-500 text-xs underline underline-offset-4 hover:text-white transition-colors">
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* FILTER DRAWER — bottom sheet on mobile, right-hand panel on desktop */}
      {filterOpen && (
        <>
          <div className="fade-in fixed inset-0 bg-black/80 backdrop-blur-sm z-[95]" onClick={() => setFilterOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="fade-in fixed z-[96] bg-zinc-950 border-white/10 flex flex-col
                       bottom-0 left-0 right-0 max-h-[88vh] rounded-t-3xl border-t
                       md:top-0 md:bottom-0 md:left-auto md:right-0 md:w-[480px] md:max-h-none md:rounded-none md:border-t-0 md:border-l"
          >
            <div className="flex items-start justify-between px-8 pt-8 pb-6">
              <div>
                <p className="font-display text-4xl font-light">Refine</p>
                <p className="text-zinc-500 text-sm mt-2 font-light">Narrow the collection to what you have in mind.</p>
              </div>
              <button
                onClick={() => setFilterOpen(false)}
                aria-label="Close filters"
                className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 hover:rotate-90 flex-shrink-0 transition-all duration-300"
              >
                ✕
              </button>
            </div>

            <div className="px-8 overflow-y-auto flex-1 border-t border-white/10 -mt-px">
              <FilterSection label="Brand" value={selectedMake} options={makeOptions}
                isOpen={openSection === 'make'} onToggle={() => toggleSection('make')}
                onSelect={(v) => { setSelectedMake(v); setPage(1) }} />
              <FilterSection label="Year" value={selectedYear} options={yearOptions}
                isOpen={openSection === 'year'} onToggle={() => toggleSection('year')}
                onSelect={(v) => { setSelectedYear(v); setPage(1) }} />
              <FilterSection label="Price" value={selectedPriceLabel} options={priceOptions}
                isOpen={openSection === 'price'} onToggle={() => toggleSection('price')}
                onSelect={(v) => { setSelectedPriceLabel(v); setPage(1) }} />
              <FilterSection label="Body type" value={selectedType} options={typeOptions}
                isOpen={openSection === 'type'} onToggle={() => toggleSection('type')}
                onSelect={(v) => { setSelectedType(v); setPage(1) }} />
              <FilterSection label="Specification" value={selectedSpecs} options={specsOptions}
                isOpen={openSection === 'specs'} onToggle={() => toggleSection('specs')}
                onSelect={(v) => { setSelectedSpecs(v); setPage(1) }} />
            </div>

            <div className="px-8 py-6 border-t border-white/10 flex items-center gap-3">
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-zinc-400 hover:text-white text-sm underline underline-offset-4 px-2 transition-colors"
                >
                  Clear
                </button>
              )}
              <button
                onClick={() => setFilterOpen(false)}
                className="flex-1 bg-white text-black text-sm py-4 rounded-full hover:bg-brass transition-colors duration-500"
              >
                Show {filtered.length} {filtered.length === 1 ? 'car' : 'cars'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* CARS GRID */}
      <section className="bg-black px-6 md:px-16 py-16 md:py-24">
        {carsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-900 rounded-2xl overflow-hidden animate-pulse" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="w-full bg-zinc-800" style={{ aspectRatio: '2000/1670' }} />
                <div className="p-4 space-y-3">
                  <div className="h-5 w-2/3 bg-zinc-800 rounded" />
                  <div className="h-3 w-1/3 bg-zinc-800 rounded" />
                  <div className="h-5 w-1/4 bg-zinc-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-display text-3xl font-light mb-3">Nothing matches these filters</p>
            <p className="text-zinc-500 text-sm mb-8">Loosen a filter, or let us source the car for you.</p>
            <button onClick={clearFilters} className="border border-white/30 hover:border-brass text-sm px-8 py-3 rounded-full transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((car, i) => (
              <Reveal key={car._id} delay={(i % 3) * 110}>
                <a href={`/vehicle/${car._id}`} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
                  <div className="w-full bg-zinc-800 overflow-hidden" style={{ aspectRatio: '2000/1670' }}>
                    {car.thumbnail && (
                      <img
                        ref={fadeInImage}
                        onLoad={(e) => e.currentTarget.classList.add('loaded')}
                        src={urlFor(car.thumbnail).width(800).url()}
                        alt={car.title}
                        className="car-photo img-fade w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-white text-xl font-light mb-3">{car.title}</p>
                    <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                      <span>{car.mileage?.toLocaleString()} km</span>
                      <span>·</span>
                      <span>{car.year}</span>
                    </div>
                    <p className="text-white font-medium text-lg">{displayPrice(car.price)}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-14">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); gridRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                aria-label={`Page ${i + 1}`}
                aria-current={page === i + 1 ? 'page' : undefined}
                className={`w-9 h-9 text-xs border rounded-full transition-all duration-300 hover:scale-110 ${
                  page === i + 1 ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <BrandSlider />

      {/* SOURCING BAND */}
      <section className="relative min-h-[80vh] w-full overflow-hidden flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/inventory-hero.jpg')", backgroundAttachment: 'fixed' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="relative z-10 px-6 md:px-16 py-24 max-w-3xl">
          <RevealHeading
            as="h2"
            text="Not here? We will find it."
            className="font-display font-light text-5xl md:text-7xl leading-[1] mb-8"
          />
          <DrawLine className="mb-8" />
          <Reveal delay={200}>
            <p className="text-zinc-300 text-base font-light leading-relaxed max-w-md mb-10">
              Our network reaches well beyond what is listed. Tell us the make, the specification and the budget, and we will search for it on your behalf.
            </p>
          </Reveal>
          <Reveal delay={350}>
            <a href="/contact" className="hero-btn hero-btn-solid">
              Start a search
            </a>
          </Reveal>
        </div>
      </section>

      {/* NEWS */}
      <section className="bg-black py-24 px-6 md:px-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <div>
            <Reveal>
              <h2 className="font-display text-5xl md:text-6xl font-light leading-none">News &amp; reviews</h2>
            </Reveal>
            <DrawLine className="mt-8" />
          </div>
          <div className="flex gap-2">
            {['All', 'News', 'Reviews'].map((f) => (
              <button
                key={f}
                onClick={() => setNewsFilter(f)}
                className={`px-5 py-2 text-xs tracking-wide border rounded-full transition-all duration-300 hover:scale-105 ${
                  newsFilter === f ? 'bg-white text-black border-white' : 'border-white/15 text-zinc-400 hover:border-brass hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredNews.length === 0 ? (
          <p className="text-zinc-600 text-sm">Loading…</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-14">
            {filteredNews.map((news, i) => (
              <Reveal key={`${newsFilter}-${i}`} delay={(i % 4) * 90} className={i === 0 ? 'lg:col-span-2' : ''}>
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="news-card block">
                  <div className={`w-full bg-zinc-900 overflow-hidden flex items-center justify-center text-zinc-700 text-xs ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    {news.img
                      ? <img src={news.img} alt={news.title} className="car-photo w-full h-full object-cover" />
                      : <span>Automotive Hub</span>}
                  </div>
                  <div className="news-rule h-px bg-white/15 mt-5" />
                  <div className="pt-4">
                    <p className="text-brass text-xs mb-3">{news.category}</p>
                    <p className={`font-display font-light leading-snug mb-3 ${i === 0 ? 'text-3xl' : 'text-xl'}`}>{news.title}</p>
                    <p className="text-zinc-600 text-xs">{news.date}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* NEWSLETTER */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600" />
          <button type="submit" className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
            SUBSCRIBE
          </button>
        </form>
      </section>

      <Footer />
    </main>
  )
}