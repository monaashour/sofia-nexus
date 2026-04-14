import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Footer from '../components/Footer'
import { Building2, Handshake } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="home" />
      <Hero />

      <main className="mx-auto flex w-full max-w-7xl flex-1 overflow-visible px-4 py-3 md:overflow-hidden md:px-6 md:py-2">
        <section className="grid w-full gap-4 md:grid-cols-[0.85fr_1.15fr]">
          <div className="flex items-center">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B2C]">AI Strategy Partner</p>
              <h2 className="mb-2 text-xl font-semibold text-[#0B1F3A] sm:text-2xl md:text-3xl">
                Welcome to <span className="text-[#FF6B2C]">Sofia Nexus</span>
              </h2>
              <div className="mb-3 h-1 w-14 rounded-full bg-[#FF6B2C]" />
              <p className="mb-4 text-sm leading-6 text-slate-700 sm:text-base md:text-lg">
                Your gateway to intelligent AI adoption.
                <br />
                We help you identify the right solutions,
                <br />
                connect with trusted partners
                <br />
                and ensure successful delivery.
              </p>

              <div className="flex flex-wrap gap-2 pt-1 sm:gap-3">
                <button
                  type="button"
                  onClick={() => { window.location.hash = '/solutions' }}
                  className="rounded-lg bg-[#FF6B2C] px-5 py-2 font-medium text-white transition hover:bg-[#E65A20] sm:px-6"
                >
                  Explore Solutions
                </button>
                <button
                  type="button"
                  onClick={() => { window.location.hash = '/about' }}
                  className="rounded-lg border border-[#0B1F3A] px-5 py-2 font-medium text-[#0B1F3A] transition hover:border-[#FF6B2C] hover:text-[#FF6B2C] sm:px-6"
                >
                  About Us
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 md:justify-self-end">

            {/* Sign In — dark card */}
            <div className="w-full rounded-2xl bg-[#0B1F3A] p-4 shadow-lg md:w-[92%] md:justify-self-start">
              <h3 className="mb-3 text-xl font-semibold text-white">Sign In</h3>
              <div className="space-y-2">
                <input
                  className="w-full rounded-lg border border-slate-600 bg-[#060F1F] px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
                  placeholder="Email"
                />
                <input
                  type="password"
                  className="w-full rounded-lg border border-slate-600 bg-[#060F1F] px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
                  placeholder="Password"
                />
                <div className="flex items-center justify-between pt-1">
                  <a href="#" className="text-xs text-slate-400 underline hover:text-[#FF6B2C]">
                    Forgot password?
                  </a>
                  <button className="rounded-lg bg-[#FF6B2C] px-5 py-1.5 text-sm font-medium text-white transition hover:bg-[#E65A20]">
                    Sign In
                  </button>
                </div>
              </div>
            </div>

            {/* Get Started — accented card */}
            <div className="rounded-2xl border-2 border-[#FF6B2C] bg-white p-4 shadow-lg">
              <h3 className="mb-1 text-xl font-semibold text-[#0B1F3A]">Get Started</h3>
              <p className="mb-3 text-xs text-slate-500">Choose your profile to begin</p>
              <div className="space-y-3">
                <button className="w-full rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-left font-medium text-white transition hover:bg-[#FF6B2C]">
                  <span className="flex items-center gap-2 text-sm"><Building2 className="h-4 w-4" />Enterprise Customer</span>
                  <span className="block text-xs font-normal text-slate-300">Modernise &amp; scale with AI</span>
                </button>
                <button className="w-full rounded-lg bg-[#0B1F3A] px-4 py-2.5 text-left font-medium text-white transition hover:bg-[#FF6B2C]">
                  <span className="flex items-center gap-2 text-sm"><Handshake className="h-4 w-4" />AI Partner</span>
                  <span className="block text-xs font-normal text-slate-300">Join our trusted network</span>
                </button>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}