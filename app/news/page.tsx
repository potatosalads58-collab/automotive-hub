'use client'
import { useEffect, useState, useRef } from 'react'

type MotorNewsItem = {
  category: string
  title: string
  link: string
  img: string
  date: string
}

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-display text-5xl md:text-7xl font-light tracking-wider text-white flex flex-wrap justify-center">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: 0,
            animation: 'letterIn 0.7s ease forwards',
            animationDelay: `${i * 45}ms`,
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </h1>
  )
}

function RevealOnScroll({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      transition: `opacity 0.7s ease ${index * 60}ms, transform 0.7s ease ${index * 60}ms, filter 0.7s ease ${index * 60}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : 'translateY(28px)',
      filter: visible ? 'blur(0px)' : 'blur(6px)',
    }}>
      {children}
    </div>
  )
}

export default function NewsPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [motorNews, setMotorNews] = useState<MotorNewsItem[]>([])
  const [newsFilter, setNewsFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    fetch('/api/motor1-news')
      .then((res) => res.json())
      .then((data) => setMotorNews(data))
      .catch((err) => console.error(err))
  }, [])

  let filteredNews = newsFilter === 'All' ? motorNews : motorNews.filter(n => n.category === newsFilter)
  if (sortOrder === 'oldest') filteredNews = [...filteredNews].reverse()

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
        .card-glow { transition: box-shadow 0.3s ease; }
        .card-glow:hover { box-shadow: 0 0 0 1px rgba(220,38,38,0.5), 0 0 25px rgba(220,38,38,0.1); }
        .bar { display: block; width: 24px; height: 1px; background: white; transition: transform 0.4s ease, opacity 0.3s ease; transform-origin: center; }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }
        @keyframes letterIn {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
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
        <a href="/"><img src="/logo-nav.png" alt="Automotive Hub" className="h-6 w-auto md:h-8" /></a>
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
      <section className="relative w-full h-[60vh] overflow-hidden bg-black">
        <img
          src="/news-hero.jpg"
          alt="The Redline"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.85) 85%, rgba(0,0,0,1) 100%)' }} />
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4 animate-fadeUp">EGYPT&apos;S EXOTICS, MADE SENSE OF</p>
          <AnimatedTitle text="THE REDLINE" />
        </div>
      </section>

      {/* FILTERS */}
      <section className="bg-black px-6 pt-10 pb-6 flex flex-col items-center gap-4">
        <div className="flex gap-3 flex-wrap justify-center">
          {['All', 'News', 'Reviews'].map(f => (
            <button key={f} onClick={() => setNewsFilter(f)}
              className={`px-4 py-2 text-xs tracking-widest border rounded-full transition-all duration-200 ${newsFilter === f ? 'bg-white text-black border-white' : 'border-zinc-700 text-zinc-400 hover:border-white hover:text-white'}`}>
              {f}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSortOrder(o => o === 'newest' ? 'oldest' : 'newest')}
          className="text-xs tracking-widest text-zinc-500 border border-zinc-800 rounded-full px-4 py-2 hover:border-white hover:text-white transition-colors duration-200"
        >
          {sortOrder === 'newest' ? 'NEWEST FIRST' : 'OLDEST FIRST'}  ↕
        </button>
      </section>

      {/* NEWS LIST */}
      <section className="bg-black px-6 pb-20">
        {filteredNews.length === 0 ? (
          <p className="text-zinc-600 text-sm text-center py-10">Loading...</p>
        ) : (
          <div className="max-w-2xl mx-auto flex flex-col gap-6">
            {filteredNews.map((news, i) => (
              <RevealOnScroll key={i} index={i % 6}>
                <a href={news.link} target="_blank" rel="noopener noreferrer"
                  className="card-glow bg-zinc-900 rounded-2xl overflow-hidden block border border-zinc-800">
                  <div className="w-full bg-zinc-800 overflow-hidden" style={{ aspectRatio: '16/9' }}>
                    {news.img ? (
                      <img src={news.img} alt={news.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                        Automotive Hub
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <p className="text-red-600 text-xs tracking-widest mb-2">{news.category.toUpperCase()}</p>
                    <p className="text-white text-lg font-light mb-2 leading-snug">{news.title}</p>
                    <p className="text-zinc-500 text-xs">{news.date}</p>
                  </div>
                </a>
              </RevealOnScroll>
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