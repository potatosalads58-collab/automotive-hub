'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import { client, Car } from '../../../sanity/lib/client'
import { urlFor } from '../../../sanity/lib/imageUrl'

const PHONE = '01096822131'
const WA_NUMBER = '20' + PHONE.slice(1)

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-white flex flex-wrap">
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block"
          style={{
            opacity: 0,
            animation: 'letterIn 0.7s ease forwards',
            animationDelay: `${i * 35}ms`,
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

function ChevronIcon({ direction = "left", size = 20 }: { direction?: "left" | "right"; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {direction === "left" ? <path d="M15 18l-6-6 6-6" /> : <path d="M9 18l6-6-6-6" />}
    </svg>
  )
}

function ShareIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
      <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
    </svg>
  )
}

export default function VehiclePage() {
  const params = useParams()
  const id = params?.id as string

  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)

  const [imgIndex, setImgIndex] = useState(0)
  const [descExpanded, setDescExpanded] = useState(false)
  const [shareMsg, setShareMsg] = useState('')

  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [agreed, setAgreed] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!id) return
    client.fetch(`*[_type == "car" && _id == $id][0]`, { id })
      .then((data) => setCar(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false))
  }, [id])

  const images = car ? (car.gallery && car.gallery.length > 0 ? car.gallery : [car.thumbnail].filter(Boolean)) : []

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [images.length])

  const nextImg = () => setImgIndex((i) => (i + 1) % images.length)
  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length)

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    if (navigator.share) {
      try {
        await navigator.share({ title: car?.title, url })
      } catch {}
    } else {
      try {
        await navigator.clipboard.writeText(url)
        setShareMsg('Link copied!')
        setTimeout(() => setShareMsg(''), 2000)
      } catch {}
    }
  }

  const waLink = (extra = '') => {
    const text = encodeURIComponent(
      `Hi, I'm interested in the ${car?.title || 'car'}${car?.price ? ` (EGP ${car.price.toLocaleString()})` : ''}.${extra}`
    )
    return `https://wa.me/${WA_NUMBER}?text=${text}`
  }

  const handleEnquire = (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed) return
    const extra = ` My name is ${form.name}, phone: ${form.phone}. ${form.message}`
    window.open(waLink(extra), '_blank')
  }

  const hasPerformance = car && (car.hp || car.nm || car.topSpeed || car.acceleration)

  const detailRows = car ? [
    { label: 'Engine', value: car.engine },
    { label: 'Transmission', value: car.transmission },
    { label: 'Drivetrain', value: car.drivetrain },
    { label: 'Body Type', value: car.bodyType },
    { label: 'Exterior Colour', value: car.exteriorColor },
    { label: 'Interior Colour', value: car.interiorColor },
    { label: 'Limited To', value: car.limitedTo },
    { label: 'PPF Protection', value: car.ppf },
  ].filter(r => r.value !== undefined && r.value !== null && r.value !== '') : []

  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Inter:wght@300;400;500&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-display { font-family: 'Cormorant Garamond', serif; }
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
        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover { background: #e5e5e5; }
        .btn-outline { transition: all 0.3s ease; }
        .btn-outline:hover { background: white; color: black; }
        .inquiry-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%), #0a0a0a;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06), 0 30px 60px -20px rgba(0,0,0,0.8);
        }
        .field-input { transition: border-color 0.25s ease, background 0.25s ease; }
        .field-input:focus { background: rgba(255,255,255,0.02); }
      `}</style>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-[55] flex items-center justify-between px-6 py-5 transition-all duration-500 ${scrolled ? 'bg-black border-b border-zinc-800' : 'bg-transparent'}`}>
        <button onClick={() => setMenuOpen(!menuOpen)} className="touch-manipulation cursor-pointer z-[60] relative flex flex-col gap-[5px]" aria-label="Menu">
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
          <a key={i} href="#" onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
            {item}
          </a>
        ))}
        <a href="https://instagram.com/automotivehubegy" target="_blank" onClick={() => setMenuOpen(false)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
          Instagram
        </a>
      </div>

      {loading ? (
        <div className="h-screen flex items-center justify-center text-zinc-600 text-sm">Loading...</div>
      ) : !car ? (
        <div className="h-screen flex items-center justify-center text-zinc-600 text-sm">Car not found.</div>
      ) : (
        <>
          {/* IMAGE CAROUSEL - 1:1 */}
          <section className="relative w-full aspect-square overflow-hidden bg-zinc-950">
            {images.length > 0 && (
              <img
                key={imgIndex}
                src={urlFor(images[imgIndex]).width(1200).height(1200).url()}
                alt={car.title}
                className="w-full h-full object-cover"
                style={{ animation: 'fadeUp 0.6s ease' }}
              />
            )}
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, rgba(0,0,0,0.9) 100%)' }} />

            {images.length > 1 && (
              <>
                <button onClick={prevImg} aria-label="Previous"
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/20 text-white">
                  <ChevronIcon direction="left" />
                </button>
                <button onClick={nextImg} aria-label="Next"
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-black/50 border border-white/20 text-white">
                  <ChevronIcon direction="right" />
                </button>
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => setImgIndex(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${i === imgIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/30'}`} />
                  ))}
                </div>
              </>
            )}
          </section>

          {/* TITLE */}
          <RevealOnScroll>
            <section className="px-6 pt-8 pb-4">
              <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">
                {car.year ? `${car.year}` : ''}{car.year && car.mileage ? ' · ' : ''}{car.mileage ? `${car.mileage.toLocaleString()} KM` : ''}
              </p>
              <AnimatedTitle text={car.title} />
              {car.price && (
                <p className="text-white text-2xl font-light mt-4">EGP {car.price.toLocaleString()}</p>
              )}
            </section>
          </RevealOnScroll>

          {/* SHARE - تحت الاسم والسعر */}
          <section className="px-6 pb-6">
            <button onClick={handleShare}
              className="btn-outline w-full border border-zinc-700 text-white flex items-center justify-center gap-3 py-4 rounded-xl text-xs tracking-[0.3em]">
              <ShareIcon /> {shareMsg || 'SHARE THIS CAR'}
            </button>
          </section>

          {/* SPEC / ODOMETER / MODEL YEAR - شريط علوي زي f1rst */}
          <RevealOnScroll index={1}>
            <section className="px-6 py-8 border-t border-zinc-900">
              <div className="grid grid-cols-3 text-center">
                <div>
                  <p className="text-white text-lg font-light font-display mb-1">{car.specs || '—'}</p>
                  <p className="text-zinc-500 text-[10px] tracking-widest">SPEC</p>
                </div>
                <div className="border-x border-zinc-800">
                  <p className="text-white text-lg font-light font-display mb-1">{car.mileage?.toLocaleString() ?? '—'}</p>
                  <p className="text-zinc-500 text-[10px] tracking-widest">ODOMETER KM</p>
                </div>
                <div>
                  <p className="text-white text-lg font-light font-display mb-1">{car.year ?? '—'}</p>
                  <p className="text-zinc-500 text-[10px] tracking-widest">MODEL YEAR</p>
                </div>
              </div>
            </section>
          </RevealOnScroll>

          {/* PERFORMANCE - سكشن منفصل زي f1rst */}
          {hasPerformance && (
            <RevealOnScroll index={2}>
              <section className="px-6 py-10 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-white" />
                  <p className="text-xs tracking-[0.4em] text-zinc-400">PERFORMANCE</p>
                </div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <p className="text-white text-2xl font-light font-display mb-1">{car.hp ?? '—'}</p>
                    <p className="text-zinc-500 text-[10px] tracking-widest">HP</p>
                  </div>
                  <div>
                    <p className="text-white text-2xl font-light font-display mb-1">{car.nm ?? '—'}</p>
                    <p className="text-zinc-500 text-[10px] tracking-widest">NM</p>
                  </div>
                  <div>
                    <p className="text-white text-2xl font-light font-display mb-1">{car.topSpeed ?? '—'}</p>
                    <p className="text-zinc-500 text-[10px] tracking-widest">KM/H</p>
                  </div>
                  <div>
                    <p className="text-white text-2xl font-light font-display mb-1">{car.acceleration ?? '—'}</p>
                    <p className="text-zinc-500 text-[10px] tracking-widest">0-100</p>
                  </div>
                </div>
              </section>
            </RevealOnScroll>
          )}

          {/* DETAILS - سكشن منفصل */}
          {detailRows.length > 0 && (
            <RevealOnScroll index={3}>
              <section className="px-6 py-10 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-white" />
                  <p className="text-xs tracking-[0.4em] text-zinc-400">DETAILS</p>
                </div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  {detailRows.map((row, i) => (
                    <div key={i}>
                      <p className="text-white text-base font-light">{row.value}</p>
                      <p className="text-zinc-500 text-[10px] tracking-widest mt-1">{row.label.toUpperCase()}</p>
                    </div>
                  ))}
                </div>
              </section>
            </RevealOnScroll>
          )}

          {/* CALL / MESSAGE */}
          <section className="px-6 py-8 border-t border-zinc-900 grid grid-cols-2 gap-3">
            <a href={`tel:${PHONE}`}
              className="btn-primary bg-white text-black flex items-center justify-center gap-2 py-4 rounded-xl text-xs tracking-[0.3em] font-medium">
              📞 CALL
            </a>
            <a href={waLink()} target="_blank" rel="noopener noreferrer"
              className="btn-outline border border-zinc-700 text-white flex items-center justify-center gap-2 py-4 rounded-xl text-xs tracking-[0.3em]">
              💬 MESSAGE
            </a>
          </section>

          {/* DESCRIPTION */}
          {car.description && (
            <RevealOnScroll index={4}>
              <section className="px-6 py-10 border-t border-zinc-900">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-px bg-white" />
                  <p className="text-xs tracking-[0.4em] text-zinc-400">DESCRIPTION</p>
                </div>
                <p className={`text-zinc-400 text-sm leading-relaxed whitespace-pre-line ${descExpanded ? '' : 'line-clamp-4'}`}>
                  {car.description}
                </p>
                <button onClick={() => setDescExpanded(!descExpanded)}
                  className="text-white text-xs tracking-widest mt-4 border-b border-white/40 pb-0.5">
                  {descExpanded ? 'SHOW LESS' : 'READ MORE'}
                </button>
              </section>
            </RevealOnScroll>
          )}

          {/* INQUIRY CARD - إعادة تصميم فخمة */}
          <RevealOnScroll index={5}>
            <section className="px-6 py-12 border-t border-zinc-900">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-white" />
                <p className="text-xs tracking-[0.4em] text-zinc-400">ENQUIRE ABOUT THIS CAR</p>
              </div>

              <form onSubmit={handleEnquire} className="inquiry-card rounded-3xl p-7 flex flex-col gap-6">

                {/* Car summary strip */}
                <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                  {images[0] && (
                    <img src={urlFor(images[0]).width(120).height(120).url()}
                      className="w-16 h-16 rounded-xl object-cover" alt="" />
                  )}
                  <div>
                    <p className="text-zinc-500 text-[10px] tracking-[0.3em]">{car.specs?.toUpperCase() || 'AUTOMOTIVE HUB'}</p>
                    <p className="text-white text-lg font-display font-light mt-0.5">{car.title}</p>
                    {car.price && <p className="text-zinc-400 text-xs mt-1">EGP {car.price.toLocaleString()}</p>}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div>
                    <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">FULL NAME*</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">EMAIL</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="you@email.com" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">PHONE NUMBER*</label>
                    <input required value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="+20 100 123 4567" />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">MESSAGE</label>
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
             rows={3} className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600 resize-none" placeholder="Type your message here..." />
                  </div>
                </div>

                <label className="flex items-start gap-3 text-[11px] text-zinc-500 leading-relaxed">
                  <input type="checkbox" required checked={agreed} onChange={e => setAgreed(e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-white flex-shrink-0" />
                  I agree to the <a href="#" className="underline text-zinc-300">privacy policy</a>.
                </label>

                <button type="submit"
                  className="btn-primary bg-white text-black py-4 rounded-xl text-xs tracking-[0.3em] font-medium">
                  SUBMIT ENQUIRY →
                </button>
              </form>
            </section>
          </RevealOnScroll>
        </>
      )}

      {/* NEWSLETTER */}
      <section className="bg-zinc-950 py-16 px-6 border-t border-zinc-900 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-3">STAY IN THE LOOP</p>
        <h3 className="font-display text-2xl font-light mb-6">Subscribe to our Newsletter</h3>
        <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed!') }}
          className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required placeholder="Your email address"
            className="flex-1 bg-black border border-zinc-700 text-white text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-white placeholder:text-zinc-600" />
          <button type="submit" className="bg-white text-black text-xs tracking-widest px-6 py-3 rounded-lg hover:bg-zinc-200 transition-colors">
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
            <a href={`tel:${PHONE}`} className="text-sm text-zinc-400 hover:text-white transition-colors">📞 {PHONE}</a>
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

