'use client'
import { useEffect, useState, useRef } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const CAR_MAKES = [
  'Alfa Romeo', 'Aston Martin', 'Audi', 'Bentley', 'BMW', 'Bugatti', 'Cadillac',
  'Chevrolet', 'Chrysler', 'Citroën', 'Dodge', 'Ferrari', 'Fiat', 'Ford',
  'Genesis', 'GMC', 'Honda', 'Hyundai', 'Infiniti', 'Jaguar', 'Jeep', 'Kia',
  'Koenigsegg', 'Lamborghini', 'Land Rover', 'Lexus', 'Lincoln', 'Lotus',
  'Maserati', 'Mazda', 'McLaren', 'Mercedes-Benz', 'MG', 'Mini', 'Mitsubishi',
  'Nissan', 'Opel', 'Pagani', 'Peugeot', 'Porsche', 'Renault', 'Rolls-Royce',
  'Saab', 'Seat', 'Škoda', 'Subaru', 'Suzuki', 'Tesla', 'Toyota',
  'Volkswagen', 'Volvo', 'Other',
]

const PHONE = '01010166333'
const WA_NUMBER = '20' + PHONE.slice(1)

function AnimatedTitle({ text }: { text: string }) {
  return (
    <h1 className="font-display text-4xl md:text-6xl font-light tracking-wider text-white flex flex-wrap justify-center">
      {text.split('').map((char, i) => (
        <span key={i} className="inline-block" style={{
          opacity: 0,
          animation: 'letterIn 0.7s ease forwards',
          animationDelay: `${i * 30}ms`,
        }}>
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

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 9l6 6 6-6" />
    </svg>
  )
}
function CameraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}
function CarIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M5 17h14v-5l-2-5H7L5 12v5z" />
      <circle cx="7.5" cy="17.5" r="1.5" />
      <circle cx="16.5" cy="17.5" r="1.5" />
    </svg>
  )
}

type UploadedFile = { file: File; url: string }

function FileDrop({ label, note, files, onAdd, onRemove, multiple = true }: {
  label: string
  note?: string
  files: UploadedFile[]
  onAdd: (files: FileList) => void
  onRemove: (index: number) => void
  multiple?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[10px] tracking-[0.3em] text-zinc-500">{label}</label>
        {files.length > 0 && (
          <span className="text-[10px] tracking-widest text-white flex items-center gap-1">
            <CheckIcon /> {files.length} ADDED
          </span>
        )}
      </div>
      {note && <p className="text-zinc-600 text-xs mb-3">{note}</p>}

      <div className="grid grid-cols-3 gap-2 mb-2">
        {files.map((f, i) => (
          <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-zinc-800">
            <img src={f.url} alt="" className="w-full h-full object-cover" />
            <button type="button" onClick={() => onRemove(i)}
              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-xs flex items-center justify-center">
              ✕
            </button>
          </div>
        ))}
        <button type="button" onClick={() => inputRef.current?.click()}
          className="aspect-square rounded-lg border border-dashed border-zinc-700 flex flex-col items-center justify-center gap-1.5 text-zinc-500 hover:border-white hover:text-white transition-colors">
          <CameraIcon />
          <span className="text-[9px] tracking-widest">ADD</span>
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple={multiple} className="hidden"
        onChange={e => { if (e.target.files) onAdd(e.target.files); e.target.value = '' }} />
    </div>
  )
}

