import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import headerImg from '../assets/header.png'
import brainImg from '../assets/brain.png'
import { Sparkles, Lightbulb, Compass, Flag } from 'lucide-react'

const cards = [
  {
    icon: Sparkles,
    title: 'Sofia Nexus In a Nutshell',
    subtitle: 'Who we are',
    body: (
      <>
        <p className="text-sm leading-relaxed text-slate-300">
          <strong className="text-white">Sofia Nexus</strong> is a UK-based consultancy helping organisations transform
          complex systems into scalable, AI-driven solutions.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">
          We bring <strong className="text-white">clarity</strong> across architecture, governance, and strategy to
          deliver measurable business impact.
        </p>
      </>
    ),
  },
  {
    icon: Lightbulb,
    title: 'Our Philosophy',
    subtitle: 'Three principles guide us',
    body: (
      <>
        <p className="text-sm text-slate-300">Three principles guide us</p>
        <ul className="mt-3 space-y-1 text-left text-sm text-slate-300">
          <li><strong className="text-white">Clarity</strong>: Transparent and aligned</li>
          <li><strong className="text-white">Scalability</strong>: Built to grow</li>
          <li><strong className="text-white">Integrity</strong>: Unified architecture, governance &amp; strategy</li>
        </ul>
      </>
    ),
  },
  {
    icon: Compass,
    title: 'Our Vision',
    subtitle: 'Where we are heading',
    body: (
      <p className="text-sm leading-relaxed text-slate-300">
        Empower organisations with an intelligent, scalable system that drives sustainable growth
        and confident decision-making.
      </p>
    ),
  },
  {
    icon: Flag,
    title: 'Our Mission',
    subtitle: 'Why we exist',
    body: (
      <p className="text-sm leading-relaxed text-slate-300">
        Our mission is to design and deliver high-integrity, future-ready systems by combining
        technology, governance, and strategy into one coherent approach.
      </p>
    ),
  },
]

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="about" />

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
              Sofia Nexus From<br />
              Complexity To Clarity
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm md:text-base">
              We design, deliver, and scale AI-driven systems with clarity and confidence.
            </p>
          </div>
          <img src={brainImg} alt="AI brain" className="mt-1 w-[90px] object-contain sm:w-[130px] md:w-[190px]" />
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-visible px-4 py-3 md:overflow-hidden md:px-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B2C]">Our Identity</p>
            <h2 className="mt-1 text-lg font-semibold text-[#0B1F3A]">Who We Are</h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-[#FF6B2C]" />
          </div>
          <a href="#/solutions" className="text-sm font-medium text-[#FF6B2C] underline">
            Explore our solutions
          </a>
        </div>

        {/* Flip Cards */}
        <div className="grid grid-cols-1 gap-4 md:flex-1 md:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="min-h-[260px]"
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
                  <card.icon className="mb-4 h-12 w-12 text-[#2E2A27]" strokeWidth={1.9} />
                  <h3 className="text-base font-semibold text-[#0B1F3A]">{card.title}</h3>
                  <p className="mt-2 text-xs font-medium text-[#FF6B2C]">{card.subtitle}</p>
                  <p className="mt-4 text-xs text-slate-400">Hover to learn more</p>
                </div>

                {/* Back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center overflow-auto rounded-2xl bg-[#0B1F3A] px-5 text-center shadow-md"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <card.icon className="mb-3 h-9 w-9 text-[#FF6B2C]" strokeWidth={1.9} />
                  {card.body}
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

