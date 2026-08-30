'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const allCars = [
  { make: "Cadillac", model: "Escalade", km: "2,700", price: 14950000, type: "SUV", fuel: "Petrol", slug: "cadillac-escalade", year: 2023 },
  { make: "Mercedes", model: "E200", km: "49,000", price: 3900000, type: "Sedan", fuel: "Petrol", slug: "mercedes-e200", year: 2022 },
  { make: "Range Rover", model: "Evoque", km: "60,000", price: 2850000, type: "SUV", fuel: "Petrol", slug: "range-rover-evoque", year: 2021 },
  { make: "Infiniti", model: "QX80", km: "78,000", price: 7500000, type: "SUV", fuel: "Petrol", slug: "infiniti-qx80", year: 2022 },
  { make: "Nissan", model: "Patrol", km: "130,000", price: 1650000, type: "SUV", fuel: "Petrol", slug: "nissan-patrol", year: 2014 },
  { make: "Mercedes", model: "S500", km: "200,000", price: 2000000, type: "Sedan", fuel: "Petrol", slug: "mercedes-s500", year: 2018 },
  { make: "Jeep", model: "Wrangler", km: "180,000", price: 1390000, type: "SUV", fuel: "Petrol", slug: "jeep-wrangler", year: 2017 },
  { make: "Mercedes", model: "CLA 180", km: "34,000", price: 2250000, type: "Coupe", fuel: "Petrol", slug: "mercedes-cla-180", year: 2020 },
  { make: "Range Rover", model: "Velar", km: "7,000", price: 5000000, type: "SUV", fuel: "Petrol", slug: "range-rover-velar", year: 2023 },
  { make: "Range Rover", model: "SVR", km: "45,000", price: 8500000, type: "SUV", fuel: "Petrol", slug: "range-rover-svr", year: 2022 },
  { make: "BMW", model: "X5", km: "55,000", price: 4200000, type: "SUV", fuel: "Petrol", slug: "bmw-x5", year: 2021 },
  { make: "Porsche", model: "Cayenne", km: "30,000", price: 6800000, type: "SUV", fuel: "Petrol", slug: "porsche-cayenne", year: 2022 },
]

