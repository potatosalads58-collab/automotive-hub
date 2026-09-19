'use client'
import { useState, useEffect, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/imageUrl'

type CarListItem = {
  _id: string
  title: string
  price?: number
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
  { label: 'Newest First', value: 'year-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Lowest Mileage', value: 'km-asc' },
]

const CARS_PER_PAGE = 12
const NEWS_LIMIT = 8

function useInView<T extends HTMLElement>(threshold = 0.15): [React.RefObject<T | null>, boolean] {
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

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
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
      <span className="inline-block" style={{
        transition: `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * wordDelay}ms, opacity 0.6s ease ${i * wordDelay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0%)' : 'translateY(115%)',
      }}>{word}</span>
    </span>
  ))
  if (as === 'h1') return <h1 ref={ref} className={className}>{content}</h1>
  return <h2 ref={ref} className={className}>{content}</h2>
}

function ChevronDown({ open = false }: { open?: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease' }}>
      <path d="M6 9l6 6 6-6" />
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
    <section className="bg-black py-14 border-t border-b border-zinc-900 overflow-hidden">
      <p className="text-center text-[11px] tracking-[0.35em] text-zinc-500 mb-10">THE MARQUES WE DEAL IN</p>
      <div
        ref={trackRef}
        onPointerDown={pause}
        onPointerUp={scheduleResume}
        onPointerCancel={scheduleResume}
        onTouchStart={pause}
        onTouchEnd={scheduleResume}
        onMouseLeave={scheduleResume}
        className="flex gap-16 overflow-x-auto px-10"
        style={{
          scrollbarWidth: 'none',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        }}
      >
        {[...brands, ...brands, ...brands].map((b, i) => (
          <div key={i} className="flex flex-col items-center gap-3 flex-shrink-0 select-none">
            <img
              src={logoUrl(b.domain)}
              alt={b.name}
              draggable={false}
              className="h-10 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-500"
            />
            <span className="text-[9px] tracking-[0.25em] text-zinc-500 whitespace-nowrap">{b.name.toUpperCase()}</span>
          </div>
        ))}
      </div>
      <style>{`section div::-webkit-scrollbar { display: none; }`}</style>
    </section>
  )
}

// One row of the filter sheet: label + a dropdown-styled trigger that
// expands into a chip list beneath it (accordion), matching the
// reference layout but in our own black/white palette.
function FilterSection({
  label,
  value,
  options,
  isOpen,
  onToggle,
  onSelect,
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
    <div className="mb-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="w-4 h-px bg-red-600" />
        <p className="text-[11px] tracking-[0.3em] text-zinc-500">{label}</p>
      </div>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 text-left"
      >
        <span className="text-sm text-zinc-200">{value}</span>
        <span className="text-zinc-500"><ChevronDown open={isOpen} /></span>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isOpen ? '260px' : '0px' }}>
        <div className="flex gap-2 flex-wrap pt-4 pb-1">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onSelect(opt)}
              className={`px-4 py-2 text-xs tracking-widest border rounded-full transition-colors ${
                value === opt ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-300 hover:border-white hover:text-white'
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
    .filter((c) => (c.price ?? 0) >= activePriceBand.min && (c.price ?? 0) < (activePriceBand.max === Infinity ? Infinity : activePriceBand.max + 1))
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price ?? 0) - (b.price ?? 0)
      if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0)
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

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.08); }
      `}</style>

      <Navbar />

      {/* HERO — shorter than before */}
      <div className="relative w-full h-[70vh] min-h-[460px]">
        <video autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover object-center">
          <source src="/inventory-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.55) 70%, rgba(0,0,0,0.95) 100%)' }} />
        <div className="absolute bottom-14 left-0 right-0 px-6">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">THE COLLECTION</p>
          <RevealHeading as="h1" text="Every Car Here Has Already Been Chosen."
            className="font-display text-4xl font-light leading-tight text-white max-w-sm" />
        </div>
      </div>

      {/* CONTROL BAR — results count, Filters trigger, custom Sort dropdown */}
      <section className="bg-zinc-950 px-6 py-5 border-b border-zinc-800 sticky top-[72px] z-40">
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-zinc-500 tracking-widest">
            {carsLoading ? 'LOADING...' : `${filtered.length} CAR${filtered.length === 1 ? '' : 'S'}`}
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterOpen(true)}
              className="flex items-center gap-2 border border-zinc-700 hover:border-white text-zinc-200 text-xs tracking-widest px-4 py-2.5 rounded-full transition-colors"
            >
              FILTERS
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 flex items-center justify-center rounded-full bg-white text-black text-[10px] font-medium">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative">
              <button
                onClick={() => setSortMenuOpen((o) => !o)}
                className="flex items-center gap-2 border border-zinc-700 hover:border-white text-zinc-200 text-xs tracking-widest px-4 py-2.5 rounded-full transition-colors"
              >
                {currentSortLabel} <ChevronDown open={sortMenuOpen} />
              </button>
              {sortMenuOpen && (
                <>
                  <div className="fixed inset-0 z-[70]" onClick={() => setSortMenuOpen(false)} />
                  <div className="absolute right-0 top-[calc(100%+8px)] z-[71] bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden w-48 shadow-2xl">
                    {sortOptions.map((o) => (
                      <button
                        key={o.value}
                        onClick={() => { setSortBy(o.value); setSortMenuOpen(false); setPage(1) }}
                        className={`block w-full text-left px-4 py-3 text-xs tracking-wide transition-colors ${
                          sortBy === o.value ? 'bg-white text-black' : 'text-zinc-300 hover:bg-zinc-800'
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
                <span key={v} className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">{v}</span>
              ))}
            <button onClick={clearFilters} className="text-zinc-500 text-xs underline underline-offset-2 hover:text-white">
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* FILTER SHEET — "REFINE" */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[95]" onClick={() => setFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[96] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-zinc-900">
              <div>
                <p className="font-display text-2xl font-light tracking-wide">REFINE</p>
                <p className="text-zinc-500 text-sm mt-1">Curate your perfect selection</p>
              </div>
              <button onClick={() => setFilterOpen(false)} className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900 flex-shrink-0">✕</button>
            </div>

            <div className="px-6 py-6 overflow-y-auto flex-1">
              <FilterSection label="BRAND" value={selectedMake} options={makeOptions}
                isOpen={openSection === 'make'} onToggle={() => toggleSection('make')}
                onSelect={(v) => { setSelectedMake(v); setPage(1) }} />
              <FilterSection label="YEAR" value={selectedYear} options={yearOptions}
                isOpen={openSection === 'year'} onToggle={() => toggleSection('year')}
                onSelect={(v) => { setSelectedYear(v); setPage(1) }} />
              <FilterSection label="PRICE" value={selectedPriceLabel} options={priceOptions}
                isOpen={openSection === 'price'} onToggle={() => toggleSection('price')}
                onSelect={(v) => { setSelectedPriceLabel(v); setPage(1) }} />
              <FilterSection label="BODY TYPE" value={selectedType} options={typeOptions}
                isOpen={openSection === 'type'} onToggle={() => toggleSection('type')}
                onSelect={(v) => { setSelectedType(v); setPage(1) }} />
              <FilterSection label="SPECS" value={selectedSpecs} options={specsOptions}
                isOpen={openSection === 'specs'} onToggle={() => toggleSection('specs')}
                onSelect={(v) => { setSelectedSpecs(v); setPage(1) }} />
            </div>

            <div className="px-6 py-5 border-t border-zinc-900">
              <button onClick={() => setFilterOpen(false)}
                className="w-full bg-white text-black text-xs tracking-[0.3em] py-4 rounded-xl hover:bg-zinc-200 transition-colors">
                APPLY FILTERS · {filtered.length} CARS
              </button>
            </div>
          </div>
        </>
      )}

      {/* CARS GRID */}
      <section className="bg-black px-6 py-12">
        {carsLoading ? (
          <p className="text-zinc-600 text-sm">Loading...</p>
        ) : paginated.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm tracking-widest">NO CARS FOUND</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((car, i) => (
              <Reveal key={car._id} delay={i * 80}>
                <a href={`/vehicle/${car._id}`} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
                  <div className="w-full bg-zinc-800" style={{ aspectRatio: '2000/1670' }}>
                    {car.thumbnail && (
                      <img src={urlFor(car.thumbnail).width(800).url()} alt={car.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-500 text-xs tracking-widest mb-1">{deriveMake(car.title).toUpperCase()}</p>
                    <p className="text-white text-xl font-light mb-1">{car.title}</p>
                    <p className="text-zinc-600 text-xs mb-3">{car.year}</p>
                    <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                      <span>{car.mileage?.toLocaleString()} km</span>
                      {car.bodyType && <><span>·</span><span>{car.bodyType}</span></>}
                      {car.specs && <><span>·</span><span>{car.specs}</span></>}
                    </div>
                    <p className="text-white font-medium text-lg">EGP {car.price?.toLocaleString()}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center gap-3 mt-14">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className={`w-9 h-9 text-xs border rounded-full transition-all duration-200 ${page === i + 1 ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>

      <BrandSlider />

      {/* SOURCING BAND */}
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <img src="/inventory-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">NOT WHAT YOU'RE LOOKING FOR?</p>
          <RevealHeading as="h2" text="We Can Source It For You."
            className="font-display text-3xl font-light leading-snug mb-5 max-w-xs text-white" />
          <p className="text-zinc-300 text-sm leading-relaxed max-w-sm mb-8">
            Our network extends well beyond what's listed here. Tell us what you're after, and we'll find it.
          </p>
          <a href="/contact" className="inline-block w-fit border border-white/60 text-white px-8 py-3 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            GET IN TOUCH
          </a>
        </div>
      </section>

      {/* NEWS */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-2">STAY UPDATED</p>
        <h2 className="font-display text-3xl font-light mb-6">News &amp; Reviews</h2>

        <div className="flex gap-3 mb-10">
          {['All', 'News', 'Reviews'].map((f) => (
            <button key={f} onClick={() => setNewsFilter(f)}
              className={`px-4 py-2 text-xs tracking-widest border rounded-full transition-all duration-200 ${newsFilter === f ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>

        {filteredNews.length === 0 ? (
          <p className="text-zinc-600 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {filteredNews.map((news, i) => (
              <Reveal key={i} delay={i * 70}>
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="bg-zinc-900 rounded-2xl overflow-hidden block">
                  <div className="w-full aspect-[16/9] bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs overflow-hidden">
                    {news.img ? <img src={news.img} alt={news.title} className="w-full h-full object-cover" /> : <span>Automotive Hub</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-red-600 text-xs tracking-widest mb-2">{news.category.toUpperCase()}</p>
                    <p className="text-white text-base font-light mb-2 leading-snug">{news.title}</p>
                    <p className="text-zinc-500 text-xs">{news.date}</p>
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
