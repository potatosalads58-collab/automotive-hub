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

const formatPrice = (price?: number | string): { amount: string; currency: string } => {
  const n = parsePriceNumber(price)
  if (!n) return { amount: 'Price on request', currency: '' }
  return { amount: n.toLocaleString('en-US'), currency: 'EGP' }
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

// Quiet entrance: fades in once, short travel, no blur.
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const [ref, visible] = useInView<HTMLDivElement>(0.1)
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{
        transition: `opacity 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.9s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(18px)',
      }}
    >
      {children}
    </div>
  )
}

// Word-by-word masked headline. Used for the hero and the sourcing band only.
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
function ArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  )
}

function BrandSlider() {
  const trackRef = useRef<HTMLDivElement>(null)
  const interactingRef = useRef(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame: number
    const step = () => {
      if (!interactingRef.current) {
        el.scrollLeft += 0.4
        const third = el.scrollWidth / 3
        if (el.scrollLeft >= third * 2) el.scrollLeft -= third
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [])

  const pause = () => {
    interactingRef.current = true
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }
  const scheduleResume = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => { interactingRef.current = false }, 800)
  }

  return (
    <section className="bg-black py-20 border-t border-b border-white/10 overflow-hidden">
      <p className="text-center font-display text-2xl font-light text-zinc-400 mb-12">The marques we deal in</p>
      <div
        ref={trackRef}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onMouseLeave={scheduleResume}
        className="no-scrollbar flex gap-20 overflow-x-auto px-10"
        style={{
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        }}
      >
        {[...brands, ...brands, ...brands].map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-4 flex-shrink-0 select-none">
            <img
              src={logoUrl(b.domain)}
              alt={b.name}
              draggable={false}
              className="h-11 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
            />
            <span className="text-[10px] tracking-[0.2em] text-zinc-600 whitespace-nowrap">{b.name.toUpperCase()}</span>
          </div>
        ))}
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
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`px-4 py-2 text-xs tracking-wide border rounded-full transition-colors ${
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
      // When a price filter is active, "price on request" cars (0) are hidden
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
        .no-scrollbar { scrollbar-width: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }

        @keyframes heroZoom { from { transform: scale(1.08); } to { transform: scale(1); } }
        .hero-zoom { animation: heroZoom 14s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .fade-in { animation: fadeIn 0.8s ease forwards; }
        @keyframes scrollCue { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

        /* Car card: one hover behaviour only — the photograph slowly leans in */
        .car-photo { transition: transform 1.6s cubic-bezier(0.16,1,0.3,1); }
        .car-card:hover .car-photo { transform: scale(1.045); }
        .car-card .car-rule { transition: background-color 0.5s ease; }
        .car-card:hover .car-rule { background-color: var(--brass); }
        .car-card .car-arrow { opacity: 0; transform: translate(-6px, 6px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .car-card:hover .car-arrow { opacity: 1; transform: translate(0,0); }

        @media (prefers-reduced-motion: reduce) {
          .hero-zoom, .fade-in { animation: none; }
          .reveal, .reveal-word > span { transition: none !important; opacity: 1 !important; transform: none !important; }
          .car-photo, .car-arrow { transition: none; }
        }
      `}</style>

      <Navbar />

      {/* HERO — full-bleed film with the headline set directly on it */}
      <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
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

        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.55) 70%, #000 100%), radial-gradient(ellipse at 20% 100%, rgba(0,0,0,0.6) 0%, transparent 60%)',
          }}
        />

        <div className="absolute inset-x-0 bottom-0 z-20 px-6 md:px-16 pb-16 md:pb-24">
          <RevealHeading
            as="h1"
            text="Exceptional cars, carefully chosen."
            startDelay={300}
            wordDelay={110}
            className="font-display font-light text-[clamp(3rem,9vw,8.5rem)] leading-[0.95] max-w-5xl"
          />
          <div className="fade-in mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-8" style={{ animationDelay: '1.4s', opacity: 0 }}>
            <p className="text-zinc-300 text-sm md:text-base font-light leading-relaxed max-w-md">
              Every car in our showroom is inspected and presented in person.
              Browse what is available today, or tell us what to find.
            </p>
            <div className="flex items-center gap-4">
              <button
                onClick={scrollToGrid}
                className="bg-white text-black text-sm px-8 py-4 rounded-full hover:bg-brass transition-colors duration-500"
              >
                Browse the collection
              </button>
              <a
                href="/contact"
                className="text-sm px-8 py-4 rounded-full border border-white/30 text-white hover:border-white transition-colors duration-500"
              >
                Request a car
              </a>
            </div>
          </div>
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
          <p className="text-zinc-500 text-sm md:text-base font-light mt-6 max-w-md leading-relaxed">
            Each listing is a car we hold, in Cairo, ready to be seen.
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
                  <div className="fade-in absolute right-0 top-[calc(100%+10px)] z-[71] bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden w-56 shadow-2xl">
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
                <span key={v} className="border border-white/15 text-zinc-300 text-xs px-3 py-1.5 rounded-full">{v}</span>
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
                className="w-10 h-10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/5 flex-shrink-0 transition-colors"
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
          <p className="text-zinc-600 text-sm">Loading the collection…</p>
        ) : paginated.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-3xl font-light mb-3">Nothing matches these filters</p>
            <p className="text-zinc-500 text-sm mb-8">Loosen a filter, or let us source the car for you.</p>
            <button onClick={clearFilters} className="border border-white/30 hover:border-brass text-sm px-8 py-3 rounded-full transition-colors">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16 md:gap-y-20">
            {paginated.map((car, i) => {
              const { amount, currency } = formatPrice(car.price)
              return (
                // Middle column drops slightly on large screens for an editorial rhythm
                <Reveal key={car._id} delay={(i % 3) * 100} className="lg:[&:nth-child(3n+2)]:mt-16">
                  <a href={`/vehicle/${car._id}`} className="car-card group block">
                    <div className="relative w-full bg-zinc-900 overflow-hidden" style={{ aspectRatio: '2000/1670' }}>
                      {car.thumbnail && (
                        <img
                          src={urlFor(car.thumbnail).width(1200).url()}
                          alt={car.title}
                          className="car-photo w-full h-full object-cover"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                      <span className="car-arrow absolute bottom-5 right-5 w-11 h-11 rounded-full bg-white text-black flex items-center justify-center">
                        <ArrowUpRight />
                      </span>
                    </div>

                    <div className="car-rule h-px bg-white/15 mt-6" />

                    <div className="pt-5">
                      <div className="flex items-start justify-between gap-6">
                        <h3 className="font-display text-2xl md:text-[1.7rem] font-light leading-tight">{car.title}</h3>
                        <p className="text-right flex-shrink-0 pt-1">
                          {currency && <span className="block text-[10px] tracking-[0.2em] text-zinc-500">{currency}</span>}
                          <span className={currency ? 'text-lg font-light' : 'text-sm text-zinc-400 font-light'}>{amount}</span>
                        </p>
                      </div>
                      <div className="flex items-center gap-4 mt-4 text-xs text-zinc-500 font-light">
                        {car.year && <span>{car.year}</span>}
                        {car.mileage != null && (
                          <>
                            <span className="w-px h-3 bg-white/15" />
                            <span>{car.mileage.toLocaleString('en-US')} km</span>
                          </>
                        )}
                        {car.bodyType && (
                          <>
                            <span className="w-px h-3 bg-white/15" />
                            <span>{car.bodyType}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </a>
                </Reveal>
              )
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-24">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => { setPage(i + 1); gridRef.current?.scrollIntoView({ behavior: 'smooth' }) }}
                aria-label={`Page ${i + 1}`}
                aria-current={page === i + 1 ? 'page' : undefined}
                className={`w-10 h-10 text-sm rounded-full transition-all duration-300 ${
                  page === i + 1 ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <BrandSlider />

      {/* SOURCING BAND — the one big moment after the grid */}
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
          <p className="text-zinc-300 text-base font-light leading-relaxed max-w-md mb-10">
            Our network reaches well beyond what is listed. Tell us the make, the specification and the budget, and we will search for it on your behalf.
          </p>
          <a
            href="/contact"
            className="inline-block bg-white text-black text-sm px-10 py-4 rounded-full hover:bg-brass transition-colors duration-500"
          >
            Start a search
          </a>
        </div>
      </section>

      {/* NEWS */}
      <section className="bg-black py-24 px-6 md:px-16 border-t border-white/10">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-14">
          <h2 className="font-display text-5xl md:text-6xl font-light leading-none">News &amp; reviews</h2>
          <div className="flex gap-2">
            {['All', 'News', 'Reviews'].map((f) => (
              <button
                key={f}
                onClick={() => setNewsFilter(f)}
                className={`px-5 py-2 text-xs tracking-wide border rounded-full transition-colors ${
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
              <Reveal key={i} delay={(i % 4) * 80} className={i === 0 ? 'lg:col-span-2' : ''}>
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="car-card group block">
                  <div className={`w-full bg-zinc-900 overflow-hidden flex items-center justify-center text-zinc-700 text-xs ${i === 0 ? 'aspect-[16/10]' : 'aspect-[4/3]'}`}>
                    {news.img
                      ? <img src={news.img} alt={news.title} className="car-photo w-full h-full object-cover" />
                      : <span>Automotive Hub</span>}
                  </div>
                  <div className="car-rule h-px bg-white/15 mt-5" />
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
      <section className="bg-zinc-950 py-28 px-6 md:px-16 border-t border-white/10">
        <div className="max-w-2xl">
          <h3 className="font-display text-4xl md:text-5xl font-light leading-tight mb-4">First sight of new arrivals</h3>
          <p className="text-zinc-500 text-sm font-light mb-10 max-w-md">
            New cars are shared with subscribers before they are listed. One short email, only when something arrives.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
            className="flex items-center gap-4 border-b border-white/25 focus-within:border-brass transition-colors pb-3"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              aria-label="Email address"
              className="flex-1 bg-transparent text-white text-base font-light py-2 focus:outline-none placeholder:text-zinc-600"
            />
            <button type="submit" className="text-sm text-white hover:text-brass transition-colors px-2">
              Subscribe
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  )
}
