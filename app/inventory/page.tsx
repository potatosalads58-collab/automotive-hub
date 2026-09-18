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

const sortOptions = [
  { label: 'Newest First', value: 'year-desc' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Lowest Mileage', value: 'km-asc' },
]

const CARS_PER_PAGE = 12

// Derives a "make" from the title's first word (e.g. "Cadillac Escalade" -> "Cadillac").
// Relies on titles always starting with the brand name.
const deriveMake = (title: string) => title?.trim().split(' ')[0] ?? ''

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

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}

export default function Inventory() {
  const [cars, setCars] = useState<CarListItem[]>([])
  const [carsLoading, setCarsLoading] = useState(true)

  const [selectedType, setSelectedType] = useState('All')
  const [selectedMake, setSelectedMake] = useState('All')
  const [selectedSpecs, setSelectedSpecs] = useState('All')
  const [sortBy, setSortBy] = useState('year-desc')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)

  const [motorNews, setMotorNews] = useState<MotorNewsItem[]>([])
  const [newsFilter, setNewsFilter] = useState('All')

  useEffect(() => {
    client
      .fetch(`*[_type == "car" && isAvailable == true] | order(_createdAt desc){
        _id, title, price, year, mileage, thumbnail, bodyType, specs
      }`)
      .then((data) => {
        setCars(data)
        setCarsLoading(false)
      })
      .catch((err) => {
        console.error(err)
        setCarsLoading(false)
      })
  }, [])

  useEffect(() => {
    fetch('/api/motor1-news')
      .then((res) => res.json())
      .then((data) => setMotorNews(data))
      .catch((err) => console.error(err))
  }, [])

  const types = ['All', ...Array.from(new Set(cars.map((c) => c.bodyType).filter(Boolean)))] as string[]
  const makes = ['All', ...Array.from(new Set(cars.map((c) => deriveMake(c.title)).filter(Boolean)))] as string[]
  const specsList = ['All', ...Array.from(new Set(cars.map((c) => c.specs).filter(Boolean)))] as string[]

  const filtered = cars
    .filter((c) => selectedType === 'All' || c.bodyType === selectedType)
    .filter((c) => selectedMake === 'All' || deriveMake(c.title) === selectedMake)
    .filter((c) => selectedSpecs === 'All' || c.specs === selectedSpecs)
    .sort((a, b) => {
      if (sortBy === 'price-asc') return (a.price ?? 0) - (b.price ?? 0)
      if (sortBy === 'price-desc') return (b.price ?? 0) - (a.price ?? 0)
      if (sortBy === 'km-asc') return (a.mileage ?? 0) - (b.mileage ?? 0)
      return (b.year ?? 0) - (a.year ?? 0)
    })

  const totalPages = Math.max(1, Math.ceil(filtered.length / CARS_PER_PAGE))
  const paginated = filtered.slice((page - 1) * CARS_PER_PAGE, page * CARS_PER_PAGE)
  const activeFilterCount =
    (selectedType !== 'All' ? 1 : 0) + (selectedMake !== 'All' ? 1 : 0) + (selectedSpecs !== 'All' ? 1 : 0)

  const filteredNews = newsFilter === 'All' ? motorNews : motorNews.filter((n) => n.category === newsFilter)

  const clearFilters = () => {
    setSelectedType('All')
    setSelectedMake('All')
    setSelectedSpecs('All')
    setPage(1)
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.08); }
        .filter-chip { transition: all 0.2s ease; }
        .filter-chip.active { background: white; color: black; border-color: white; }
        .sort-select { appearance: none; -webkit-appearance: none; }
        .sheet-enter-active { transition: transform 0.35s cubic-bezier(0.16,1,0.3,1); }
      `}</style>

      <Navbar />

      {/* HERO — video on mobile, freezes on its last frame (no loop attribute) */}
      <div className="relative w-full pt-[72px]" style={{ height: '35vh' }}>
        <video autoPlay muted playsInline poster="/inventory-hero.jpg" className="w-full h-full object-cover object-center">
          <source src="/inventory-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-2">BROWSE</p>
          <h1 className="font-display text-4xl font-light text-white">Available Cars</h1>
        </div>
      </div>

      {/* FILTER BAR */}
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
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1) }}
                className="sort-select bg-transparent border border-zinc-700 hover:border-white text-zinc-200 text-xs tracking-widest pl-4 pr-8 py-2.5 rounded-full focus:outline-none cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value} className="bg-zinc-900">{o.label}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <ChevronDown />
              </div>
            </div>
          </div>
        </div>

        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {selectedType !== 'All' && (
              <button onClick={() => { setSelectedType('All'); setPage(1) }}
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                {selectedType} <span className="text-zinc-500">✕</span>
              </button>
            )}
            {selectedMake !== 'All' && (
              <button onClick={() => { setSelectedMake('All'); setPage(1) }}
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                {selectedMake} <span className="text-zinc-500">✕</span>
              </button>
            )}
            {selectedSpecs !== 'All' && (
              <button onClick={() => { setSelectedSpecs('All'); setPage(1) }}
                className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-700 text-zinc-300 text-xs px-3 py-1.5 rounded-full">
                {selectedSpecs} <span className="text-zinc-500">✕</span>
              </button>
            )}
            <button onClick={clearFilters} className="text-zinc-500 text-xs underline underline-offset-2 hover:text-white">
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* FILTER SHEET */}
      {filterOpen && (
        <>
          <div className="fixed inset-0 bg-black/70 z-[95]" onClick={() => setFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-[96] bg-zinc-950 border-t border-zinc-800 rounded-t-3xl max-h-[80vh] overflow-y-auto sheet-enter-active">
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-800">
              <p className="font-display text-xl font-light">Filters</p>
              <button onClick={() => setFilterOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-900">✕</button>
            </div>

            <div className="px-6 py-6">
              {makes.length > 1 && (
                <>
                  <p className="text-[11px] tracking-[0.3em] text-zinc-500 mb-4">MAKE</p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {makes.map((m) => (
                      <button key={m} onClick={() => { setSelectedMake(m); setPage(1) }}
                        className={`filter-chip px-4 py-2 text-xs tracking-widest border border-zinc-700 rounded-full text-zinc-300 ${selectedMake === m ? 'active' : ''}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {types.length > 1 && (
                <>
                  <p className="text-[11px] tracking-[0.3em] text-zinc-500 mb-4">BODY TYPE</p>
                  <div className="flex gap-2 flex-wrap mb-8">
                    {types.map((t) => (
                      <button key={t} onClick={() => { setSelectedType(t); setPage(1) }}
                        className={`filter-chip px-4 py-2 text-xs tracking-widest border border-zinc-700 rounded-full text-zinc-300 ${selectedType === t ? 'active' : ''}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {specsList.length > 1 && (
                <>
                  <p className="text-[11px] tracking-[0.3em] text-zinc-500 mb-4">REGIONAL SPECS</p>
                  <div className="flex gap-2 flex-wrap">
                    {specsList.map((s) => (
                      <button key={s} onClick={() => { setSelectedSpecs(s); setPage(1) }}
                        className={`filter-chip px-4 py-2 text-xs tracking-widest border border-zinc-700 rounded-full text-zinc-300 ${selectedSpecs === s ? 'active' : ''}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-3 px-6 py-5 border-t border-zinc-800">
              <button onClick={clearFilters} className="flex-1 border border-zinc-700 text-zinc-300 text-xs tracking-widest py-3.5 rounded-lg hover:border-white hover:text-white transition-colors">
                CLEAR
              </button>
              <button onClick={() => setFilterOpen(false)} className="flex-1 bg-white text-black text-xs tracking-widest py-3.5 rounded-lg hover:bg-zinc-200 transition-colors">
                SHOW {filtered.length} CARS
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

      {/* SOURCING BAND */}
      <section className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <img src="/inventory-hero.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">NOT WHAT YOU'RE LOOKING FOR?</p>
          <h2 className="font-display text-3xl font-light leading-snug mb-5 max-w-xs">
            We Can Source It For You.
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-sm mb-8">
            Our network extends well beyond what's listed here. Tell us what you're after, and we'll find it.
          </p>
          <a href="/contact"
            className="inline-block w-fit border border-white/60 text-white px-8 py-3 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            GET IN TOUCH
          </a>
        </div>
      </section>

      {/* NEWS — vertical list */}
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
          <div className="flex flex-col gap-6">
            {filteredNews.map((news, i) => (
              <Reveal key={i} delay={i * 70}>
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="flex gap-4 bg-zinc-900 rounded-2xl overflow-hidden">
                  <div className="w-32 h-32 flex-shrink-0 bg-zinc-800 overflow-hidden">
                    {news.img ? (
                      <img src={news.img} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">Automotive Hub</div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-center">
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

      <Footer />
    </main>
  )
}
