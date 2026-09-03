'use client'
import { useEffect, useState, useRef } from 'react'
import { client, Car } from '../sanity/lib/client'
import { urlFor } from '../sanity/lib/imageUrl'

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
    images: ["/instagram/ferrari-488-pista.jpg"],
    likes: 327,
    comments: 7,
    date: "January 16",
    caption: "Ferrari 488 Pista »\n•Fully Loaded\n• 1 of 1 in Egypt\n• MY:2020\n•Engine : 4L - 710 HP twin-turbo V8",
  },
  {
    images: ["/instagram/porsche-gt3.jpg"],
    likes: 230,
    comments: 6,
    date: "September 15, 2025",
    caption: "Porsche 992 GT3\nMY:2022\nOnly 2500 kms\n•Fully loaded\n•Full carbon fiber\n•SMG warranty",
  },
  {
    images: ["/instagram/ferrari-purosangue.jpg"],
    likes: 615,
    comments: 2,
    date: "August 3",
    caption: "Ferrari Purosangue\nEngine: 6.5-liter naturally aspirated V12\nPower: 715 hp (725 cv)\nTorque: 528 lb-ft (716 Nm)\nAcceleration: 0 to 100 km/h in 3.3 seconds\nTop Speed: Over 310 km/h (193 mph)",
  },
  {
    images: ["/instagram/mclaren-artura.jpg"],
    likes: 158,
    comments: 5,
    date: "",
    caption: "McLaren Artura\n•Engine layout: Twin-turbocharged V6, 120° V-angle\n•Engine displacement: 2,993 cc (3.0L)\n•Hybrid system: Plug-in hybrid, axial flux electric motor\n•Total system power: ~700 PS / 680-691 HP\n•Total torque: ~720 Nm (531 lb-ft)",
  },
  {
    images: ["/instagram/lamborghini-huracan.jpg"],
    likes: 890,
    comments: 5,
    date: "June 15",
    caption: "One Of One In Egypt\n• Lamborghini HURACAN Evo (Forged carbon fiber edition)\n• Pre Owned — Year: 2021\n• 5200 CC - V10 — 631 HP - 600 N.M\n• 0-100: 2.9 Sec — 0-200: 9 Sec\n• Max. Speed: 324 KM/H",
  },
  {
    images: ["/instagram/ferrari-sf90-spider.jpg"],
    likes: 689,
    comments: 5,
    date: "June 21",
    caption: "Egypt's most beautiful Ferrari\n•Ferrari SF90 Spider\n•Heavy Loaded\n•Engine: 4.0L Twin-Turbo V8 + 3 Electric Motors\n•Horsepower: 986 hp",
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

function InstagramModal({ post, onClose }: { post: InstagramPost; onClose: () => void }) {
  const [imgIndex, setImgIndex] = useState(0)

  const next = () => setImgIndex((i) => (i + 1) % post.images.length)
  const prev = () => setImgIndex((i) => (i - 1 + post.images.length) % post.images.length)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-zinc-900 rounded-2xl border border-zinc-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white hover:bg-black transition-colors"
        >
          ✕
        </button>

        <div className="relative bg-black">
          <img
            src={post.images[imgIndex]}
            alt="Automotive Hub"
            className="w-full max-h-[55vh] object-cover"
          />
          {post.images.length > 1 && (
            <>
              <button
                onClick={prev}
                aria-label="Previous"
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white"
              >
                <ChevronIcon direction="left" />
              </button>
              <button
                onClick={next}
                aria-label="Next"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center bg-black/60 border border-zinc-700 text-white"
              >
                <ChevronIcon direction="right" />
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {post.images.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full ${i === imgIndex ? "bg-white" : "bg-white/30"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-3 px-5 pt-5">
          <img src="/logo-full.png" alt="Automotive Hub" className="w-9 h-9 object-contain rounded-full" />
          <div className="leading-tight">
            <p className="text-white text-sm font-medium">automotivehubegy</p>
            <p className="text-zinc-500 text-xs tracking-widest">PREMIUM CAR DEALERSHIP</p>
          </div>
        </div>

        <p className="px-5 pt-4 text-zinc-400 text-sm leading-relaxed whitespace-pre-line">
          {post.caption}
        </p>

        <div className="flex items-center gap-5 px-5 py-5 mt-2 border-t border-zinc-800 text-zinc-400">
          <span className="flex items-center gap-2 text-sm">
            <HeartIcon /> {post.likes}
          </span>
          <span className="flex items-center gap-2 text-sm">
            <CommentIcon /> {post.comments}
          </span>
          {post.date && <span className="ml-auto text-xs text-zinc-600 tracking-widest">{post.date.toUpperCase()}</span>}
        </div>
      </div>
    </div>
  )
}

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

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [cars, setCars] = useState<Car[]>([])
  const [newsFilter, setNewsFilter] = useState('All')
  const [email, setEmail] = useState('')
  const [igActiveIndex, setIgActiveIndex] = useState<number | null>(null)
  const [motorNews, setMotorNews] = useState<MotorNewsItem[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setVideoReady(true), 3000)
    return () => clearTimeout(timer)
  }, [])

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

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.5), 0 0 25px rgba(220,38,38,0.1); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
        .bar { display: block; width: 24px; height: 1px; background: white; transition: transform 0.4s ease, opacity 0.3s ease; transform-origin: center; }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }
        .news-scroll::-webkit-scrollbar { display: none; }
        .news-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        .ig-tile { transition: transform 0.3s ease; }
        .ig-tile:hover { transform: scale(1.03); }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 py-5 transition-all duration-500 ${scrolled ? 'bg-black border-b border-zinc-800' : 'bg-transparent'}`}>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="touch-manipulation cursor-pointer z-[60] relative flex flex-col gap-[5px]"
          aria-label="Menu"
        >
          <span className={`bar ${menuOpen ? 'bar-1-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-2-open' : ''}`}></span>
          <span className={`bar ${menuOpen ? 'bar-3-open' : ''}`}></span>
        </button>
        <img src="/logo-nav.png" alt="Automotive Hub" className="h-6 w-auto md:h-8" />
        <div className="w-6" />
      </nav>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {['Inventory', 'Sell Your Car', 'Contact', 'About'].map((item, i) => (
          <a key={i} href="#"
            onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300">
            {item}
          </a>
        ))}
        <a href="https://instagram.com/automotivehubegy" target="_blank"
          onClick={() => setMenuOpen(false)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300">
          Instagram
        </a>
      </div>

      {/* HERO */}
      <section className="relative h-screen w-full overflow-hidden bg-black">
        <img
          src="/hero-poster-mobile.jpg"
          alt=""
          className={`block md:hidden absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-1000 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
        />
        <img
          src="/hero-poster-desktop.jpg"
          alt=""
          className={`hidden md:block absolute inset-0 w-full h-full object-cover object-top z-10 transition-opacity duration-1000 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover object-top z-0"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black z-20" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, transparent 40%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,1) 100%)' }} />

        <div className="absolute bottom-24 left-0 right-0 text-center px-6 z-30 animate-fadeUp">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">HOME TO EGYPT&apos;S MOST EXCLUSIVE HYPERCARS &amp; 1-OF-1s</p>
          <h1 className="font-display text-4xl md:text-5xl font-light tracking-wider mb-8 leading-tight text-white">
            EGYPT&apos;S ULTIMATE EXOTICS HUB
          </h1>
          <a href="/inventory"
            className="inline-block border border-white/70 text-white px-10 py-3.5 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            EXPLORE INVENTORY
          </a>
        </div>
      </section>

      {/* WHY AUTOMOTIVE HUB */}
      <section className="relative bg-black overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
        <div className="relative h-[70vh] overflow-hidden">
          <img src="/cullinan.jpg" alt="Rolls Royce Cullinan Novitec"
            className="w-full h-[120%] object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute top-8 right-6 border border-white/20 px-3 py-1.5 backdrop-blur-sm">
            <p className="text-white text-xs tracking-[0.3em]">1 OF 1 IN EGYPT</p>
          </div>
        </div>
        <div className="relative z-10 px-6 pb-20 -mt-32">
          <div className="w-8 h-px bg-red-600 mb-6" />
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">CAIRO&apos;S RAREST DESTINATION</p>
          <h2 className="font-display text-4xl font-light text-white leading-tight mb-6">
            Not Every Car<br />Belongs Here.
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-sm">
            Automotive Hub is home to Egypt&apos;s most exclusive hypercars and 1-of-1 vehicles.
            What you find here, you won&apos;t find anywhere else in the country.
          </p>
          <div className="grid grid-cols-3 gap-4 mb-10 border-t border-zinc-800 pt-8">
            <div>
              <p className="text-white text-2xl font-light font-display mb-1">1 of 1</p>
              <p className="text-zinc-500 text-xs tracking-widest">EXCLUSIVES</p>
            </div>
            <div>
              <p className="text-white text-2xl font-light font-display mb-1">2024</p>
              <p className="text-zinc-500 text-xs tracking-widest">EST. CAIRO</p>
            </div>
            <div>
              <p className="text-white text-2xl font-light font-display mb-1">100%</p>
              <p className="text-zinc-500 text-xs tracking-widest">AUTHENTICATED</p>
            </div>
          </div>
          <a href="/about"
            className="inline-flex items-center gap-3 border border-white/30 text-white px-6 py-3 text-xs tracking-[0.3em] hover:bg-white hover:text-black transition-all duration-300">
            OUR STORY →
          </a>
        </div>
      </section>

      {/* FEATURED CARS - من Sanity */}
      <section className="bg-black px-6 py-16">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-2">AVAILABLE NOW</p>
        <h2 className="font-display text-3xl font-light mb-10">Featured Cars</h2>
        {cars.length === 0 ? (
          <p className="text-zinc-600 text-sm">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car, i) => (
  <AnimatedCard key={car._id} index={i}>
    <a href={`/vehicle/${car._id}`} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
      <div className="w-full bg-zinc-800" style={{ aspectRatio: '2000/1670' }}>
        {car.thumbnail && (
          <img src={urlFor(car.thumbnail).width(800).url()} alt={car.title}
            className="w-full h-full object-cover" />
        )}
      </div>
      <div className="p-4">
        <p className="text-white text-xl font-light mb-3">{car.title}</p>
        <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
          <span>{car.mileage?.toLocaleString()} km</span>
          <span>·</span>
          <span>{car.year}</span>
        </div>
        <p className="text-white font-medium text-lg">EGP {car.price?.toLocaleString()}</p>
      </div>
    </a>
  </AnimatedCard>
))}
            
          </div>
        )}
        <a href="/inventory"
          className="block text-center border border-zinc-700 text-zinc-400 py-4 mt-10 text-xs tracking-[0.3em] hover:border-white hover:text-white transition-all duration-300">
          SEE ALL CARS
        </a>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-black px-6 pb-16">
        <div className="grid grid-cols-1 gap-5">
          {quickLinks.map((link, i) => (
            <a href={link.href} key={i} className="relative overflow-hidden rounded-2xl block h-48 group">
              <img src={`/${link.img}`} alt={link.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-xl font-light font-display">{link.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* NEWS SECTION - لايف من Motor1 */}
      <section className="bg-zinc-950 py-16 border-t border-zinc-900">
        <div className="px-6 mb-8">
          <p className="text-xs tracking-[0.4em] text-zinc-500 mb-2">STAY UPDATED</p>
          <h2 className="font-display text-3xl font-light mb-6">News &amp; Reviews</h2>
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
              <a href={news.link} target="_blank" rel="noopener noreferrer" key={i}
                className="flex-shrink-0 w-72 bg-zinc-900 rounded-2xl overflow-hidden block"
                style={{ scrollSnapAlign: 'start' }}>
                <div className="w-full h-44 bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs overflow-hidden">
                  {news.img ? (
                    <img src={news.img} alt={news.title} className="w-full h-full object-cover" />
                  ) : (
                    <span>Automotive Hub</span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-red-600 text-xs tracking-widest mb-2">{news.category.toUpperCase()}</p>
                  <p className="text-white text-base font-light mb-2 leading-snug">{news.title}</p>
                  <p className="text-zinc-500 text-xs">{news.date}</p>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>

      {/* INSTAGRAM */}
      <section className="bg-black py-16 px-6 border-t border-zinc-900">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY CONNECTED</p>
          <h2 className="font-display text-3xl font-light mb-4">Automotive Hub on Instagram</h2>
          <a href="https://instagram.com/automotivehubegy" target="_blank" rel="noopener noreferrer"
            className="text-white text-sm tracking-widest hover:text-red-500 transition-colors duration-300">
            @automotivehubegy
          </a>
        </div>

        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-3">
          {instagramPosts.map((post, i) => (
            <button
              key={i}
              onClick={() => setIgActiveIndex(i)}
              className="ig-tile group relative aspect-square overflow-hidden rounded-xl bg-zinc-900 border border-zinc-800"
            >
              <img
                src={post.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100">
                <span className="flex items-center gap-1.5 text-white text-xs font-medium">
                  <HeartIcon filled size={14} /> {post.likes}
                </span>
                <span className="flex items-center gap-1.5 text-white text-xs font-medium">
                  <CommentIcon size={14} /> {post.comments}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {igActiveIndex !== null && (
        <InstagramModal post={instagramPosts[igActiveIndex]} onClose={() => setIgActiveIndex(null)} />
      )}

      {/* NEWSLETTER */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
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
            <a href="https://instagram.com/automotivehubegy" target="_blank" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Instagram</a>
            {['TikTok', 'Facebook'].map((item, i) => (
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