import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
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

      {/* Main Content - Privacy Policy & Terms */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="space-y-4 mb-16">
          <p className="text-xs uppercase tracking-widest text-zinc-500">Legal & Compliance</p>
          <h1 className="text-4xl md:text-5xl font-light tracking-tight text-white">Privacy Policy & Terms</h1>
          <p className="text-sm text-zinc-400">Last Updated: September 2026</p>
        </div>

        <div className="space-y-16 text-zinc-300 leading-relaxed font-light">
          {/* Privacy Policy Section */}
          <section className="space-y-6">
            <h2 className="text-2xl font-normal text-white border-b border-zinc-800 pb-4">1. Privacy Policy</h2>
            
            <div className="space-y-4 text-sm md:text-base text-zinc-400">
              <p>
                At <strong className="text-zinc-200">Automotive Hub</strong>, accessible from our website, the privacy of our visitors is of extreme importance to us. This Privacy Policy document outlines the types of information that is collected and recorded by Automotive Hub and how we use it.
              </p>

              <h3 className="text-lg font-medium text-white pt-4">Information We Collect</h3>
              <p>
                We only collect information that you voluntarily provide to us when you submit an inquiry about a vehicle, use our &quot;Sell Your Car&quot; service, or contact us directly via phone, email, or digital channels. This may include your name, phone number, email address, and vehicle details.
              </p>

              <h3 className="text-lg font-medium text-white pt-4">How We Use Your Information</h3>
              <p>
                We use the information we collect to respond to your inquiries, facilitate vehicle purchase or trade-in requests, and improve our digital services and website user experience.
              </p>

              <h3 className="text-lg font-medium text-white pt-4">Data Security & Confidentiality</h3>
              <p>
                We value your trust in providing us your personal information. We implement strict administrative and technical measures to protect your data. <strong className="text-zinc-200">We do not sell, trade, or rent your personal information to third parties.</strong>
              </p>
            </div>
          </section>

          {/* Terms & Conditions Section */}
          <section className="space-y-6 pt-8">
            <h2 className="text-2xl font-normal text-white border-b border-zinc-800 pb-4">2. Terms & Conditions</h2>
            
            <div className="space-y-6 text-sm md:text-base text-zinc-400">
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Intellectual Property</h3>
                <p>
                  All content, design elements, graphics, logos, images, typography, and software code displayed on this website are the exclusive property of <strong className="text-zinc-200">Automotive Hub</strong> and are protected by copyright laws. Unauthorized use or redistribution is strictly prohibited.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Vehicle Availability & Specifications</h3>
                <p>
                  Vehicle listings, specifications, mileages, model years, and availability shown on the website are subject to change without prior notice due to the high-end and fast-moving nature of our inventory. We advise confirming availability directly with our showroom team.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium text-white">Limitation of Liability</h3>
                <p>
                  Automotive Hub acts as a premier showcase for luxury and exotic automobiles. Final transactions, inspections, and legal agreements are officially processed and concluded on-site at our physical showroom location.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER - updated */}
      <footer className="bg-zinc-950 border-t border-zinc-800 px-6 py-14">
        <p className="text-zinc-400 text-sm leading-relaxed mb-10 max-w-xs">
          Egypt&apos;s trusted ultimate exotics marketplace. Quality vehicles, transparent pricing, exceptional service.
        </p>
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">SHOWROOM</p>
            <a href="/inventory" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Inventory</a>
            <a href="/sell-your-car" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Sell Your Car</a>
            <a href="/news" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">News</a>
          </div>
          <div>
            <p className="text-xs tracking-widest text-white font-semibold mb-4">ABOUT US</p>
            <a href="/about" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">About Us</a>
            <a href="/contact" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Contact</a>
            <a href="/privacy-policy" className="block text-sm text-zinc-400 hover:text-white mb-2.5 transition-colors">Privacy Policy &amp; Terms</a>
          </div>
        </div>
        <div className="mb-10">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">FOLLOW US</p>
          <div className="flex gap-4">
            <a href="https://instagram.com/automotivehubegy" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Instagram</a>
            <a href="https://www.threads.net/@automotivehubegy" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Threads</a>
            <a href="https://www.facebook.com/share/14nBzBzMDiU/" target="_blank" className="text-sm text-zinc-400 hover:text-white transition-colors">Facebook</a>
          </div>
        </div>
        <div className="border-t border-zinc-800 pt-8 mb-8">
          <p className="text-xs tracking-widest text-white font-semibold mb-4">CONTACT</p>
          <div className="flex flex-col gap-3">
            <a href={`tel:${PHONE}`} className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              0101 016 6333
            </a>
            <a href="mailto:Info@automotivehub.com" className="flex items-center gap-3 text-sm text-zinc-400 hover:text-white transition-colors">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 6-10 7L2 6"/></svg>
              Info@automotivehub.com
            </a>
            <p className="flex items-center gap-3 text-sm text-zinc-400">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              6th of October, Cairo, Egypt
            </p>
          </div>
        </div>
        <div className="border-t border-zinc-900 pt-10 text-center flex flex-col items-center gap-6">
          <p className="text-zinc-600 text-xs">© 2026 Automotive Hub. All rights reserved.</p>
          <img src="/logo-full.png" alt="Automotive Hub" className="h-10 w-auto opacity-80" />
        </div>
      </footer>
  )
}
