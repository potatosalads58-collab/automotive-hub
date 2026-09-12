Import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0a0a0a]/80 border-b border-zinc-800/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="text-xl font-medium tracking-wider uppercase text-white">
            Automotive <span className="text-zinc-400">Hub</span>
          </a>
          <nav className="hidden md:flex items-center space-x-8 text-sm text-zinc-400">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">About Us</a>
            <a href="#" className="hover:text-white transition-colors">Showroom</a>
            <a href="#" className="hover:text-white transition-colors">Sell Your Car</a>
            <a href="#" className="text-white font-medium">Privacy Policy</a>
          </nav>
          <div>
            <a
              href="#contact"
              className="px-5 py-2 text-xs uppercase tracking-widest border border-zinc-700 hover:border-zinc-400 transition-all text-zinc-200"
            >
              Contact
            </a>
          </div>
        </div>
      </header>

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

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 bg-[#070707] py-16 mt-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 text-sm text-zinc-400">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-medium text-white tracking-wider uppercase">Automotive Hub</h3>
            <p className="text-zinc-500 max-w-sm">
              The ultimate destination for luxury and exotic automobiles. Experience uncompromising performance and refined elegance.
            </p>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-medium">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Showroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sell Your Car</a></li>
            </ul>
          </div>
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-medium">Legal</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-white">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-12 mt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600">
          <p>&copy; 2026 Automotive Hub. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Showroom Management</p>
        </div>
      </footer>
    </div>
  );
}
