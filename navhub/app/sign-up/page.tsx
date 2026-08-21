'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme, type Theme } from '@/components/theme-provider'

function NavHubLogo() {
  return (
    <svg viewBox="0 0 460 271.2" width="68" height="40" aria-label="NavHub">
      <path fill="#FBAD41" d="M328.6,125.6c-0.8,0-1.5,0.6-1.8,1.4l-4.8,16.7c-2.1,7.2-1.3,13.8,2.2,18.7c3.2,4.5,8.6,7.1,15.1,7.4l26.2,1.6c0.8,0,1.5,0.4,1.9,1c0.4,0.6,0.5,1.5,0.3,2.2c-0.4,1.2-1.6,2.1-2.9,2.2l-27.3,1.6c-14.8,0.7-30.7,12.6-36.3,27.2l-2,5.1c-0.4,1,0.3,2,1.4,2h93.8c1.1,0,2.1-0.7,2.4-1.8c1.6-5.8,2.5-11.9,2.5-18.2c0-37-30.2-67.2-67.3-67.2C330.9,125.5,329.7,125.5,328.6,125.6z"/>
      <path fill="#F6821F" d="M292.8,204.4c2.1-7.2,1.3-13.8-2.2-18.7c-3.2-4.5-8.6-7.1-15.1-7.4l-123.1-1.6c-0.8,0-1.5-0.4-1.9-1s-0.5-1.4-0.3-2.2c0.4-1.2,1.6-2.1,2.9-2.2l124.2-1.6c14.7-0.7,30.7-12.6,36.3-27.2l7.1-18.5c0.3-0.8,0.4-1.6,0.2-2.4c-8-36.2-40.3-63.2-78.9-63.2c-35.6,0-65.8,23-76.6,54.9c-7-5.2-15.9-8-25.5-7.1c-17.1,1.7-30.8,15.4-32.5,32.5c-0.4,4.4-0.1,8.7,0.9,12.7c-27.9,0.8-50.2,23.6-50.2,51.7c0,2.5,0.2,5,0.5,7.5c0.2,1.2,1.2,2.1,2.4,2.1h227.2c1.3,0,2.5-0.9,2.9-2.2L292.8,204.4z"/>
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
        <path d="M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"/>
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
        <path d="M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,40a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,216Z"/>
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
        <path d="M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23Z"/>
      </svg>
    ),
  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  return (
    <div
      className="flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ background: 'var(--color-kumo-tint)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
    >
      {THEMES.map(t => (
        <button
          key={t.value}
          type="button"
          title={t.label}
          onClick={() => setTheme(t.value)}
          className="flex items-center justify-center rounded-md border-0 cursor-pointer transition-colors"
          style={{
            width: 28, height: 26,
            background: theme === t.value ? 'var(--color-kumo-base)' : 'transparent',
            color: theme === t.value ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
            boxShadow: theme === t.value ? '0 0 0 1px var(--color-kumo-line)' : 'none',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !password) { setError('Please fill in all fields.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    router.push('/dashboard')
  }

  const inputStyle: React.CSSProperties = {
    height: 42,
    background: 'var(--color-kumo-canvas)',
    color: 'var(--text-color-kumo-default)',
    border: '1px solid var(--color-kumo-line)',
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Inter, ui-sans-serif, sans-serif', background: 'var(--color-kumo-base)' }}>

      {/* ── LEFT: form panel ── */}
      <div
        className="flex flex-col w-full lg:w-1/2 min-h-screen"
        style={{ background: 'var(--color-kumo-base)' }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-8">
          <NavHubLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold px-4 rounded-lg flex items-center no-underline transition-colors"
              style={{
                height: 36,
                background: 'var(--color-kumo-base)',
                color: 'var(--text-color-kumo-default)',
                boxShadow: '0 0 0 1px var(--color-kumo-line)',
              }}
            >
              Sign in
            </Link>
          </div>
        </div>

        {/* form */}
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-sm">

            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-7"
              style={{ color: 'var(--text-color-kumo-strong)' }}>
              Create your NavHub account
            </h1>

            {error && (
              <p className="text-xs text-center rounded-lg px-3 py-2 mb-4"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                {error}
              </p>
            )}

            {/* Google sign-up */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2.5 rounded-lg px-3 mb-5 cursor-pointer transition-colors"
              style={{
                height: 44,
                background: 'var(--color-kumo-canvas)',
                border: '1px solid var(--color-kumo-line)',
                color: 'var(--text-color-kumo-default)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <GoogleIcon />
              Sign up with Google
            </button>

            {/* divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'var(--color-kumo-line)' }} />
              <span className="text-xs" style={{ color: 'var(--text-color-kumo-inactive)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-kumo-line)' }} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text"     value={name}     onChange={e => setName(e.target.value)}     placeholder="Full name"               className="w-full rounded-lg px-3 text-sm outline-none" style={inputStyle} />
              <input type="email"    value={email}    onChange={e => setEmail(e.target.value)}    placeholder="Email address"           className="w-full rounded-lg px-3 text-sm outline-none" style={inputStyle} />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password (min. 8 chars)"  className="w-full rounded-lg px-3 text-sm outline-none" style={inputStyle} />
              <button
                type="submit"
                className="w-full rounded-lg text-sm font-semibold border-0 cursor-pointer mt-1 transition-opacity hover:opacity-90"
                style={{ height: 42, background: 'var(--color-kumo-brand)', color: '#fff' }}
              >
                Create account
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: 'var(--text-color-kumo-subtle)' }}>
              Already have an account?{' '}
              <Link href="/login" className="font-semibold no-underline" style={{ color: '#f6821f' }}>
                Sign in
              </Link>
            </p>

            <p className="text-xs text-center mt-8 leading-relaxed" style={{ color: 'var(--text-color-kumo-inactive)' }}>
              By creating an account, I agree to NavHub&apos;s{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>terms</a>,{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>privacy policy</a>, and{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>cookie policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: video panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#000' }}>

        <video
          autoPlay loop muted playsInline aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        >
          <source src="/sea-storm.mp4" type="video/mp4" />
        </video>

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1,
          }}
        />

        {/* top-right sign-in button */}
        <div className="absolute top-0 right-0 p-6 z-10">
          <Link
            href="/login"
            className="flex items-center text-sm font-semibold no-underline rounded-lg px-4"
            style={{
              height: 36,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            Sign in
          </Link>
        </div>

        {/* promo text */}
        <div className="absolute bottom-12 left-10 xl:left-14 z-10 max-w-xs xl:max-w-sm">
          <p className="text-xs font-mono font-medium uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            NavHub Connect 2026
          </p>
          <h2 className="text-2xl xl:text-3xl font-bold leading-snug mb-3" style={{ color: '#fff' }}>
            Join thousands of<br />builders today.
          </h2>
          <p className="text-sm mb-5" style={{ color: 'rgba(255,255,255,0.6)' }}>
            October 19–21, 2026 · Moscone West, San Francisco
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold no-underline rounded-lg px-4"
            style={{ height: 38, background: '#fff', color: '#111' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 256 256">
              <path d="M224,104a8,8,0,0,1-16,0V59.32l-66.33,66.34a8,8,0,0,1-11.32-11.32L196.68,48H152a8,8,0,0,1,0-16h64a8,8,0,0,1,8,8Zm-40,24a8,8,0,0,0-8,8v72H48V80h72a8,8,0,0,0,0-16H48A16,16,0,0,0,32,80V208a16,16,0,0,0,16,16H176a16,16,0,0,0,16-16V136A8,8,0,0,0,184,128Z"/>
            </svg>
            Register now
          </a>
        </div>
      </div>

    </div>
  )
}
