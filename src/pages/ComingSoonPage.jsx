import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const page = {
  label: 'Sofia Nexus Lead Services',
  description:
    'We’re creating a dedicated lead-generation service for organisations that want Sofia Nexus to create and qualify AI opportunity leads on their behalf.',
}

export default function ComingSoonPage() {

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="home" />

      <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-10 text-center md:px-6">
        <div className="rounded-3xl border border-[#FF6B2C] bg-white p-10 shadow-xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#FF6B2C]">Coming Soon</p>
          <h1 className="mb-4 text-3xl font-bold text-[#0B1F3A] sm:text-4xl">{page.label}</h1>
          <p className="mb-6 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
            {page.description}
            <br />
            Stay tuned — this feature is coming soon.
          </p>
          <a
            href="#/"
            className="inline-flex rounded-full border border-[#0B1F3A] bg-[#0B1F3A] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#FF6B2C] hover:text-white"
          >
            Back to Home
          </a>
        </div>
      </main>

      <Footer />
    </div>
  )
}
