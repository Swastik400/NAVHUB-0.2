'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { useTheme } from '@/components/theme-provider'
import type { Theme } from '@/components/theme-provider'

const LANGUAGES = ['English (US)', 'English (UK)', 'Hindi', 'Spanish', 'French', 'German', 'Japanese']
const TIMEZONES = [
  'Asia/Kolkata (IST, UTC+5:30)',
  'UTC',
  'America/New_York (EST, UTC-5)',
  'America/Los_Angeles (PST, UTC-8)',
  'Europe/London (GMT, UTC+0)',
  'Europe/Paris (CET, UTC+1)',
  'Asia/Tokyo (JST, UTC+9)',
  'Asia/Singapore (SGT, UTC+8)',
]
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD', 'MMM D, YYYY']
const DENSITIES = [
  { key: 'compact',     label: 'Compact',     desc: 'More content, less spacing.' },
  { key: 'comfortable', label: 'Comfortable', desc: 'Balanced spacing. Default.' },
  { key: 'spacious',    label: 'Spacious',    desc: 'More breathing room.' },
]
const THEMES: { value: Theme; label: string; icon: React.ReactNode }[] = [
  {
    value: 'light',
    label: 'Light',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
    ),
  },
  {
    value: 'system',
    label: 'System',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" />
      </svg>
    ),
  },
  {
    value: 'dark',
    label: 'Dark',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z" />
      </svg>
    ),
  },
]

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
      <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
        {title}
      </p>
      {children}
    </div>
  )
}

/* Row for selects — label left, control right (max 260px), stacks on small */
function Row({ label, desc, children, last }: { label: string; desc?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '13px 16px', borderTop: last === false ? 'none' : '1px solid var(--color-kumo-line)', flexWrap: 'wrap' }}>
      <div style={{ flex: '1 1 160px', minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', lineHeight: 1.4 }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0, width: '100%', maxWidth: 260 }}>{children}</div>
    </div>
  )
}

/* Row for inline controls (switch, buttons) — label left, control pinned right, never wraps control */
function RowInline({ label, desc, children, last }: { label: string; desc?: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '13px 16px', borderTop: last === false ? 'none' : '1px solid var(--color-kumo-line)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{label}</p>
        {desc && <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', lineHeight: 1.4 }}>{desc}</p>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  )
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        height: 32, padding: '0 10px', borderRadius: 7, fontSize: 12, fontWeight: 500,
        fontFamily: 'Inter, var(--font-sans)', cursor: 'pointer', outline: 'none',
        background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
        border: '1px solid var(--color-kumo-line)', width: '100%',
      }}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? 'rgb(34,197,94)' : 'var(--color-kumo-tint)',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        boxShadow: '0 0 0 1px var(--color-kumo-line)', padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%',
        background: on ? '#fff' : 'var(--text-color-kumo-subtle)',
        transition: 'left 0.2s', opacity: on ? 1 : 0.5,
      }} />
    </button>
  )
}

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [language, setLanguage]     = useState('English (US)')
  const [timezone, setTimezone]     = useState('Asia/Kolkata (IST, UTC+5:30)')
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY')
  const [density, setDensity]       = useState('comfortable')
  const [reducedMotion, setReducedMotion] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
              Preferences
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
              Customize how NavHub looks and behaves for you.
            </p>
          </div>
          <button onClick={handleSave} style={{ ...primaryBtn, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            {saved ? (
              <>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Saved
              </>
            ) : 'Save changes'}
          </button>
        </div>

        {/* Appearance */}
        <SectionCard title="Appearance">
          <div style={{ padding: '16px' }}>
            <p style={{ fontSize: 12, fontWeight: 500, margin: '0 0 10px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>Theme</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {THEMES.map(t => {
                const active = mounted && theme === t.value
                return (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    style={{
                      flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                      padding: '14px 10px', borderRadius: 10, cursor: 'pointer',
                      border: active ? '1.5px solid rgb(59,130,246)' : '1px solid var(--color-kumo-line)',
                      background: active ? 'rgba(59,130,246,0.06)' : 'var(--color-kumo-canvas)',
                      color: active ? 'rgb(59,130,246)' : 'var(--text-color-kumo-subtle)',
                      transition: 'all 0.15s',
                    }}
                  >
                    {t.icon}
                    <span style={{ fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)' }}>{t.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ padding: '13px 16px', borderTop: '1px solid var(--color-kumo-line)' }}>
            <div style={{ marginBottom: 10 }}>
              <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>Density</p>
              <p style={{ fontSize: 12, margin: '2px 0 0', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', lineHeight: 1.4 }}>Controls spacing and padding across the UI.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {DENSITIES.map(d => (
                <button
                  key={d.key}
                  onClick={() => setDensity(d.key)}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 4, padding: '10px 8px', borderRadius: 9, cursor: 'pointer',
                    border: density === d.key ? '1.5px solid var(--color-kumo-line)' : '1px solid var(--color-kumo-line)',
                    background: density === d.key ? 'var(--text-color-kumo-default)' : 'var(--color-kumo-canvas)',
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, fontFamily: 'Inter, var(--font-sans)', color: density === d.key ? 'var(--color-kumo-canvas)' : 'var(--text-color-kumo-default)' }}>{d.label}</span>

                </button>
              ))}
            </div>
          </div>
          <RowInline label="Reduce motion" desc="Minimizes animations and transitions.">
            <Switch on={reducedMotion} onChange={setReducedMotion} />
          </RowInline>
          <RowInline label="Collapse sidebar by default" desc="Start with the sidebar collapsed on load.">
            <Switch on={sidebarCollapsed} onChange={setSidebarCollapsed} />
          </RowInline>
        </SectionCard>

        {/* Language & Region */}
        <SectionCard title="Language & Region">
          <Row label="Language" desc="Display language for the NavHub interface." last={false}>
            <Select value={language} onChange={setLanguage} options={LANGUAGES} />
          </Row>
          <Row label="Timezone" desc="Used for timestamps, billing cycles, and scheduling.">
            <Select value={timezone} onChange={setTimezone} options={TIMEZONES} />
          </Row>
          <Row label="Date format" desc="How dates are displayed across the dashboard.">
            <Select value={dateFormat} onChange={setDateFormat} options={DATE_FORMATS} />
          </Row>
        </SectionCard>

      </div>
    </DashboardLayout>
  )
}

const primaryBtn: React.CSSProperties = {
  height: 32, padding: '0 14px', borderRadius: 7, border: 'none',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)',
}