export default function SellYourCarPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  const [details, setDetails] = useState({
    make: '', model: '', year: '', odometer: '', vin: '', engine: '',
    transmission: '', price: '', description: '',
  })

  const [exterior, setExterior] = useState<UploadedFile[]>([])
  const [interior, setInterior] = useState<UploadedFile[]>([])
  const [licenseFront, setLicenseFront] = useState<UploadedFile[]>([])
  const [licenseBack, setLicenseBack] = useState<UploadedFile[]>([])

  const [contact, setContact] = useState({ name: '', email: '', phone: '' })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const addFiles = (setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({ file, url: URL.createObjectURL(file) }))
    setter(prev => [...prev, ...newFiles])
  }
  const removeFile = (setter: React.Dispatch<React.SetStateAction<UploadedFile[]>>) => (index: number) => {
    setter(prev => prev.filter((_, i) => i !== index))
  }

  const step1Valid = details.make && details.model && details.year && details.odometer &&
    details.vin && details.engine && details.transmission && details.price

  const step2Valid = exterior.length >= 2 && interior.length >= 1 && licenseFront.length >= 1 && licenseBack.length >= 1

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = encodeURIComponent(
      `New Sell Your Car submission:\n\n` +
      `${details.make} ${details.model} (${details.year})\n` +
      `Odometer: ${details.odometer} km\nVIN: ${details.vin}\nEngine: ${details.engine}\n` +
      `Transmission: ${details.transmission}\nAsking Price: EGP ${details.price}\n\n` +
      `${details.description}\n\n` +
      `Photos: ${exterior.length} exterior, ${interior.length} interior, 2 license\n\n` +
      `Contact: ${contact.name} · ${contact.phone} · ${contact.email}`
    )
    window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, '_blank')
    setSubmitted(true)
  }

  const steps = ['Details', 'Photos', 'Contact']

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
        @keyframes stepIn {
          from { opacity: 0; transform: translateX(16px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeUp { animation: fadeUp 1s ease forwards; }
        .step-panel { animation: stepIn 0.45s ease forwards; }
        .form-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%), #0a0a0a;
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
        }
        .field-input { transition: border-color 0.25s ease, background 0.25s ease; }
        .field-input:focus { background: rgba(255,255,255,0.02); }
        .btn-primary { transition: all 0.3s ease; }
        .btn-primary:hover { background: #e5e5e5; }
        .btn-primary:disabled { opacity: 0.35; pointer-events: none; }
      `}</style>

      <Navbar />

      {/* HERO - 1:1, Spirit of Ecstasy centered on black */}
      <section className="relative w-full aspect-square overflow-hidden bg-black">
        <img
          src="/sell-hero.jpg"
          alt="Automotive Hub"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, transparent 45%, rgba(0,0,0,0.92) 88%, rgba(0,0,0,1) 100%)' }} />
        <div className="absolute inset-x-0 bottom-0 pb-10 px-6 text-center">
          <p className="text-xs tracking-[0.4em] text-zinc-400 mb-4 animate-fadeUp">A SEAT AMONG THE FEW</p>
          <AnimatedTitle text="SELL YOUR CAR" />
        </div>
      </section>

      {/* STEPPER */}
      <section className="px-6 pt-10 pb-2">
        <div className="flex items-center justify-center max-w-md mx-auto">
          {steps.map((label, i) => {
            const n = i + 1
            const active = step === n
            const done = step > n
            return (
              <div key={label} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs border transition-all duration-300 ${
                    done ? 'bg-white text-black border-white' : active ? 'border-white text-white' : 'border-zinc-700 text-zinc-600'
                  }`}>
                    {done ? <CheckIcon /> : n}
                  </div>
                  <span className={`text-[9px] tracking-widest transition-colors duration-300 ${active || done ? 'text-white' : 'text-zinc-600'}`}>
                    {label.toUpperCase()}
                  </span>
                </div>
                {n < steps.length && (
                  <div className={`h-px flex-1 mx-2 mb-4 transition-colors duration-500 ${step > n ? 'bg-white' : 'bg-zinc-800'}`} />
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* STEP 1 - DETAILS */}
      {step === 1 && (
        <section key="step1" className="step-panel px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white" />
            <p className="text-xs tracking-[0.4em] text-zinc-400">VEHICLE DETAILS</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (step1Valid) setStep(2) }}
            className="form-card rounded-2xl p-6 flex flex-col gap-5">

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">MAKE*</label>
              <div className="relative">
                <select required value={details.make} onChange={e => setDetails(d => ({ ...d, make: e.target.value }))}
                  className="field-input appearance-none w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 pr-8 focus:outline-none focus:border-white">
                  <option value="" disabled className="bg-black">Select make</option>
                  {CAR_MAKES.map(m => <option key={m} value={m} className="bg-black">{m}</option>)}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"><ChevronDown /></div>
              </div>
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">MODEL*</label>
              <input required value={details.model} onChange={e => setDetails(d => ({ ...d, model: e.target.value }))}
                className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="e.g. 911 Turbo S" />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">YEAR*</label>
                <input required type="number" value={details.year} onChange={e => setDetails(d => ({ ...d, year: e.target.value }))}
                  className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="2024" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">ODOMETER (KM)*</label>
                <input required type="number" value={details.odometer} onChange={e => setDetails(d => ({ ...d, odometer: e.target.value }))}
                  className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="4,500" />
              </div>
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">VIN NUMBER*</label>
              <input required value={details.vin} onChange={e => setDetails(d => ({ ...d, vin: e.target.value }))}
                className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="Vehicle Identification Number" />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">ENGINE*</label>
              <input required value={details.engine} onChange={e => setDetails(d => ({ ...d, engine: e.target.value }))}
                className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="e.g. 3.6L Twin-Turbo Flat 6" />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">TRANSMISSION*</label>
              <div className="relative">
                <select required value={details.transmission} onChange={e => setDetails(d => ({ ...d, transmission: e.target.value }))}
                  className="field-input appearance-none w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 pr-8 focus:outline-none focus:border-white">
                  <option value="" disabled className="bg-black">Select transmission</option>
                  <option value="Automatic" className="bg-black">Automatic</option>
                  <option value="Manual" className="bg-black">Manual</option>
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"><ChevronDown /></div>
              </div>
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">ASKING PRICE (EGP)*</label>
              <input required type="number" value={details.price} onChange={e => setDetails(d => ({ ...d, price: e.target.value }))}
                className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="e.g. 23,000,000" />
            </div>

            <div>
              <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">DESCRIPTION</label>
              <textarea value={details.description} onChange={e => setDetails(d => ({ ...d, description: e.target.value }))}
                rows={4} className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600 resize-none" placeholder="Service history, modifications, condition notes..." />
            </div>

            <button type="submit" disabled={!step1Valid}
              className="btn-primary bg-white text-black py-4 rounded-xl text-xs tracking-[0.3em] font-medium mt-2">
              CONTINUE TO PHOTOS →
            </button>
          </form>
        </section>
      )}

      {/* STEP 2 - PHOTOS */}
      {step === 2 && (
        <section key="step2" className="step-panel px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white" />
            <p className="text-xs tracking-[0.4em] text-zinc-400">VEHICLE PHOTOS</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if (step2Valid) setStep(3) }}
            className="form-card rounded-2xl p-6 flex flex-col gap-8">

            <FileDrop
              label="EXTERIOR PHOTOS*"
              note="Include front, rear, and both sides for the best listing. Minimum 2 photos."
              files={exterior}
              onAdd={addFiles(setExterior)}
              onRemove={removeFile(setExterior)}
            />
            <div className="h-px bg-white/10" />
            <FileDrop
              label="INTERIOR PHOTOS*"
              note="Dashboard, seats, and cabin details."
              files={interior}
              onAdd={addFiles(setInterior)}
              onRemove={removeFile(setInterior)}
            />
            <div className="h-px bg-white/10" />
            <FileDrop
              label="LICENSE — FRONT*"
              files={licenseFront}
              onAdd={addFiles(setLicenseFront)}
              onRemove={removeFile(setLicenseFront)}
              multiple={false}
            />
            <FileDrop
              label="LICENSE — BACK*"
              files={licenseBack}
              onAdd={addFiles(setLicenseBack)}
              onRemove={removeFile(setLicenseBack)}
              multiple={false}
            />

            <div className="flex gap-3 mt-2">
              <button type="button" onClick={() => setStep(1)}
                className="flex-1 border border-zinc-700 text-white py-4 rounded-xl text-xs tracking-[0.3em]">
                ← BACK
              </button>
              <button type="submit" disabled={!step2Valid}
                className="btn-primary flex-1 bg-white text-black py-4 rounded-xl text-xs tracking-[0.3em] font-medium">
                CONTINUE →
              </button>
            </div>
          </form>
        </section>
      )}

      {/* STEP 3 - CONTACT */}
      {step === 3 && (
        <section key="step3" className="step-panel px-6 py-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-px bg-white" />
            <p className="text-xs tracking-[0.4em] text-zinc-400">YOUR CONTACT INFO</p>
          </div>

          {submitted ? (
            <div className="form-card rounded-2xl p-8 text-center flex flex-col items-center gap-4">
              <div className="w-14 h-14 rounded-full border border-white flex items-center justify-center text-white">
                <CheckIcon />
              </div>
              <p className="font-display text-2xl font-light text-white">Submission received</p>
              <p className="text-zinc-500 text-sm">Our team will review your car and get back to you shortly.</p>
              <a href="/" className="text-xs tracking-widest text-white border-b border-white/40 pb-0.5 mt-2">
                BACK TO HOME
              </a>
            </div>
          ) : (
            <form onSubmit={handleFinalSubmit} className="form-card rounded-2xl p-6 flex flex-col gap-5">
              <div className="flex items-center gap-4 pb-5 border-b border-white/10">
                <div className="w-11 h-11 rounded-full border border-zinc-700 flex items-center justify-center text-white flex-shrink-0">
                  <CarIcon />
                </div>
                <div>
                  <p className="text-zinc-500 text-[10px] tracking-widest">{details.make?.toUpperCase() || 'YOUR CAR'}</p>
                  <p className="text-white text-base">{details.model || '—'} {details.year && `(${details.year})`}</p>
                </div>
              </div>

              <div>
                <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">FULL NAME*</label>
                <input required value={contact.name} onChange={e => setContact(c => ({ ...c, name: e.target.value }))}
                  className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="Your name" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">EMAIL*</label>
                <input required type="email" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))}
                  className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="you@email.com" />
              </div>
              <div>
                <label className="text-[10px] tracking-[0.3em] text-zinc-500 mb-2 block">PHONE NUMBER*</label>
                <input required value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))}
                  className="field-input w-full bg-transparent border-b border-zinc-700 text-white text-sm py-2.5 focus:outline-none focus:border-white placeholder:text-zinc-600" placeholder="+20 100 123 4567" />
              </div>

              <div className="flex gap-3 mt-2">
                <button type="button" onClick={() => setStep(2)}
                  className="flex-1 border border-zinc-700 text-white py-4 rounded-xl text-xs tracking-[0.3em]">
                  ← BACK
                </button>
                <button type="submit"
                  className="btn-primary flex-1 bg-white text-black py-4 rounded-xl text-xs tracking-[0.3em] font-medium">
                  SUBMIT →
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      {/* SEE YOUR NEXT CAR */}
      <RevealOnScroll>
        <section className="px-6 py-14 border-t border-zinc-900 mt-4">
          <a href="/inventory" className="relative block w-full overflow-hidden rounded-2xl h-56 group">
            <img src="/next-car.jpg" alt="Browse Inventory" className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-xs tracking-[0.4em] text-zinc-300 mb-3">WHILE YOU WAIT</p>
              <p className="font-display text-2xl font-light text-white mb-4">See Your Next Car</p>
              <span className="text-xs tracking-[0.3em] text-white border-b border-white/50 pb-1">BROWSE INVENTORY →</span>
            </div>
          </a>
        </section>
      </RevealOnScroll>

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