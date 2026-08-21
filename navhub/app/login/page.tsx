'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTheme, type Theme } from '@/components/theme-provider'

function NavHubLogo() {
  return (
    <img src="/group-80.png" alt="NavHub" width="120" height="40" className="navhub-logo" style={{ objectFit: 'contain' }} />
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

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    router.push('/dashboard')
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Inter, ui-sans-serif, sans-serif', background: 'var(--color-kumo-canvas)' }}>

      {/* ── LEFT: form panel ── */}
      <div
        className="flex flex-col w-full lg:w-1/2 min-h-screen"
        style={{ background: 'var(--color-kumo-canvas)' }}
      >
        {/* top bar */}
        <div className="flex items-center justify-between px-6 py-5 sm:px-8">
          <NavHubLogo />
          <ThemeToggle />
        </div>

        {/* form */}
        <div className="flex flex-1 items-center justify-center px-6 pb-16 sm:px-10">
          <div className="w-full max-w-xs">

            <h1 className="text-xl sm:text-2xl font-semibold text-center mb-7"
              style={{ color: 'var(--text-color-kumo-strong)' }}>
              Sign in to NavHub
            </h1>

            {error && (
              <p className="text-xs text-center rounded-lg px-3 py-2 mb-4"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171' }}>
                {error}
              </p>
            )}

            {/* last-used Google account */}
            <button
              type="button"
              className="w-full flex items-center justify-between gap-3 rounded-lg px-3 mb-5 cursor-pointer transition-colors"
              style={{
                height: 44,
                background: 'var(--color-kumo-canvas)',
                border: '1px solid var(--color-kumo-line)',
                color: 'var(--text-color-kumo-default)',
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              <span className="flex items-center gap-2.5 min-w-0">
                <GoogleIcon />
                <span className="truncate">you@example.com</span>
              </span>
              <span className="shrink-0 text-xs font-semibold rounded-full px-2 py-0.5"
                style={{ color: '#4693ff', background: 'rgba(70,147,255,0.12)', fontSize: 11 }}>
                Last used
              </span>
            </button>

            {/* divider */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-px" style={{ background: 'var(--color-kumo-line)' }} />
              <span className="text-xs" style={{ color: 'var(--text-color-kumo-inactive)' }}>or</span>
              <div className="flex-1 h-px" style={{ background: 'var(--color-kumo-line)' }} />
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full rounded-lg px-3 text-sm outline-none"
                style={{
                  height: 42,
                  background: 'var(--color-kumo-canvas)',
                  color: 'var(--text-color-kumo-default)',
                  border: '1px solid var(--color-kumo-line)',
                }}
              />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-lg px-3 text-sm outline-none"
                style={{
                  height: 42,
                  background: 'var(--color-kumo-canvas)',
                  color: 'var(--text-color-kumo-default)',
                  border: '1px solid var(--color-kumo-line)',
                }}
              />
              <button
                type="submit"
                className="w-full rounded-lg text-sm font-semibold border-0 cursor-pointer flex items-center justify-center gap-1.5 mt-1 transition-opacity hover:opacity-90"
                style={{ height: 42, background: 'var(--text-color-kumo-strong)', color: 'var(--color-kumo-canvas)' }}
              >
                Log in with another profile →
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: 'var(--text-color-kumo-subtle)' }}>
              Don&apos;t have an account?{' '}
              <Link href="/sign-up" className="font-semibold no-underline" style={{ color: '#f6821f' }}>
                Sign up
              </Link>
            </p>

            <p className="text-xs text-center mt-6 leading-relaxed" style={{ color: 'var(--text-color-kumo-inactive)' }}>
              By continuing, I agree to NavHub&apos;s{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>terms</a>,{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>privacy policy</a>, and{' '}
              <a href="#" className="underline" style={{ color: 'var(--text-color-kumo-subtle)' }}>cookie policy</a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: image panel (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ background: '#000' }}>

        <img
          src="/login-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 0 }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.3) 100%)',
            zIndex: 1,
          }}
        />

        {/* top-right sign-up button */}
        <div className="absolute top-0 right-0 p-6 z-10">
          <Link
            href="/sign-up"
            className="flex items-center text-sm font-semibold no-underline rounded-lg px-4"
            style={{
              height: 36,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            Sign up
          </Link>
        </div>

        {/* promo text */}
        <div className="absolute bottom-12 left-10 xl:left-14 z-10 max-w-xs xl:max-w-sm">
          <p className="text-xs font-mono font-medium uppercase tracking-widest mb-3"
            style={{ color: 'rgba(255,255,255,0.6)' }}>
            NavHub
          </p>
          <h2 className="text-2xl xl:text-3xl font-bold leading-snug mb-3" style={{ color: '#fff' }}>
            One workspace.<br />Every Navchetna product.
          </h2>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Build, deploy, learn, and scale from a single platform.
          </p>
        </div>
      </div>

    </div>
  )
}
