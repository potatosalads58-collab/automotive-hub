'use client'
import { useEffect, useRef, useState } from 'react'

const cars = [
  { make: "Cadillac", model: "Escalade", km: "2,700", price: "14,950,000", type: "SUV", fuel: "Petrol", slug: "cadillac-escalade" },
  { make: "Mercedes", model: "E200", km: "49,000", price: "3,900,000", type: "Sedan", fuel: "Petrol", slug: "mercedes-e200" },
  { make: "Range Rover", model: "Evoque", km: "60,000", price: "2,850,000", type: "SUV", fuel: "Petrol", slug: "range-rover-evoque" },
  { make: "Infiniti", model: "QX80", km: "78,000", price: "7,500,000", type: "SUV", fuel: "Petrol", slug: "infiniti-qx80" },
  { make: "Nissan", model: "Patrol", km: "130,000", price: "1,650,000", type: "SUV", fuel: "Petrol", slug: "nissan-patrol" },
  { make: "Mercedes", model: "S500", km: "200,000", price: "2,000,000", type: "Sedan", fuel: "Petrol", slug: "mercedes-s500" },
]

const quickLinks = [
  { title: "Available Vehicles", img: "available-vehicles.jpg", href: "/inventory" },
  { title: "Sell Your Car", img: "sell-your-car.jpg", href: "/sell-your-car" },
  { title: "News & Blogs", img: "news-blogs.jpg", href: "/blogs" },
]

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

useEffect(() => {
  const timer = setTimeout(() => setVideoReady(true), 3000)
  return () => clearTimeout(timer)
}, [])
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 80)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoReady(true)
      videoRef.current?.play()
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .car-card { transition: box-shadow 0.3s ease; }
        .car-card:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.5), 0 0 25px rgba(220,38,38,0.1); }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
        
        /* انيميشن الهامبرجر */
        .bar { 
          display: block; 
          width: 24px; 
          height: 1px; 
          background: white;
          transition: transform 0.4s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }
      `}</style>

      {/* ========== NAVBAR ========== */}
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

      {/* ========== MOBILE MENU ========== */}
      <div className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {['Inventory', 'Sell Your Car', 'Contact', 'About'].map((item, i) => (
          <a key={i} href="#"
            onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300">
            {item}
          </a>
        ))}
        <div className="flex gap-6 mt-10">
          {['Instagram', 'TikTok', 'Facebook'].map((s, i) => (
            <a key={i} href="#" className="text-sm text-zinc-400 hover:text-white tracking-widest">{s}</a>
          ))}
        </div>
      </div>

      {/* HERO */}
<section className="relative h-screen w-full overflow-hidden bg-black">
  
  {/* الصورة بتقعد 3 ثواني بعدين تـ fade */}
  <img
    src="/hero-poster-mobile.jpg"
    alt=""
    className={`block md:hidden absolute inset-0 w-full h-full object-cover object-center z-10 transition-opacity duration-1000 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
  />
  <img
    src="/hero-poster-desktop.jpg"
    alt=""
    className={`hidden md:block absolute inset-0 w-full h-full object-cover object-center z-10 transition-opacity duration-1000 ${videoReady ? 'opacity-0' : 'opacity-100'}`}
  />

  {/* الفيديو دايماً شغال في الخلف بس مش ظاهر */}
  <video
    autoPlay
    muted
    loop
    playsInline
    
  
    className="absolute inset-0 w-full h-full object-cover object-center z-0"
  >
    <source src="/hero-video.mp4" type="video/mp4" />
  </video>

  {/* Gradient فوق كل حاجة */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black z-20 pointer-events-none" />

  {/* النص */}
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

      {/* ========== WHY AUTOMOTIVE HUB ========== */}
      <section className="relative bg-black overflow-hidden">
        {/* Fade من الهيرو */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-transparent z-10 pointer-events-none" />
        
        {/* الصورة */}
        <div className="relative h-[70vh] overflow-hidden">
          <img
            src="/cullinan.jpg"
            alt="Rolls Royce Cullinan Novitec"
            className="w-full h-full object-cover object-center"
          />
          {/* Overlay gradient من تحت */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          
          {/* Badge */}
          <div className="absolute top-8 right-6 border border-white/20 px-3 py-1.5 backdrop-blur-sm z-20">
            <p className="text-white text-xs tracking-[0.3em]">1 OF 1 IN EGYPT</p>
          </div>
        </div>

        {/* المحتوى */}
        <div className="relative z-10 px-6 pb-20 -mt-32">
          {/* خط أحمر */}
          <div className="w-8 h-px bg-red-600 mb-6" />
          
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4">CAIRO&apos;S RAREST DESTINATION</p>
          
          <h2 className="font-display text-4xl font-light text-white leading-tight mb-6">
            Not Every Car<br />Belongs Here.
          </h2>
          
          <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-sm">
            Automotive Hub is home to Egypt&apos;s most exclusive hypercars and 1-of-1 vehicles. 
            What you find here, you won&apos;t find anywhere else in the country.
          </p>

          {/* الأرقام */}
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

      {/* ========== FEATURED CARS ========== */}
      <section className="bg-black px-6 py-16">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-2">AVAILABLE NOW</p>
        <h2 className="font-display text-3xl font-light mb-10">Featured Cars</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cars.map((car, i) => (
            <a href={`/vehicle/${car.slug}`} key={i} className="car-card bg-zinc-900 rounded-2xl overflow-hidden block">
              <div className="w-full bg-zinc-800 flex items-center justify-center text-zinc-600 text-xs tracking-widest"
                style={{ aspectRatio: '2000/1670' }}>
                PHOTO
              </div>
              <div className="p-4">
                <p className="text-zinc-500 text-xs tracking-widest mb-1">{car.make.toUpperCase()}</p>
                <p className="text-white text-xl font-light mb-3">{car.model}</p>
                <div className="flex gap-3 text-xs text-zinc-500 mb-3 flex-wrap">
                  <span>{car.km} km</span>
                  <span>·</span>
                  <span>{car.fuel}</span>
                  <span>·</span>
                  <span>{car.type}</span>
                </div>
                <p className="text-white font-medium text-lg">EGP {car.price}</p>
              </div>
            </a>
          ))}
        </div>
        <a href="/inventory"
          className="block text-center border border-zinc-700 text-zinc-400 py-4 mt-10 text-xs tracking-[0.3em] hover:border-white hover:text-white transition-all duration-300">
          SEE ALL CARS
        </a>
      </section>

      {/* ========== QUICK LINKS ========== */}
      <section className="bg-black px-6 pb-16">
        <div className="grid grid-cols-1 gap-5">
          {quickLinks.map((link, i) => (
            <a href={link.href} key={i}
              className="relative overflow-hidden rounded-2xl block h-48 group">
              <img
                src={`/${link.img}`}
                alt={link.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute bottom-5 left-5">
                <p className="text-white text-xl font-light font-display">{link.title}</p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* ========== FOOTER ========== */}
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

        {/* حقوق النشر واللوجو في المنتصف تحت خالص */}
        <div className="border-t border-zinc-900 pt-10 text-center flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Automotive Hub. All rights reserved.</p>
          <img src="/logo-full.png" alt="Automotive Hub" className="h-10 w-auto opacity-80" />
        </div>
      </footer>

    </main>
  )
}