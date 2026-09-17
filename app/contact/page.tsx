'use client'
import { useEffect, useState, useRef } from 'react'
import Footer from '@/components/Footer'

const PHONE = '01010166333'
const PHONE_DISPLAY = '0101 016 6333'
const EMAIL = 'Info@automotivehub.com'
const INSTAGRAM_URL = 'https://instagram.com/automotivehubegy'
const THREADS_URL = 'https://www.threads.net/@automotivehubegy'
const FACEBOOK_URL = 'https://www.facebook.com/share/14nBzBzMDiU/'

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-white flex flex-wrap justify-center">
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

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}
function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}
function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  )
}
function ThreadsIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 2c5.5 0 8 3.5 8 8.5S17.5 22 12 22c-3.8 0-6.5-1.7-7.6-4.6" />
      <path d="M9 11.5c0-2.2 1.6-3.3 3.5-3.3s3.3 1.3 3.3 3.3c0 3-2.3 4-4.3 4-1.6 0-3-.8-3-2.3 0-1.8 1.9-2.4 4-2.4 1.5 0 2.6.3 3.4.8" />
    </svg>
  )
}
function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/>
    </svg>
  )
}
function TiktokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.6 5.82a4.28 4.28 0 0 1-3.02-1.25 4.29 4.29 0 0 1-1.25-2.57h-3.1v13.4a2.7 2.7 0 1 1-1.9-2.58V9.4a5.7 5.7 0 1 0 5 5.66V9.75a7.16 7.16 0 0 0 4.27 1.4V8.05a4.28 4.28 0 0 1-.5-.03v-2.2z"/>
    </svg>
  )
}

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `Hi, my name is ${form.name}. ${form.message}\nPhone: ${form.phone}\nEmail: ${form.email}`
    )
    window.open(`https://wa.me/20${PHONE.slice(1)}?text=${text}`, '_blank')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

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
        .contact-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%), #0a0a0a;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
        }
        .field-input { transition: border-color 0.25s ease, background 0.25s ease; }
        .field-input:focus { background: rgba(255,255,255,0.02); }
        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover { background: #e5e5e5; }
        .social-icon { transition: all 0.25s ease; }
        .social-icon:hover { border-color: white; color: black; background: white; }
        .map-dark { filter: invert(92%) hue-rotate(180deg) contrast(90%); }
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
        <a href={INSTAGRAM_URL} target="_blank" onClick={() => setMenuOpen(false)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
          Instagram
        </a>
      </div>

      {/* HERO - tall crop, not full frame */}
      <section className="relative w-full overflow-hidden bg-zinc-950" style={{ aspectRatio: '941/1423' }}>
        <img
        src="/contact-hero.jpg"
        alt="Automotive Hub"
        className="absolute inset-0 w-full h-full object-cover"
  />
      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.92) 88%, rgba(0,0,0,1) 100%)' }} />
      <div className="absolute inset-x-0 bottom-0 pb-10 px-6 text-center">
      <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4 animate-fadeUp">WE&apos;D LOVE TO HEAR FROM YOU</p>
      <AnimatedTitle text="GET IN TOUCH" />
  </div>
</section>

      {/* CONTACT INFO CARDS */}
      <section className="px-6 py-12">
        <RevealOnScroll>
          <div className="contact-card rounded-2xl p-6 flex flex-col gap-5">
            <a href={`tel:${PHONE}`} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                <PhoneIcon />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] tracking-widest mb-1">CALL US</p>
                <p className="text-white text-base">{PHONE_DISPLAY}</p>
              </div>
            </a>
            <div className="h-px bg-white/10" />
            <a href={`mailto:${EMAIL}`} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                <MailIcon />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] tracking-widest mb-1">EMAIL US</p>
                <p className="text-white text-base">{EMAIL}</p>
              </div>
            </a>
            <div className="h-px bg-white/10" />
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                <ClockIcon />
              </div>
              <div>
                <p className="text-zinc-500 text-[10px] tracking-widest mb-1">SHOWROOM HOURS</p>
                <p className="text-white text-base">11:00 AM — 1:00 AM, Everyday</p>
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </section>

      {/* SOCIALS */}
      <section className="px-6 pb-4">
        <RevealOnScroll index={1}>
          <p className="text-xs tracking-[0.4em] text-zinc-500 mb-5 text-center">FOLLOW ALONG</p>
          <div className="flex items-center justify-center gap-4">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer"
              className="social-icon w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-white">
              <InstagramIcon />
            </a>
            <a href={THREADS_URL} target="_blank" rel="noopener noreferrer"
              className="social-icon w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-white">
              <ThreadsIcon />
            </a>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer"
              className="social-icon w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-white">
              <FacebookIcon />
            </a>
            <a href="#"
              className="social-icon w-14 h-14 rounded-full border border-zinc-700 flex items-center justify-center text-white">
              <TiktokIcon />
            </a>
          </div>
        </RevealOnScroll>
      </section>

      {/* CONTACT FORM */}
      <section className="px-6 py-12">
        <RevealOnScroll index={2}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white" />
            <p className="text-xs tracking-[0.4em] text-zinc-400">SEND US A MESSAGE</p>
          </div>
          <form onSubmit={handleSubmit} className="contact-card rounded-2xl p-6 flex flex-col gap-5">
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
                rows={4} className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600 resize-none" placeholder="Type your message here..." />
            </div>
            <button type="submit"
              className="btn-primary bg-white text-black py-4 rounded-xl text-xs tracking-[0.3em] font-medium mt-2">
              {sent ? 'MESSAGE SENT ✓' : 'SEND MESSAGE →'}
            </button>
          </form>
        </RevealOnScroll>
      </section>

      {/* LOCATION - dark themed map */}
      <section id="location" className="px-6 pb-16">
        <RevealOnScroll index={3}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white" />
            <p className="text-xs tracking-[0.4em] text-zinc-400">FIND US</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-zinc-800" style={{ aspectRatio: '4/3' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3454.826286700698!2d31.0024664!3d30.013144!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14585b005ec6139d%3A0x87ebde9178995179!2sAutomotive%20HUB!5e0!3m2!1sar!2seg!4v1789204878926!5m2!1sar!2seg"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              className="map-dark"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </RevealOnScroll>
      </section>

      <Footer />

    </main>
  )
}
