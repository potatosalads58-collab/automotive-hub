'use client'
import { useEffect, useState, useRef } from 'react'
import Footer from '@/components/Footer'

const PHONE = '01010166333'

function RevealOnScroll({ children, index = 0 }: { children: React.ReactNode; index?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} style={{
      transition: `opacity 0.7s ease ${index * 60}ms, transform 0.7s ease ${index * 60}ms, filter 0.7s ease ${index * 60}ms`,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px)' : 'translateY(24px)',
      filter: visible ? 'blur(0px)' : 'blur(6px)',
    }}>
      {children}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-6 h-px bg-white" />
        <p className="text-xs tracking-[0.35em] text-zinc-400">{title.toUpperCase()}</p>
      </div>
      <div className="text-zinc-400 text-sm leading-relaxed flex flex-col gap-3">{children}</div>
    </div>
  )
}

export default function PrivacyPolicyPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [tab, setTab] = useState<'privacy' | 'terms'>('privacy')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        {[
          { label: 'Inventory', href: '/inventory' },
          { label: 'Sell Your Car', href: '/sell-your-car' },
          { label: 'Contact', href: '/contact' },
          { label: 'About', href: '/about' },
        ].map((item, i) => (
          <a key={i} href={item.href} onClick={() => setMenuOpen(false)}
            className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
            {item.label}
          </a>
        ))}
        <a href="https://instagram.com/automotivehubegy" target="_blank" onClick={() => setMenuOpen(false)}
          className="font-display text-3xl font-light tracking-widest py-5 border-b border-zinc-800 text-white hover:text-zinc-400 transition-colors duration-300">
          Instagram
        </a>
      </div>

      {/* PAGE HEADER */}
      <section className="px-6 pt-32 pb-10 text-center">
        <p className="text-xs tracking-[0.4em] text-zinc-500 mb-4 animate-fadeUp">LEGAL</p>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-white">
          Privacy Policy &amp; Terms
        </h1>
        <p className="text-zinc-500 text-xs mt-4">Last updated: September 2026</p>
      </section>

      {/* TAB SWITCHER */}
      <section className="px-6 pb-8 sticky top-[68px] z-40 bg-black/90 backdrop-blur-sm">
        <div className="flex max-w-md mx-auto border border-zinc-800 rounded-full p-1">
          <button onClick={() => setTab('privacy')}
            className={`flex-1 py-3 rounded-full text-xs tracking-[0.2em] transition-all duration-300 ${tab === 'privacy' ? 'bg-white text-black' : 'text-zinc-500'}`}>
            PRIVACY POLICY
          </button>
          <button onClick={() => setTab('terms')}
            className={`flex-1 py-3 rounded-full text-xs tracking-[0.2em] transition-all duration-300 ${tab === 'terms' ? 'bg-white text-black' : 'text-zinc-500'}`}>
            TERMS &amp; CONDITIONS
          </button>
        </div>
      </section>

      {/* CONTENT */}
      <section className="px-6 pb-20 max-w-2xl mx-auto">
        {tab === 'privacy' ? (
          <RevealOnScroll>
            <Section title="Information We Collect">
              <p>When you browse Automotive Hub, enquire about a vehicle, or submit a car for sale, we may collect personal details such as your name, phone number, email address, and any information you choose to share through our contact and enquiry forms — including vehicle documents and photos submitted through the Sell Your Car process.</p>
            </Section>
            <Section title="How We Use Your Information">
              <p>We use the information you provide to respond to enquiries, process vehicle submissions, share relevant listings, and improve our services. We do not sell your personal information to third parties.</p>
            </Section>
            <Section title="Cookies">
              <p>Our website may use cookies and similar technologies to understand how visitors use our site and to improve browsing experience. You can disable cookies through your browser settings at any time.</p>
            </Section>
            <Section title="Third-Party Sharing">
              <p>We may share limited information with trusted service providers (such as messaging platforms like WhatsApp) solely to facilitate communication you have initiated with us. We do not share your data with advertisers or unrelated third parties.</p>
            </Section>
            <Section title="Data Security">
              <p>We take reasonable measures to protect the information you share with us. However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.</p>
            </Section>
            <Section title="Your Rights">
              <p>You may request access to, correction of, or deletion of your personal data held by us at any time by contacting us using the details below.</p>
            </Section>
            <Section title="Contact Us">
              <p>For any privacy-related questions, reach out to us at Info@automotivehub.com or {PHONE.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3')}.</p>
            </Section>
          </RevealOnScroll>
        ) : (
          <RevealOnScroll>
            <Section title="Acceptance of Terms">
              <p>By accessing or using the Automotive Hub website, you agree to be bound by these Terms &amp; Conditions. If you do not agree with any part of these terms, please discontinue use of the site.</p>
            </Section>
            <Section title="Use of the Website">
              <p>This website is provided for the purpose of browsing vehicle listings, submitting enquiries, and requesting to sell a vehicle through Automotive Hub. You agree not to misuse the site, attempt unauthorized access, or submit false information.</p>
            </Section>
            <Section title="Vehicle Listings & Accuracy">
              <p>While we make every effort to ensure vehicle listings are accurate and up to date, specifications, pricing, and availability are subject to change without prior notice. We recommend confirming all details directly with our team before making a purchasing decision.</p>
            </Section>
            <Section title="Sell Your Car Submissions">
              <p>Information and photos submitted through our Sell Your Car form are used solely to evaluate and list your vehicle. Submitting a vehicle does not guarantee acceptance, listing, or a specific offer price.</p>
            </Section>
            <Section title="Pricing">
              <p>All prices displayed are in Egyptian Pounds (EGP) unless otherwise stated, and are subject to change. Final pricing is confirmed directly with our sales team.</p>
            </Section>
            <Section title="Intellectual Property">
              <p>All content on this website, including images, logos, and text, is the property of Automotive Hub and may not be reproduced or used without written permission.</p>
            </Section>
            <Section title="Limitation of Liability">
              <p>Automotive Hub is not liable for any indirect or consequential loss arising from the use of this website or reliance on the information provided herein.</p>
            </Section>
            <Section title="Governing Law">
              <p>These Terms &amp; Conditions are governed by the laws of the Arab Republic of Egypt.</p>
            </Section>
          </RevealOnScroll>
        )}
      </section>

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

      <Footer />
    </main>
  )
}