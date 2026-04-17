import { useMemo, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Users,
  Building2,
  Landmark,
  CircleCheck,
  Circle,
  Rocket,
  Handshake,
  GraduationCap,
  TrendingUp,
  CheckCircle2,
  UserCheck,
  Puzzle,
  Globe,
} from 'lucide-react'

const TOTAL_STEPS = 4
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const jobTitleOptions = [
  'CEO / Founder',
  'CTO / Technical Lead',
  'Sales Director',
  'Business Development Manager',
  'Solutions Architect',
  'Consultant',
  'Other',
]

const partnershipInterestOptions = [
  'Technology Integration',
  'Reseller / Distributor',
  'Implementation Partner',
  'Consulting Partner',
  'Co-Marketing',
]

const companySizeOptions = [
  { key: '1-10', label: '1 - 10', icon: Users },
  { key: '11-50', label: '11 - 50', icon: Building2 },
  { key: '51-200', label: '51 - 200', icon: Landmark },
  { key: '200+', label: '200+', icon: Landmark },
]

const yearsOptions = ['Less than 1 year', '1 - 3 years', '3 - 5 years', '5 - 10 years', '10+ years']

const industries = [
  'Banking & Financial Services',
  'Telecommunications',
  'Healthcare',
  'Government',
  'Retail & E-commerce',
  'Manufacturing',
  'Energy & Utilities',
  'Technology',
  'Other',
]

const countries = ['United Arab Emirates', 'Saudi Arabia', 'Egypt', 'France', 'Germany', 'United Kingdom', 'United States', 'Other']

const capabilityOptions = [
  { key: 'ml', label: 'Machine Learning' },
  { key: 'nlp', label: 'Natural Language Processing' },
  { key: 'cv', label: 'Computer Vision' },
  { key: 'data', label: 'Data Analytics & BI' },
  { key: 'cloud', label: 'Cloud & Infrastructure' },
  { key: 'cyber', label: 'Cybersecurity' },
  { key: 'rpa', label: 'RPA / Automation' },
  { key: 'crm', label: 'CRM / ERP Integration' },
]

const serviceOptions = [
  { key: 'consulting', label: 'Consulting' },
  { key: 'implementation', label: 'Implementation' },
  { key: 'support', label: 'Managed Support' },
  { key: 'training', label: 'Training & Enablement' },
  { key: 'resell', label: 'Reselling / Distribution' },
  { key: 'codev', label: 'Co-development' },
]

const regionOptions = [
  { key: 'mena', label: 'MENA' },
  { key: 'europe', label: 'Europe' },
  { key: 'us', label: 'North America' },
  { key: 'africa', label: 'Africa' },
  { key: 'apac', label: 'Asia Pacific' },
]

const stepLabels = ['Partner Details', 'Business Info', 'Capabilities', 'Review & Submit']

// ─── Right sidebar ───────────────────────────────────────────────────────────

