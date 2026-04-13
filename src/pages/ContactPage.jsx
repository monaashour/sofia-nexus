import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import headerImg from '../assets/header.png'
import brainImg from '../assets/brain.png'
import { Handshake, Mail, Settings2, Send } from 'lucide-react'

const cards = [
  {
    icon: Handshake,
    title: 'Welcome',
    subtitle: 'Your AI journey starts here',
    body: (
      <p className="text-sm leading-relaxed text-slate-300">
        Whether you are modernizing platforms, evaluating AI solutions, or strengthening
        governance and compliance, Sofia Nexus is here to support your journey.
      </p>
    ),
  },
  {
    icon: Mail,
    title: 'Contact Information',
    subtitle: 'Reach us directly',
    body: (
      <div className="space-y-1 text-sm text-slate-300">
        <p>Phone: +44 7836 354234</p>
        <p>Email: info@sofianexus.com</p>
        <p className="mt-2 font-medium text-white">Registered Address</p>
        <p>Hill House, Setchey</p>
        <p>Kings Lynn, Norfolk</p>
        <p>PE33 0BD</p>
      </div>
    ),
  },
  {
    icon: Settings2,
    title: 'How We Work',
    subtitle: 'Clear process, real results',
    body: (
      <p className="text-sm leading-relaxed text-slate-300">
        We start with a discovery conversation to understand your challenges and goals.
        From there, we define a clear roadmap and work collaboratively to deliver
        structured, impactful solutions.
      </p>
    ),
  },
  {
    icon: Send,
    title: 'Request a Consultation',
    subtitle: 'Let\'s define your next steps',
    body: (
      <p className="text-sm leading-relaxed text-slate-300">
        Book a session with our experts to explore how Sofia Nexus can support your
        business.{' '}
        <a href="mailto:info@sofianexus.com" className="text-[#FF6B2C] underline">Email us to get started.</a>
      </p>
    ),
  },
]

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="contact" />

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
              Let's Start <br />The Conversation
            </h1>
            <p className="mt-1 text-xs text-slate-300 sm:text-sm md:text-base">
              Let's explore how we can bring clarity and structure to your business.
            </p>
          </div>
          <img src={brainImg} alt="AI brain" className="mt-1 w-[90px] object-contain sm:w-[130px] md:w-[190px]" />
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-visible px-4 py-3 md:overflow-hidden md:px-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B2C]">Get In Touch</p>
            <h2 className="mt-1 text-lg font-semibold text-[#0B1F3A]">Let’s Work Together</h2>
            <div className="mt-2 h-1 w-14 rounded-full bg-[#FF6B2C]" />
          </div>
          <a href="mailto:info@sofianexus.com" className="text-sm font-medium text-[#FF6B2C] underline">
            Book a Consultation
          </a>
        </div>

        {/* Flip Cards */}
        <div className="grid grid-cols-1 gap-4 md:flex-1 md:grid-cols-4">
          {cards.map((card) => (
            <div
              key={card.title}
              className="min-h-[280px]"
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

