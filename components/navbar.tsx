'use client'
import { useEffect, useState } from 'react'

const INSTAGRAM_URL = 'https://instagram.com/automotivehubegy'
const THREADS_URL = 'https://www.threads.net/@automotivehubegy'
const FACEBOOK_URL = 'https://www.facebook.com/share/14nBzBzMDiU/'

const NAV_LINKS = [
  { label: 'Inventory', href: '/inventory' },
  { label: 'Sell Your Car', href: '/sell-your-car' },
  { label: 'News', href: '/news' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const SOCIAL_LINKS = [
  { label: 'Instagram', href: INSTAGRAM_URL },
  { label: 'Threads', href: THREADS_URL },
  { label: 'Facebook', href: FACEBOOK_URL },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [socialOpen, setSocialOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => {
    setMenuOpen(false)
    setSocialOpen(false)
  }

  return (
    <>
      <style>{`
        .bar { display: block; width: 24px; height: 1px; background: white; transition: transform 0.4s ease, opacity 0.3s ease; transform-origin: center; }
        .bar-1-open { transform: translateY(5px) rotate(45deg); }
        .bar-2-open { opacity: 0; transform: scaleX(0); }
        .bar-3-open { transform: translateY(-5px) rotate(-45deg); }
      `}</style>

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

      <div className={`fixed inset-0 bg-black z-[50] flex flex-col justify-start pt-28 px-8 overflow-y-auto transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {NAV_LINKS.map((item, i) => (
          <a key={i} href={item.href}
            onClick={closeMenu}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300">
            {item.label}
          </a>
        ))}

        <button
          onClick={() => setSocialOpen(!socialOpen)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-red-500 transition-colors duration-300 flex items-center justify-between w-full text-left"
        >
          Social
          <span className="text-lg transition-transform duration-300" style={{ transform: socialOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>↓</span>
        </button>
        <div className="overflow-hidden transition-all duration-400" style={{ maxHeight: socialOpen ? `${SOCIAL_LINKS.length * 64}px` : '0px' }}>
          {SOCIAL_LINKS.map((social, i) => (
            <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" onClick={closeMenu}
              className="block font-display text-xl font-light tracking-widest py-4 pl-4 border-b border-zinc-900 text-zinc-400 hover:text-red-500 transition-colors duration-300">
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}