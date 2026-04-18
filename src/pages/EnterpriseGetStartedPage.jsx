import { useMemo, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import {
  Rocket,
  Cog,
  BarChart3,
  Bot,
  Target,
  Zap,
  CalendarDays,
  Compass,
  Building2,
  Users,
  Landmark,
  CircleCheck,
  Circle,
  Paperclip,
  FileText,
  X,
} from 'lucide-react'

const TOTAL_STEPS = 6
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const goalOptions = [
  { key: 'explore_ai', label: 'Explore AI opportunities', icon: Rocket },
  { key: 'improve_processes', label: 'Improve existing processes', icon: Cog },
  { key: 'insights', label: 'Use data for insights', icon: BarChart3 },
  { key: 'automate_workflows', label: 'Automate workflows', icon: Bot },
  { key: 'lead_generation', label: 'Generate leads and growth', icon: Target },
]

const priorityOptions = [
  { key: 'high', title: 'High', subtitle: 'Immediate need', icon: Zap },
  { key: 'medium', title: 'Medium', subtitle: 'Next 3 - 6 months', icon: CalendarDays },
  { key: 'exploring', title: 'Exploring', subtitle: 'Learning and evaluating', icon: Compass },
]

const companySizeOptions = [
  { key: '1-50', label: '1 - 50 employees', icon: Users },
  { key: '51-500', label: '51 - 500 employees', icon: Building2 },
  { key: '500+', label: '500+ employees', icon: Landmark },
]

const countries = ['United Arab Emirates', 'Saudi Arabia', 'Egypt', 'France', 'Germany', 'United Kingdom', 'United States']

const industries = [
  'Banking & Financial Services',
  'Telecommunications',
  'Healthcare',
  'Government',
  'Retail & E-commerce',
  'Manufacturing',
  'Energy & Utilities',
  'Technology',
]

function ProgressBar({ step }) {
  return (
    <div className="flex-shrink-0 border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Step {step} of {TOTAL_STEPS}</p>
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 w-6 rounded-full transition-colors ${
                i < step ? 'bg-[#FF6B2C]' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function StepCard({ children, className = '' }) {
  return (
    <div className={`w-full max-w-2xl overflow-y-auto rounded-2xl bg-white px-6 py-8 shadow-lg sm:px-8 ${className}`}>
      {children}
    </div>
  )
}

export default function EnterpriseGetStartedPage() {
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submittedPayloadId, setSubmittedPayloadId] = useState('')
  const [documents, setDocuments] = useState([])
  const [fileUploadError, setFileUploadError] = useState('')
  const fileInputRef = useRef(null)

  const ACCEPTED_EXTENSIONS = new Set(['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg'])
  const MAX_FILE_SIZE = 10 * 1024 * 1024
  const MAX_FILES = 5

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  function getApiErrorMessage(rawValue, fallbackMessage) {
    if (typeof rawValue !== 'string' || !rawValue.trim()) {
      return fallbackMessage
    }

    try {
      const parsed = JSON.parse(rawValue)
      if (typeof parsed?.detail === 'string' && parsed.detail.trim()) {
        return parsed.detail
      }
    } catch {
      // Keep original string handling when body is not JSON.
    }

    return rawValue.length > 180 ? fallbackMessage : rawValue
  }

  function addFiles(newFiles) {
    setFileUploadError('')
    const combined = [...documents]
    for (const file of newFiles) {
      if (combined.length >= MAX_FILES) {
        setFileUploadError(`Maximum ${MAX_FILES} files allowed.`)
        break
      }
      const ext = '.' + file.name.split('.').pop().toLowerCase()
      if (!ACCEPTED_EXTENSIONS.has(ext)) {
        setFileUploadError(`"${file.name}" is not a supported file type.`)
        continue
      }
      if (file.size > MAX_FILE_SIZE) {
        setFileUploadError(`"${file.name}" exceeds the 10 MB limit.`)
        continue
      }
      if (!combined.find((f) => f.name === file.name && f.size === file.size)) {
        combined.push(file)
      }
    }
    setDocuments(combined)
  }

  function handleFileSelect(event) {
    addFiles(Array.from(event.target.files))
    event.target.value = ''
  }

  function handleFileDrop(event) {
    event.preventDefault()
    addFiles(Array.from(event.dataTransfer.files))
  }

  function removeDocument(index) {
    setDocuments((prev) => prev.filter((_, i) => i !== index))
    setFileUploadError('')
  }

  const [form, setForm] = useState({
    companyName: '',
    website: '',
    industry: '',
    companySize: '',
    country: '',
    goals: [],
    priority: '',
    expectations: '',
    fullName: '',
    workEmail: '',
    phone: '',
  })

  const canGoNext = useMemo(() => {
    if (step === 2) {
      return form.companyName.trim() && form.industry && form.companySize
    }

    if (step === 3) {
      return form.goals.length > 0
    }

    if (step === 4) {
      return !!form.priority
    }

    if (step === 6) {
      return form.fullName.trim() && EMAIL_PATTERN.test(form.workEmail.trim())
    }

    return true
  }, [form, step])

  function goNext() {
    setSubmitError('')
    if (step < TOTAL_STEPS) {
      setStep((current) => current + 1)
    }
  }

  function goBack() {
    setSubmitError('')
    if (step > 1) {
      setStep((current) => current - 1)
    }
  }

  function setField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function toggleGoal(goalKey) {
    setForm((current) => {
      const exists = current.goals.includes(goalKey)
      const nextGoals = exists ? current.goals.filter((goal) => goal !== goalKey) : [...current.goals, goalKey]
      return { ...current, goals: nextGoals }
    })
  }

  async function submitOnboarding() {
    if (!canGoNext || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    setSubmitError('')

    // Upload documents first if any were selected
    let uploadedDocuments = []
    if (documents.length > 0) {
      try {
        const formData = new FormData()
        documents.forEach((file) => formData.append('files', file))
        const uploadResponse = await fetch(`${API_BASE_URL}/api/upload-documents`, {
          method: 'POST',
          body: formData,
        })
        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text().catch(() => '')
          throw new Error(getApiErrorMessage(uploadError, `Document upload failed (${uploadResponse.status})`))
        }
        const uploadResult = await uploadResponse.json()
        uploadedDocuments = uploadResult.files.map((f) => f.storedName)
      } catch (error) {
        if (error instanceof TypeError) {
          setSubmitError('Cannot reach API server. Start backend on http://localhost:8000 and try again.')
        } else {
          setSubmitError(error instanceof Error ? error.message : 'Document upload failed')
        }
        setIsSubmitting(false)
        return
      }
    }

    const payload = {
      profile: 'enterprise_customer',
      submittedAt: new Date().toISOString(),
      company: {
        name: form.companyName,
        website: form.website,
        industry: form.industry,
        size: form.companySize,
        country: form.country,
      },
      goals: form.goals,
      priority: form.priority,
      expectations: form.expectations,
      documents: uploadedDocuments,
      contact: {
        fullName: form.fullName,
        workEmail: form.workEmail,
        phone: form.phone,
      },
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/enterprise-onboarding`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorText = await response.text().catch(() => '')
        throw new Error(getApiErrorMessage(errorText, `Submission failed (${response.status})`))
      }

      const result = await response.json()
      setSubmittedPayloadId(result.companyId || result.leadId || '')
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

  return (
    <div className="flex min-h-screen flex-col overflow-y-auto bg-[#F5F7FA] text-slate-900 md:h-screen md:overflow-hidden">
      <Navbar activePage="onboarding" />
      <ProgressBar step={Math.min(step, TOTAL_STEPS)} />

      <main className="mx-auto flex w-full max-w-7xl flex-1 overflow-visible px-4 py-6 items-center justify-center sm:px-6 sm:py-8">

        {step === 1 ? (
          <StepCard className="max-w-sm">
            <div className="flex h-full flex-col text-center">
              <div className="mt-10">
                <span className="inline-block rounded-full border border-[#FF6B2C] bg-[#FFF4EE] px-5 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">
                  Enterprise Onboarding
                </span>
                <h1 className="mt-6 text-xl font-bold leading-tight text-[#0B1F3A]">
                  Let's understand<br />your business
                </h1>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  A quick few questions to tailor<br />the right AI solution for you
                </p>

                <div className="my-6 border-t border-slate-100" />

                <div className="mx-auto mb-4 flex w-fit items-center justify-center gap-1.5 text-xs text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Takes about 2 minutes
                </div>
              </div>

              <button
                type="button"
                onClick={goNext}
                className="mt-auto w-full rounded-lg bg-[#FF6B2C] py-3 text-sm font-semibold text-white transition hover:bg-[#E65A20]"
              >
                Start
              </button>
            </div>
          </StepCard>
        ) : null}

        {step === 2 ? (
          <StepCard>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Tell us about your company</h2>
            <p className="mt-1 text-sm text-slate-500">We only ask for the essentials.</p>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Company Name *</span>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={(event) => setField('companyName', event.target.value)}
                  placeholder="Enter your company name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Website (Optional)</span>
                <input
                  type="url"
                  value={form.website}
                  onChange={(event) => setField('website', event.target.value)}
                  placeholder="https://yourcompany.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Industry *</span>
                <select
                  value={form.industry}
                  onChange={(event) => setField('industry', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#FF6B2C] focus:outline-none"
                >
                  <option value="">Select industry</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </label>

              <div>
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Company Size *</span>
                <div className="grid gap-2 sm:grid-cols-3">
                  {companySizeOptions.map((option) => {
                    const Icon = option.icon
                    const isActive = form.companySize === option.key
                    return (
                      <button
                        key={option.key}
                        type="button"
                        onClick={() => setField('companySize', option.key)}
                        className={`rounded-lg border px-3 py-2 text-left transition ${
                          isActive ? 'border-[#FF6B2C] bg-[#FFF2EC]' : 'border-slate-300 bg-white hover:border-[#FF6B2C]'
                        }`}
                      >
                        <Icon className="mb-1 h-4 w-4 text-[#0B1F3A]" />
                        <div className="text-xs font-medium leading-tight text-[#0B1F3A]">{option.label}</div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-sm font-medium text-[#0B1F3A]">Country (Optional)</span>
                <select
                  value={form.country}
                  onChange={(event) => setField('country', event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-[#FF6B2C] focus:outline-none"
                >
                  <option value="">Select country</option>
                  {countries.map((country) => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </label>

              <div className="sticky bottom-0 mt-4 flex justify-between bg-white pt-3">
                <button type="button" onClick={goBack} className="rounded-lg border border-slate-400 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
                <button type="button" onClick={goNext} disabled={!canGoNext} className="rounded-lg bg-[#FF6B2C] px-8 py-2 text-sm font-medium text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">Next</button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === 3 ? (
          <StepCard>
            <h2 className="text-xl font-bold text-[#0B1F3A]">What are you looking for?</h2>
            <p className="mt-1 text-sm text-slate-500">Choose all that apply.</p>
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                {goalOptions.map((goal) => {
                  const Icon = goal.icon
                  const isActive = form.goals.includes(goal.key)
                  return (
                    <button
                      key={goal.key}
                      type="button"
                      onClick={() => toggleGoal(goal.key)}
                      className={`rounded-lg border p-4 text-left transition ${
                        isActive ? 'border-[#FF6B2C] bg-[#FFF2EC]' : 'border-slate-300 bg-white hover:border-[#FF6B2C]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-[#0B1F3A]" />
                        {isActive ? <CircleCheck className="h-5 w-5 text-[#FF6B2C]" /> : <Circle className="h-5 w-5 text-slate-300" />}
                      </div>
                      <div className="mt-2 text-sm font-medium text-[#0B1F3A]">{goal.label}</div>
                    </button>
                  )
                })}
              </div>
              <div className="sticky bottom-0 mt-4 flex justify-between bg-white pt-3">
                <button type="button" onClick={goBack} className="rounded-lg border border-slate-400 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
                <button type="button" onClick={goNext} disabled={!canGoNext} className="rounded-lg bg-[#FF6B2C] px-8 py-2 text-sm font-medium text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">Next</button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === 4 ? (
          <StepCard>
            <h2 className="text-xl font-bold text-[#0B1F3A]">What's your priority?</h2>
            <p className="mt-1 text-sm text-slate-500">This helps us tailor the right path.</p>
            <div className="mt-5 space-y-3">
              {priorityOptions.map((priority) => {
                const Icon = priority.icon
                const isActive = form.priority === priority.key
                return (
                  <button
                    key={priority.key}
                    type="button"
                    onClick={() => setField('priority', priority.key)}
                    className={`w-full rounded-lg border px-4 py-3 text-left transition ${
                      isActive ? 'border-[#FF6B2C] bg-[#FFF2EC]' : 'border-slate-300 bg-white hover:border-[#FF6B2C]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isActive ? <CircleCheck className="h-5 w-5 text-[#FF6B2C]" /> : <Circle className="h-5 w-5 text-slate-300" />}
                      <Icon className="h-5 w-5 text-[#0B1F3A]" />
                      <div>
                        <div className="text-sm font-semibold text-[#0B1F3A]">{priority.title}</div>
                        <div className="text-xs text-slate-500">{priority.subtitle}</div>
                      </div>
                    </div>
                  </button>
                )
              })}
              <div className="sticky bottom-0 mt-4 flex justify-between bg-white pt-3">
                <button type="button" onClick={goBack} className="rounded-lg border border-slate-400 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
                <button type="button" onClick={goNext} disabled={!canGoNext} className="rounded-lg bg-[#FF6B2C] px-8 py-2 text-sm font-medium text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">Next</button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === 5 ? (
          <StepCard>
            <h2 className="text-xl font-bold text-[#0B1F3A]">Tell us more <span className="text-base font-normal text-slate-400">(optional)</span></h2>
            <p className="mt-1 text-sm text-slate-500">The more you share, the better we can help.</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Your Expectations</span>
                <textarea
                  value={form.expectations}
                  onChange={(event) => setField('expectations', event.target.value.slice(0, 1000))}
                  rows={4}
                  placeholder="e.g. Improve sales pipeline, automate reporting, reduce operational costs..."
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
                <div className="mt-1 text-right text-xs text-slate-400">{form.expectations.length} / 1000</div>
              </label>

              {/* Supporting documents */}
              <div>
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Supporting Documents</span>
                <div
                  className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 p-4 text-center transition hover:border-[#FF6B2C] hover:bg-orange-50"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      fileInputRef.current?.click()
                    }
                  }}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={handleFileSelect}
                  />
                  <Paperclip className="mb-1 h-5 w-5 text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Click to browse or drag files here</span>
                  <span className="mt-0.5 text-xs text-slate-400">PDF, DOC, DOCX, XLS, PNG, JPG · Max 10 MB · Up to 5 files</span>
                </div>

                {fileUploadError ? (
                  <p className="mt-1 text-xs text-red-500">{fileUploadError}</p>
                ) : null}

                {documents.length > 0 ? (
                  <ul className="mt-2 space-y-1.5">
                    {documents.map((file, i) => (
                      <li key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                        <div className="flex min-w-0 items-center gap-2">
                          <FileText className="h-4 w-4 flex-shrink-0 text-[#FF6B2C]" />
                          <span className="truncate text-xs font-medium text-slate-700">{file.name}</span>
                          <span className="flex-shrink-0 text-xs text-slate-400">{formatBytes(file.size)}</span>
                        </div>
                        <button type="button" onClick={() => removeDocument(i)} className="ml-2 flex-shrink-0 text-slate-400 hover:text-red-500" aria-label="Remove file">
                          <X className="h-4 w-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              <div className="sticky bottom-0 mt-4 flex justify-between bg-white pt-3">
                <button type="button" onClick={goBack} className="rounded-lg border border-slate-400 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
                <button type="button" onClick={goNext} className="rounded-lg bg-[#FF6B2C] px-8 py-2 text-sm font-medium text-white transition hover:bg-[#E65A20]">Next</button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === 6 ? (
          <StepCard>
            <h2 className="text-xl font-bold text-[#0B1F3A]">How can we reach you?</h2>
            <p className="mt-1 text-sm text-slate-500">We'll follow up with tailored recommendations.</p>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Full Name *</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setField('fullName', event.target.value)}
                  placeholder="Enter your full name"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Work Email *</span>
                <input
                  type="email"
                  value={form.workEmail}
                  onChange={(event) => setField('workEmail', event.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
                {form.workEmail.trim() && !EMAIL_PATTERN.test(form.workEmail.trim()) ? (
                  <p className="mt-1 text-xs text-red-500">Enter a valid work email address.</p>
                ) : null}
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-[#0B1F3A]">Phone (Optional)</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setField('phone', event.target.value)}
                  placeholder="+20 123 456 7890"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm focus:border-[#FF6B2C] focus:outline-none"
                />
              </label>
              {submitError ? (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</div>
              ) : null}
              <div className="sticky bottom-0 mt-4 flex justify-between bg-white pt-3">
                <button type="button" onClick={goBack} className="rounded-lg border border-slate-400 px-6 py-2 text-sm font-medium text-slate-700 hover:border-[#0B1F3A]">Back</button>
                <button type="button" onClick={submitOnboarding} disabled={!canGoNext || isSubmitting} className="rounded-lg bg-[#FF6B2C] px-8 py-2 text-sm font-medium text-white transition enabled:hover:bg-[#E65A20] disabled:opacity-45">
                  {isSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>
            </div>
          </StepCard>
        ) : null}

        {step === TOTAL_STEPS + 1 ? (
          <StepCard className="max-w-md">
            <div className="flex h-full flex-col text-center">
              <h2 className="text-xl font-bold text-[#0B1F3A]">You're all set</h2>
              <p className="mt-2 text-sm text-slate-500">Your enterprise onboarding request has been received.</p>
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                Thank you. Our team will reach out shortly with your tailored next steps.
              </div>
              {submittedPayloadId ? (
                <p className="mt-3 text-sm text-slate-600">Company ID: <span className="font-semibold text-[#0B1F3A]">{submittedPayloadId}</span></p>
              ) : null}
              <button
                type="button"
                onClick={() => { window.location.hash = '/' }}
                className="mt-auto w-full rounded-lg bg-[#0B1F3A] py-3 text-sm font-semibold text-white hover:bg-[#FF6B2C]"
              >
                Back to Home
              </button>
            </div>
          </StepCard>
        ) : null}

      </main>

      <footer className="bg-[#070810] py-4 text-center text-sm text-gray-400">
        © 2026 Sofia Nexus
      </footer>
    </div>
  )
}
