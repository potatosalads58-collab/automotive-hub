'use client'

const PHONE = '01010166333'
const EMAIL = 'Info@automotivehub.com'
const INSTAGRAM_URL = 'https://instagram.com/automotivehubegy'
const THREADS_URL = 'https://www.threads.net/@automotivehubegy'
const FACEBOOK_URL = 'https://www.facebook.com/share/14nBzBzMDiU/'

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function ThreadsIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3c-4.5 0-7 2.8-7 7.5v3C5 17.9 7.8 21 12 21s7-3.1 7-7.5c0-2.3-1-3.8-2.8-3.8-1.6 0-2.7 1-2.9 2.5" />
      <path d="M9.5 12.5c0-1.8 1.3-2.8 2.9-2.8 1.9 0 3.1 1.3 3.1 3.3 0 2.2-1.4 3.5-3.4 3.5" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M15 8h-2a2 2 0 0 0-2 2v10M9 13h6" />
      <circle cx="12" cy="12" r="9" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="bg-black text-white">

      {/* ================= MAIN FOOTER CONTENT ================= */}
      <div className="px-6 pt-16 pb-12 border-t border-zinc-900">

        {/* Brand statement */}
        <p className="font-display text-2xl font-light text-white leading-snug mb-12 max-w-sm">
          Egypt&apos;s trusted destination for exceptional automobiles.
        </p>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-8 pb-12 border-b border-zinc-900">

          <div>
            <p className="text-[11px] tracking-[0.3em] text-zinc-500 mb-5">
              EXPLORE
            </p>

            <div className="flex flex-col gap-3.5">
              <a
                href="/inventory"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Inventory
              </a>

              <a
                href="/sell-your-car"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Sell Your Car
              </a>

              <a
                href="/news"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                News
              </a>
            </div>
          </div>

          <div>
            <p className="text-[11px] tracking-[0.3em] text-zinc-500 mb-5">
              AUTOMOTIVE HUB
            </p>

            <div className="flex flex-col gap-3.5">
              <a
                href="/about"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                About Us
              </a>

              <a
                href="/contact"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Contact
              </a>

              <a
                href="/privacy"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
              >
                Privacy &amp; Terms
              </a>
            </div>
          </div>

        </div>

        {/* Socials */}
        <div className="flex items-center justify-between py-8 border-b border-zinc-900">

          <p className="text-[11px] tracking-[0.3em] text-zinc-500">
            FOLLOW US
          </p>

          <div className="flex items-center gap-5 text-zinc-400">

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white transition-colors"
            >
              <InstagramIcon />
            </a>

            <a
              href={THREADS_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Threads"
              className="hover:text-white transition-colors"
            >
              <ThreadsIcon />
            </a>

            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white transition-colors"
            >
              <FacebookIcon />
            </a>

          </div>
        </div>

        {/* Contact information */}
        <div className="pt-8 flex flex-col gap-3.5">

          {/* Phone */}
          <a
            href={`tel:${PHONE}`}
            className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>

            0101 016 6333
          </a>

          {/* Email */}
          <a
            href={`mailto:${EMAIL}`}
            className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 6-10 7L2 6" />
            </svg>

            {EMAIL}
          </a>

          {/* Location → Contact Location section */}
          <a
            href="/contact#location"
            className="flex items-center gap-3 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
            >
              <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>

            6th of October, Cairo, Egypt
          </a>

        </div>
      </div>


      {/* ================= COPYRIGHT ================= */}
      <div className="border-t border-zinc-900 py-8 text-center">

        {/* Looks exactly like normal text, but clicking goes home */}
        <a
          href="/"
          aria-label="Automotive Hub Home"
          className="text-zinc-600 text-xs tracking-[0.2em] hover:text-zinc-400 transition-colors"
        >
          © 2026 AUTOMOTIVE HUB
        </a>

      </div>


      {/* ================= CINEMATIC CLOSING IMAGE ================= */}
      <div className="relative w-full h-48 sm:h-64 overflow-hidden">

        <img
          src="/lamborghini-sill.jpg"
          alt="Lamborghini interior detail"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Soft transition into the image */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black to-transparent" />

        {/* Fade back into black */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black to-transparent" />

      </div>


      {/* ================= FINAL BRAND MARK ================= */}
      <div className="bg-black flex items-center justify-center py-10">

        <a
          href="/"
          aria-label="Automotive Hub Home"
          className="inline-flex"
        >
          <img
            src="/logo-full.png"
            alt="Automotive Hub"
            className="h-10 w-auto opacity-60 hover:opacity-85 transition-opacity"
          />
        </a>

      </div>

    </footer>
  )
}