const types = ["All", "SUV", "Sedan", "Coupe"]
const makes = ["All", "Mercedes", "Range Rover", "Cadillac", "Infiniti", "Nissan", "Jeep", "BMW", "Porsche"]
const sortOptions = [
  { label: "Newest First", value: "year-desc" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Lowest KM", value: "km-asc" },
]

function AnimatedCard({ children, index }: { children: React.ReactNode, index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      transition: `opacity 0.7s ease ${index * 80}ms, transform 0.7s ease ${index * 80}ms, filter 0.7s ease ${index * 80}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : 'translateY(28px)',
      filter: visible ? 'blur(0px)' : 'blur(6px)',
    }}>
      {children}
    </div>
  )
}

export default function Inventory() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedType, setSelectedType] = useState("All")
  const [selectedMake, setSelectedMake] = useState("All")
  const [sortBy, setSortBy] = useState("year-desc")
  const [page, setPage] = useState(1)
  const carsPerPage = 12

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const filtered = allCars
    .filter(c => selectedType === "All" || c.type === selectedType)
    .filter(c => selectedMake === "All" || c.make === selectedMake)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "km-asc") return parseInt(a.km.replace(/,/g, '')) - parseInt(b.km.replace(/,/g, ''))
      return b.year - a.year
    })

  const totalPages = Math.ceil(filtered.length / carsPerPage)
  const paginated = filtered.slice((page - 1) * carsPerPage, page * carsPerPage)

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.4), 0 0 20px rgba(220,38,38,0.08); }
        .bar { display: block; width: 24px; height: 1px; background: white; transition: transform 0.4s ease, opacity 0.3s ease; transform-origin: center; }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }
        .filter-btn { transition: all 0.2s ease; }
        .filter-btn.active { background: white; color: black; }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 py-5 transition-all duration-500 ${scrolled ? 'bg-black border-b border-zinc-800' : 'bg-black'}`}>
        <button onClick={() => setMenuOpen(!menuOpen)}
          className="touch-manipulation cursor-pointer z-[60] relative flex flex-col gap-[5px]" aria-label="Menu">
          <span className={`bar ${menuOpen ? 'bar-1-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-2-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-3-open' : ''}`}></span>
        </button>
        <Link href="/">
          <img src="/logo-nav.png" alt="Logo" className="h-6 w-auto md:h-8" />
        </Link>
        <div className="w-6" />
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {['Home', 'Inventory', 'Sell Your Car', 'Contact', 'About'].map((item, i) => (
          <a key={i} href={item === 'Home' ? '/' : '#'} onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300">
            {item}
          </a>
        ))}
      </div>

      {/* HERO IMAGE */}
      <div className="relative w-full pt-[72px]" style={{ height: '35vh' }}>
        <img src="/inventory-hero.jpg" alt="Inventory"
          className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-2">BROWSE</p>
          <h1 className="font-display text-4xl font-light text-white">Available Cars</h1>
        </div>
      </div>

      {/* FILTER & SORT */}
      <section className="bg-zinc-950 px-6 py-8 border-b border-zinc-800 sticky top-[72px] z-40">
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {types.map(t => (
            <button key={t} onClick={() => { setSelectedType(t); setPage(1) }}
              className={`filter-btn flex-shrink-0 px-4 py-2 text-xs tracking-widest border border-zinc-700 rounded-full text-zinc-400 hover:border-white hover:text-white ${selectedType === t ? 'active' : ''}`}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
          {makes.map(m => (
            <button key={m} onClick={() => { setSelectedMake(m); setPage(1) }}
              className={`filter-btn flex-shrink-0 px-4 py-2 text-xs tracking-widest border border-zinc-700 rounded-full text-zinc-400 hover:border-white hover:text-white ${selectedMake === m ? 'active' : ''}`}>
              {m}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-zinc-500">{filtered.length} cars found</p>
          <select value={sortBy} onChange={e => { setSortBy(e.target.value); setPage(1) }}
            className="bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs px-3 py-2 rounded-lg focus:outline-none focus:border-white">
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </section>

      {/* CARS GRID */}
      <section className="bg-black px-6 py-12">
        {paginated.length === 0 ? (
          <div className="text-center py-20 text-zinc-500 text-sm tracking-widest">NO CARS FOUND</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {paginated.map((car, i) => (
              <AnimatedCard key={car.slug} index={i}>
                <a href={`/vehicle/${car.slug}`} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
                  <div className="w-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs tracking-widest"
                    style={{ aspectRatio: '2000/1670' }}>
                    PHOTO
                  </div>
                  <div className="p-4">
                    <p className="text-zinc-500 text-xs tracking-widest mb-1">{car.make.toUpperCase()}</p>
                    <p className="text-white text-xl font-light mb-1">{car.model}</p>
                    <p className="text-zinc-600 text-xs mb-3">{car.year}</p>
                    <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                      <span>{car.km} km</span>
                      <span>·</span>
                      <span>{car.fuel}</span>
                      <span>·</span>
                      <span>{car.type}</span>
                    </div>
                    <p className="text-white font-medium text-lg">EGP {car.price.toLocaleString()}</p>
                  </div>
                </a>
              </AnimatedCard>
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

      {/* FOOTER */}
      <footer className="bg-zinc-950 border-t border-zinc-800 px-6 py-14">
        <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-xs">
          Egypt&apos;s trusted ultimate exotics marketplace. Quality vehicles, transparent pricing, exceptional service.
        </p>
        <div className="grid grid-cols-3 gap-6 mb-10">
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">SHOWROOM</p>
            {['Inventory', 'Sell Your Car', 'Compare', 'News & Blogs'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">ABOUT US</p>
            {['About Us', 'Services', 'Terms & Conditions', 'Privacy Policy'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">FOLLOW US</p>
            {['Instagram', 'TikTok', 'Facebook'].map((item, i) => (
              <a key={i} href="#" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">{item}</a>
            ))}
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">CONTACT</p>
          <div className="flex flex-col gap-2">
            <a href="tel:01006666802" className="text-sm text-zinc-400 hover:text-white transition-colors">📞 01006666802</a>
            <a href="mailto:automotivehub@gmail.com" className="text-sm text-zinc-400 hover:text-white transition-colors">✉️ automotivehub@gmail.com</a>
            <p className="text-sm text-zinc-400">📍 Cairo, Egypt</p>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-10 text-center flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Automotive Hub. All rights reserved.</p>
          <img src="/logo-full.png" alt="Automotive Hub" className="h-10 w-auto opacity-80" />
        </div>
      </footer>

    </main>
  )
}