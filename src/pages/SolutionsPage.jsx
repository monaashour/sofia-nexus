import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import headerImg from '../assets/header.png'
import brainImg from '../assets/brain.png'
import { Sparkles, Link2, Settings2, Target } from 'lucide-react'

const offers = [
  {
    icon: Sparkles,
    title: 'AI Use Case Design & Validation',
    subtitle: 'Identify where AI creates real value',
    body: 'We identify and validate high-impact AI opportunities tailored to your business goals and readiness.',
  },
  {
    icon: Link2,
    title: 'AI Vendor Matching',
    subtitle: 'Find the right partner — not only the right solution',
    body: 'We connect you with AI vendors that fit your needs, budget, and strategy.',
  },
  {
    icon: Settings2,
    title: 'AI Delivery Oversight',
    subtitle: 'Ensure successful delivery from start to finish',
    body: 'We oversee the delivery ensuring projects stay on time, on budget, and aligned with your business objectives.',
  },
  {
    icon: Target,
    title: 'AI-Powered Lead Generation',
    subtitle: 'Drive growth with precision',
    body: 'We help you identify and engage high-value prospects using data-driven insights.',
  },
]

export default function SolutionsPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="solutions" />

      {/* Hero */}
      <section
        className="relative overflow-hidden text-white"
        style={{
          backgroundImage: `url(${headerImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="mx-auto flex min-h-[95px] max-w-7xl items-start justify-between px-4 pt-2 pb-2 sm:px-6 md:min-h-[125px] md:pt-3 md:pb-2">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold leading-snug sm:text-3xl md:text-4xl">
              Solutions Designed<br />For Real Impact
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm md:text-base">
              Four core offers to turn AI potential into business results.
            </p>
          </div>
          <img src={brainImg} alt="AI brain" className="mt-1 w-[90px] object-contain sm:w-[130px] md:w-[190px]" />
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-visible px-4 py-3 md:overflow-hidden md:px-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B2C]">What We Deliver</p>
            <h2 className="mt-1 text-lg font-semibold text-[#0B1F3A]">Our 4 Core Offers</h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-[#FF6B2C]" />
          </div>
          <a href="mailto:info@sofianexus.com" className="text-sm font-medium text-[#FF6B2C] underline">
            Book a Consultation
          </a>
        </div>

        {/* Flip Cards */}
        <div className="grid grid-cols-1 gap-4 md:flex-1 md:grid-cols-4">
          {offers.map((offer) => (
            <div
              key={offer.title}
              className="group min-h-[260px]"
              style={{ perspective: '1000px' }}
            >
              <div
                className="relative h-full w-full transition-transform duration-700"
                style={{ transformStyle: 'preserve-3d' }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'rotateY(180deg)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'rotateY(0deg)')}
              >
                {/* Front */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-white px-5 text-center shadow-md"
                  style={{ backfaceVisibility: 'hidden' }}
                >
                  <offer.icon className="mb-4 h-12 w-12 text-[#2E2A27]" strokeWidth={1.9} />
                  <h3 className="text-base font-semibold text-[#0B1F3A]">{offer.title}</h3>
                  <p className="mt-2 text-xs font-medium text-[#FF6B2C]">{offer.subtitle}</p>
                  <p className="mt-4 text-xs text-slate-400">Hover to learn more</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#0B1F3A] px-5 text-center shadow-md"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <offer.icon className="mb-3 h-9 w-9 text-[#FF6B2C]" strokeWidth={1.9} />
                  <h3 className="text-sm font-semibold text-white">{offer.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-300">{offer.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  )
}
