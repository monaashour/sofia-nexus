import { useState } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim()) {
      setError('Please enter your work email.')
      setSuccess('')
      return
    }

    setIsSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        throw new Error(data.detail || data.message || `Request failed (${response.status})`)
      }

      setSuccess(data.message || 'If an account exists, reset instructions were sent.')
    } catch (submitError) {
      if (submitError instanceof TypeError) {
        setError('Cannot reach API server. Start backend on http://localhost:8000.')
      } else {
        setError(submitError instanceof Error ? submitError.message : 'Could not submit reset request.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-4 py-8">
      <div className="w-full max-w-md rounded-3xl bg-[#0B1F3A] p-6 shadow-xl">
        <h1 className="mb-2 text-3xl font-semibold text-white">Forgot Password</h1>
        <p className="mb-5 text-sm text-slate-300">
          Enter your account email. We will send a new temporary password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-600 bg-[#060F1F] px-4 py-3 text-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#FF6B2C]"
          />

          {error ? (
            <div className="rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
              {success}
            </div>
          ) : null}

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => { window.location.hash = '/' }}
              className="text-sm text-slate-300 underline hover:text-[#FF6B2C]"
            >
              Back to Sign In
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-[#FF6B2C] px-6 py-2 text-lg font-medium text-white transition hover:bg-[#E65A20] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