function PartnerSidebar() {
  return (
    <div className="hidden rounded-2xl bg-[#FFF4EE] p-6 lg:block lg:w-72 xl:w-80 flex-shrink-0">
      <span className="inline-block rounded-full border border-[#FF6B2C] bg-white px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">
        Partner Program
      </span>

      <h2 className="mt-4 text-xl font-bold leading-snug text-[#0B1F3A]">
        Build Together.<br />Grow Together.
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        Join our partner network and deliver AI-powered solutions to your clients.
      </p>

      <div className="mt-5 rounded-xl border border-orange-200 bg-white p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">What happens next?</p>
        <ul className="space-y-3">
          {[
            { icon: UserCheck, title: 'Complete your profile', sub: 'Tell us about your business' },
            { icon: Puzzle, title: 'Share your capabilities', sub: 'Help us understand how you work' },
            { icon: Handshake, title: 'Get matched & onboarded', sub: 'Access resources and start collaborating' },
          ].map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#FFF4EE]">
                <Icon className="h-3.5 w-3.5 text-[#FF6B2C]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0B1F3A]">{title}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#0B1F3A]">Partner Benefits</p>
        <ul className="space-y-2.5">
          {[
            { icon: Rocket, title: 'Early Access', sub: 'Get early access to new features' },
            { icon: Globe, title: 'Co-marketing', sub: 'Grow with joint marketing opportunities' },
            { icon: GraduationCap, title: 'Training & Support', sub: 'Dedicated partner resources and support' },
            { icon: TrendingUp, title: 'Revenue Growth', sub: 'Unlock new revenue streams' },
          ].map(({ icon: Icon, title, sub }) => (
            <li key={title} className="flex items-start gap-2.5">
              <div className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-white">
                <Icon className="h-3.5 w-3.5 text-[#FF6B2C]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#0B1F3A]">{title}</p>
                <p className="text-xs text-slate-500">{sub}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// ─── Step progress bar ────────────────────────────────────────────────────────

function StepProgress({ step }) {
  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:gap-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 sm:hidden">
          Step {step} of {TOTAL_STEPS} — {stepLabels[step - 1]}
        </p>
        <div className="hidden w-full items-center sm:flex">
          {stepLabels.map((label, i) => {
            const num = i + 1
            const done = num < step
            const active = num === step
            return (
              <div key={label} className="flex flex-1 items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      done ? 'bg-[#FF6B2C] text-white' : active ? 'bg-[#FF6B2C] text-white' : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {done ? <CheckCircle2 className="h-4 w-4" /> : num}
                  </div>
                  <span
                    className={`mt-1 whitespace-nowrap text-[10px] font-medium ${
                      active ? 'text-[#FF6B2C]' : done ? 'text-slate-500' : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < stepLabels.length - 1 && (
                  <div className={`mb-4 h-[2px] flex-1 mx-2 rounded-full transition-colors ${num < step ? 'bg-[#FF6B2C]' : 'bg-slate-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function PartnerGetStartedPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedId, setSubmittedId] = useState('')
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const [form, setForm] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    jobTitle: '',
    phone: '',
    partnershipInterest: '',
    website: '',
    industry: '',
    companySize: '',
    country: '',
    yearsInBusiness: '',
    businessDescription: '',
    capabilities: [],
    services: [],
    regions: [],
  })

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleMulti(field, key) {
    setForm((prev) => {
      const arr = prev[field]
      return { ...prev, [field]: arr.includes(key) ? arr.filter((k) => k !== key) : [...arr, key] }
    })
  }

  const canGoNext = useMemo(() => {
    if (step === 1) {
      return form.fullName.trim() && form.workEmail.trim() && form.companyName.trim() && agreedToTerms
    }
    if (step === 2) {
      return !!form.industry && !!form.companySize
    }
    if (step === 3) {
      return form.capabilities.length > 0 && form.services.length > 0
    }
    return true
  }, [form, step, agreedToTerms])

  function goNext() {
    setSubmitError('')
    if (step < TOTAL_STEPS) setStep((s) => s + 1)
  }

  function goBack() {
    setSubmitError('')
    if (step > 1) setStep((s) => s - 1)
  }

  async function handleSubmit() {
    if (!canGoNext || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError('')

    const payload = {
      profile: 'ai_partner',
      submittedAt: new Date().toISOString(),
      contact: {
        fullName: form.fullName,
        workEmail: form.workEmail,
        companyName: form.companyName,
        jobTitle: form.jobTitle,
        phone: form.phone,
        partnershipInterest: form.partnershipInterest,
      },
      business: {
        website: form.website,
        industry: form.industry,
        companySize: form.companySize,
        country: form.country,
        yearsInBusiness: form.yearsInBusiness,
        description: form.businessDescription,
      },
      capabilities: form.capabilities,
      services: form.services,
      regions: form.regions,
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/partner-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(errorText || `Submission failed (${response.status})`)
      }

      const result = await response.json()
      setSubmittedId(result.partnerId || '')
      setStep(TOTAL_STEPS + 1)
    } catch (error) {
      if (error instanceof TypeError) {
        setSubmitError('Cannot reach API server. Start backend on http://localhost:8000 and try again.')
      } else {
        setSubmitError(error instanceof Error ? error.message : 'Could not submit form')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  const isSuccess = step === TOTAL_STEPS + 1

  return (
    <div className="flex min-h-screen flex-col bg-[#F5F7FA] text-slate-900">
      <Navbar activePage="onboarding" />
      <StepProgress step={Math.min(step, TOTAL_STEPS)} />

      <main className="mx-auto flex w-full max-w-5xl flex-1 items-start gap-5 px-4 py-6 sm:px-6 sm:py-8 lg:items-start">

        {/* ── Step 1: Partner Details ─────────────────────────────────────── */}
        {step === 1 ? (
          <>
            <div className="w-full flex-1 rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-8">
              <span className="inline-block rounded-full border border-[#FF6B2C] bg-[#FFF4EE] px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                Partner Onboarding
              </span>
              <h1 className="mt-4 text-2xl font-bold text-[#0B1F3A]">Let's get started</h1>
              <p className="mt-1 text-sm text-slate-500">
                <span className="text-[#FF6B2C]">Tell</span> us about yourself and your organization
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Full Name *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    <input
                      type="text"
                      value={form.fullName}
                      onChange={(e) => setField('fullName', e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#FF6B2C] focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Work Email *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <input
                      type="email"
                      value={form.workEmail}
                      onChange={(e) => setField('workEmail', e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#FF6B2C] focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Company Name *</span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </span>
                    <input
                      type="text"
                      value={form.companyName}
                      onChange={(e) => setField('companyName', e.target.value)}
                      placeholder="Enter company name"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#FF6B2C] focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Job Title</span>
                  <select
                    value={form.jobTitle}
                    onChange={(e) => setField('jobTitle', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                  >
                    <option value="">Select your role</option>
                    {jobTitleOptions.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Phone Number <span className="font-normal text-slate-400">(Optional)</span></span>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-lg border border-slate-300 py-2.5 pl-9 pr-3 text-sm focus:border-[#FF6B2C] focus:outline-none"
                    />
                  </div>
                </label>

                <label className="block sm:col-span-2">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Partnership Interest</span>
                  <select
                    value={form.partnershipInterest}
                    onChange={(e) => setField('partnershipInterest', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                  >
                    <option value="">Select what interests you most</option>
                    {partnershipInterestOptions.map((o) => <option key={o} value={o}>{o}</option>)}
                  </select>
                </label>
              </div>

              <label className="mt-4 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#FF6B2C]"
                />
                <span className="text-xs text-slate-600">
                  I agree to the{' '}
                  <a href="#" className="text-[#FF6B2C] underline hover:text-[#E65A20]">Partner Program Terms</a>
                  {' '}and{' '}
                  <a href="#" className="text-[#FF6B2C] underline hover:text-[#E65A20]">Privacy Policy</a>
                </span>
              </label>

              <div className="mt-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => { window.location.hash = '/' }}
                  className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!canGoNext}
                  className="rounded-lg bg-[#FF6B2C] px-10 py-2 text-sm font-semibold text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45"
                >
                  Continue
                </button>
              </div>
              <p className="mt-3 text-center text-xs text-slate-400">Step 1 of {TOTAL_STEPS}</p>
            </div>
            <PartnerSidebar />
          </>
        ) : null}

        {/* ── Step 2: Business Info ────────────────────────────────────────── */}
        {step === 2 ? (
          <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-8">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Tell us about your business</h2>
            <p className="mt-1 text-sm text-slate-500">Help us understand your company better.</p>

            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Website <span className="font-normal text-slate-400">(Optional)</span></span>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => setField('website', e.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Industry *</span>
                  <select
                    value={form.industry}
                    onChange={(e) => setField('industry', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                  >
                    <option value="">Select industry</option>
                    {industries.map((i) => <option key={i} value={i}>{i}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Country <span className="font-normal text-slate-400">(Optional)</span></span>
                  <select
                    value={form.country}
                    onChange={(e) => setField('country', e.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </label>
              </div>

              <div>
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Company Size *</span>
                <div className="grid grid-cols-4 gap-2">
                  {companySizeOptions.map((opt) => {
                    const Icon = opt.icon
                    const active = form.companySize === opt.key
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setField('companySize', opt.key)}
                        className={`rounded-lg border py-2.5 text-center text-xs font-medium transition ${
                          active ? 'border-[#FF6B2C] bg-[#FFF2EC] text-[#FF6B2C]' : 'border-slate-300 text-slate-600 hover:border-[#FF6B2C]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Years in Business <span className="font-normal text-slate-400">(Optional)</span></span>
                <select
                  value={form.yearsInBusiness}
                  onChange={(e) => setField('yearsInBusiness', e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                >
                  <option value="">Select range</option>
                  {yearsOptions.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Brief Business Description <span className="font-normal text-slate-400">(Optional)</span></span>
                <textarea
                  value={form.businessDescription}
                  onChange={(e) => setField('businessDescription', e.target.value.slice(0, 500))}
                  rows={3}
                  placeholder="Describe what your company does..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
                <div className="mt-1 text-right text-xs text-slate-400">{form.businessDescription.length} / 500</div>
              </label>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
              <button type="button" onClick={goNext} disabled={!canGoNext} className="rounded-lg bg-[#FF6B2C] px-10 py-2 text-sm font-semibold text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">Continue</button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Step 2 of {TOTAL_STEPS}</p>
          </div>
        ) : null}

        {/* ── Step 3: Capabilities ─────────────────────────────────────────── */}
        {step === 3 ? (
          <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-8">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Your Capabilities</h2>
            <p className="mt-1 text-sm text-slate-500">Help us match you with the right opportunities.</p>

            <div className="mt-5 space-y-5">
              <div>
                <p className="mb-2 text-sm font-medium text-[#0B1F3A]">AI & Technology Specializations * <span className="font-normal text-slate-400">(Select all that apply)</span></p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {capabilityOptions.map((opt) => {
                    const active = form.capabilities.includes(opt.key)
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleMulti('capabilities', opt.key)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                          active ? 'border-[#FF6B2C] bg-[#FFF2EC]' : 'border-slate-300 hover:border-[#FF6B2C]'
                        }`}
                      >
                        {active ? <CircleCheck className="h-4 w-4 flex-shrink-0 text-[#FF6B2C]" /> : <Circle className="h-4 w-4 flex-shrink-0 text-slate-300" />}
                        <span className="text-sm font-medium text-[#0B1F3A]">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#0B1F3A]">Services Offered * <span className="font-normal text-slate-400">(Select all that apply)</span></p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceOptions.map((opt) => {
                    const active = form.services.includes(opt.key)
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleMulti('services', opt.key)}
                        className={`flex items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-sm transition ${
                          active ? 'border-[#FF6B2C] bg-[#FFF2EC]' : 'border-slate-300 hover:border-[#FF6B2C]'
                        }`}
                      >
                        {active ? <CircleCheck className="h-4 w-4 flex-shrink-0 text-[#FF6B2C]" /> : <Circle className="h-4 w-4 flex-shrink-0 text-slate-300" />}
                        <span className="text-sm font-medium text-[#0B1F3A]">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[#0B1F3A]">Geographic Coverage <span className="font-normal text-slate-400">(Optional)</span></p>
                <div className="flex flex-wrap gap-2">
                  {regionOptions.map((opt) => {
                    const active = form.regions.includes(opt.key)
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => toggleMulti('regions', opt.key)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                          active ? 'border-[#FF6B2C] bg-[#FF6B2C] text-white' : 'border-slate-300 text-slate-600 hover:border-[#FF6B2C]'
                        }`}
                      >
                        {opt.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
              <button type="button" onClick={goNext} disabled={!canGoNext} className="rounded-lg bg-[#FF6B2C] px-10 py-2 text-sm font-semibold text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">Continue</button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Step 3 of {TOTAL_STEPS}</p>
          </div>
        ) : null}

        {/* ── Step 4: Review & Submit ──────────────────────────────────────── */}
        {step === 4 ? (
          <div className="w-full max-w-2xl rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-8">
            <h2 className="text-xl font-bold text-[#0B1F3A]">Review & Submit</h2>
            <p className="mt-1 text-sm text-slate-500">Please review your information before submitting.</p>

            <div className="mt-5 space-y-4">
              {[
                {
                  title: 'Partner Details',
                  items: [
                    ['Name', form.fullName],
                    ['Email', form.workEmail],
                    ['Company', form.companyName],
                    ['Job Title', form.jobTitle],
                    ['Phone', form.phone || '—'],
                    ['Partnership Interest', form.partnershipInterest || '—'],
                  ],
                },
                {
                  title: 'Business Info',
                  items: [
                    ['Industry', form.industry],
                    ['Company Size', form.companySize],
                    ['Country', form.country || '—'],
                    ['Years in Business', form.yearsInBusiness || '—'],
                  ],
                },
                {
                  title: 'Capabilities',
                  items: [
                    ['Specializations', form.capabilities.join(', ') || '—'],
                    ['Services', form.services.join(', ') || '—'],
                    ['Regions', form.regions.join(', ') || '—'],
                  ],
                },
              ].map((section) => (
                <div key={section.title} className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">{section.title}</p>
                  <dl className="space-y-1">
                    {section.items.map(([label, value]) => (
                      <div key={label} className="flex flex-wrap gap-x-2 text-sm">
                        <dt className="w-36 flex-shrink-0 font-medium text-slate-500">{label}</dt>
                        <dd className="text-slate-800">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>

            {submitError ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</div>
            ) : null}

            <div className="mt-6 flex items-center justify-between">
              <button type="button" onClick={goBack} className="rounded-lg border border-slate-300 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-lg bg-[#FF6B2C] px-10 py-2 text-sm font-semibold text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
            <p className="mt-3 text-center text-xs text-slate-400">Step 4 of {TOTAL_STEPS}</p>
          </div>
        ) : null}

        {/* ── Success screen ───────────────────────────────────────────────── */}
        {isSuccess ? (
          <div className="w-full max-w-md rounded-2xl bg-white px-6 py-10 shadow-lg text-center sm:px-8">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-7 w-7 text-emerald-600" />
            </div>
            <h2 className="mt-4 text-xl font-bold text-[#0B1F3A]">Application Submitted!</h2>
            <p className="mt-2 text-sm text-slate-500">Your partner application has been received. Our team will review it and get in touch within 2 business days.</p>

            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
              Thank you for applying to join the Sofia Nexus Partner Program.
            </div>

            {submittedId ? (
              <p className="mt-3 text-sm text-slate-600">
                Partner ID: <span className="font-semibold text-[#0B1F3A]">{submittedId}</span>
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => { window.location.hash = '/' }}
              className="mt-6 w-full rounded-lg bg-[#0B1F3A] py-3 text-sm font-semibold text-white hover:bg-[#FF6B2C]"
            >
              Back to Home
            </button>
          </div>
        ) : null}

      </main>

      <footer className="bg-[#070810] py-4 text-center text-sm text-gray-400">
        © 2026 Sofia Nexus
      </footer>
    </div>
  )
}
