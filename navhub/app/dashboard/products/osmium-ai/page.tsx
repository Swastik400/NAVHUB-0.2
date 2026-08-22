'use client'

import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import Link from 'next/link'
import { Funnel, Play, CalendarBlank, DotsThree, Printer, CaretLeft, CaretRight, Eye, EyeSlash } from '@phosphor-icons/react'
import { useState, useRef, useEffect } from 'react'

/* ── Hardcoded current user email (simulated) ───────────── */
const CURRENT_USER_EMAIL = 'Swastikkhatua4@gmail.com'

/* ── Tab definition ─────────────────────────────────────── */
const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const
type Tab = typeof TABS[number]

/* ── Reusable small components ──────────────────────────── */
function Btn({ children, emphasis }: { children: React.ReactNode; emphasis?: boolean }) {
  return (
    <button type="button"
      className="group flex w-max shrink-0 items-center gap-1 font-medium select-none border-0 cursor-pointer rounded-md px-2 text-xs shadow-xs focus:outline-none transition-colors"
      style={{
        height: 26,
        ...(emphasis
          ? { background: 'color-mix(in oklch, var(--color-kumo-brand), white 30%)', color: '#fff', boxShadow: '0 0 0 1px color-mix(in oklch, var(--color-kumo-brand), black 10%)' }
          : { background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', boxShadow: '0 0 0 1px var(--color-kumo-line)' })
      }}>
      {children}
    </button>
  )
}

function FBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 px-3 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors"
      style={{ height: 36, background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}>
      {children}
    </button>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="relative flex flex-col gap-1 rounded-xl border px-5 py-4 shadow-xs"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', minHeight: 100 }}>
      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span className="text-3xl font-semibold tabular-nums leading-none mt-1" style={{ color: 'var(--text-color-kumo-default)' }}>{value}</span>
      <span className="text-xs mt-1" style={{ color: 'var(--text-color-kumo-subtle)' }}>{sub ?? 'No data yet'}</span>
    </div>
  )
}

function Shell({ title, children, pad = true, style }: { title: string; children: React.ReactNode; pad?: boolean; style?: React.CSSProperties }) {
  return (
    <div className="relative flex min-h-0 flex-col overflow-hidden rounded-xl border shadow-xs"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', ...style }}>
      <div className="flex items-start gap-3 px-4 pt-3 pb-0.5 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium" style={{ color: 'var(--text-color-kumo-subtle)' }}>{title}</div>
        </div>
        <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint) -mt-1.5 -mr-2.5"
          style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
          <DotsThree size={16} weight="bold" />
        </button>
      </div>
      <div className={`min-h-0 flex-1 overflow-hidden ${pad ? 'px-5 pt-0.5 pb-5' : 'p-0'}`}>{children}</div>
    </div>
  )
}

function NoData() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <Funnel size={32} style={{ color: 'var(--text-color-kumo-subtle)' }} />
      <p className="mt-3 text-base font-medium" style={{ color: 'var(--text-color-kumo-default)' }}>No data found</p>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>There is no activity to display for this time range or set of filters.</p>
    </div>
  )
}

function TopN({ items }: { items: { label: string; value: string }[] }) {
  return (
    <div className="w-full py-1">
      <ol className="ml-0">
        {items.length === 0
          ? <li className="list-none py-0.5 px-4"><div className="flex min-h-8 items-center text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>No data</div></li>
          : items.map((it, i) => (
            <li key={i} className="list-none py-0.5 px-4">
              <div className="flex min-h-8 items-center text-sm gap-3">
                <span className="min-w-0 flex-1 truncate" style={{ color: 'var(--text-color-kumo-default)' }}>{it.label}</span>
                <span className="shrink-0 tabular-nums" style={{ color: 'var(--text-color-kumo-subtle)' }}>{it.value}</span>
              </div>
            </li>
          ))
        }
      </ol>
    </div>
  )
}

/* ── Date range picker (same as analytics) ──────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']
const PRESETS = [
  { label: 'Last 1 hour',    value: '1h'  },
  { label: 'Last 6 hours',   value: '6h'  },
  { label: 'Last 24 hours',  value: '24h' },
  { label: 'Last 7 days',    value: '7d'  },
  { label: 'Last 30 days',   value: '30d' },
  { label: 'Last 3 months',  value: '3mo' },
  { label: 'Last 12 months', value: '12mo'},
  { label: 'Month to date',  value: 'mtd' },
  { label: 'Year to date',   value: 'ytd' },
]

function DateRangePicker({ onClose, onApply }: { onClose: () => void; onApply: (label: string) => void }) {
  const today = new Date()
  const [viewYear, setViewYear]   = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [start, setStart]         = useState<Date | null>(null)
  const [end, setEnd]             = useState<Date | null>(null)
  const [hovered, setHovered]     = useState<Date | null>(null)
  const [preset, setPreset]       = useState('24h')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [onClose])

  function daysInMonth(y: number, m: number) { return new Date(y, m + 1, 0).getDate() }
  function firstDayOfWeek(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 }
  function isSame(a: Date, b: Date) {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
  }
  function inRange(d: Date) {
    const s = start; const e2 = end ?? hovered
    if (!s || !e2) return false
    const lo = s < e2 ? s : e2; const hi = s < e2 ? e2 : s
    return d > lo && d < hi
  }
  function pickDay(d: Date) {
    if (!start || (start && end)) { setStart(d); setEnd(null) }
    else if (d < start) { setEnd(start); setStart(d) }
    else { setEnd(d) }
    setPreset('')
  }

  const dim = daysInMonth(viewYear, viewMonth)
  const offset = firstDayOfWeek(viewYear, viewMonth)
  const cells: (Date | null)[] = [
    ...Array(offset).fill(null),
    ...Array.from({ length: dim }, (_, i) => new Date(viewYear, viewMonth, i + 1)),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }
  function applyPreset(p: string) {
    setPreset(p); setStart(null); setEnd(null)
    const found = PRESETS.find(x => x.value === p)
    if (found) onApply(found.label)
  }
  function applyCustom() {
    if (!start) return
    const s = start.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
    const e2 = end ? end.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }) : s
    onApply(`${s} – ${e2}`)
  }

  const btnBase: React.CSSProperties = {
    width: 32, height: 32, borderRadius: 6, border: 'none', cursor: 'pointer',
    fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.1s',
  }

  return (
    <div ref={ref} className="absolute right-0 top-full mt-2 z-50 flex flex-col sm:flex-row rounded-xl border shadow-xl overflow-hidden"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', width: 'min(560px, 95vw)' }}>
      <div className="flex flex-row sm:flex-col overflow-x-auto sm:overflow-x-visible py-2 border-b sm:border-b-0 sm:border-r" style={{ borderColor: 'var(--color-kumo-line)', minWidth: 0 }}>
        {PRESETS.map(p => (
          <button key={p.value} type="button" onClick={() => applyPreset(p.value)}
            className="text-left px-4 py-1.5 text-sm cursor-pointer border-0 transition-colors"
            style={{
              background: preset === p.value ? 'var(--color-kumo-tint)' : 'transparent',
              color: preset === p.value ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              fontWeight: preset === p.value ? 600 : 400,
            }}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-center justify-between">
          <button type="button" onClick={prevMonth}
            className="flex items-center justify-center rounded-md border-0 cursor-pointer transition-colors"
            style={{ width: 28, height: 28, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)' }}>
            <CaretLeft size={14} weight="bold" />
          </button>
          <span className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button type="button" onClick={nextMonth}
            className="flex items-center justify-center rounded-md border-0 cursor-pointer transition-colors"
            style={{ width: 28, height: 28, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)' }}>
            <CaretRight size={14} weight="bold" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map(d => (
            <div key={d} className="flex items-center justify-center text-xs font-medium" style={{ height: 28, color: 'var(--text-color-kumo-subtle)' }}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0.5">
          {cells.map((d, i) => {
            if (!d) return <div key={i} />
            const isStart  = start && isSame(d, start)
            const isEnd    = end   && isSame(d, end)
            const isToday  = isSame(d, today)
            const inRng    = inRange(d)
            const isFuture = d > today
            return (
              <button key={i} type="button"
                disabled={isFuture}
                onClick={() => pickDay(d)}
                onMouseEnter={() => setHovered(d)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  ...btnBase, width: '100%',
                  background: (isStart || isEnd) ? 'var(--color-kumo-brand)' : inRng ? 'var(--color-kumo-tint)' : 'transparent',
                  color: (isStart || isEnd) ? '#fff' : isFuture ? 'var(--text-color-kumo-subtle)' : 'var(--text-color-kumo-default)',
                  opacity: isFuture ? 0.35 : 1,
                  outline: isToday && !isStart && !isEnd ? '1.5px solid var(--color-kumo-brand)' : 'none',
                  borderRadius: isStart ? '6px 0 0 6px' : isEnd ? '0 6px 6px 0' : inRng ? 0 : 6,
                }}>
                {d.getDate()}
              </button>
            )
          })}
        </div>
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--color-kumo-line)' }}>
          <span className="text-xs" style={{ color: 'var(--text-color-kumo-subtle)' }}>
            {start ? start.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) : '—'}
            {' – '}
            {end ? end.toLocaleDateString('en-GB', { day:'2-digit', month:'short' }) : '—'}
          </span>
          <div className="flex gap-2">
            <button type="button" onClick={onClose}
              className="px-3 rounded-lg text-xs font-medium border-0 cursor-pointer transition-colors"
              style={{ height: 30, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)' }}>
              Cancel
            </button>
            <button type="button" onClick={applyCustom} disabled={!start}
              className="px-3 rounded-lg text-xs font-medium border-0 cursor-pointer transition-colors disabled:opacity-40"
              style={{ height: 30, background: 'var(--color-kumo-brand)', color: '#fff' }}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DateRangeBtn() {
  const [open, setOpen]   = useState(false)
  const [label, setLabel] = useState('Last 24 hours')
  return (
    <div className="relative">
      <FBtn onClick={() => setOpen(o => !o)}>
        <CalendarBlank size={16} />{label}
      </FBtn>
      {open && (
        <DateRangePicker
          onClose={() => setOpen(false)}
          onApply={l => { setLabel(l); setOpen(false) }}
        />
      )}
    </div>
  )
}

/* ── Filter bar ─────────────────────────────────────────── */
function FilterBar() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b sticky top-0 z-20"
      style={{ minHeight: 'var(--header-height, 58px)', borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-elevated)' }}>
      <div className="flex items-center gap-2">
        <FBtn><Funnel size={16} /><span className="hidden sm:inline">Add filter</span></FBtn>
      </div>
      <div className="inline-flex items-center gap-2">
        <FBtn><Play size={16} /><span className="hidden sm:inline">Live refresh</span></FBtn>
        <DateRangeBtn />
      </div>
    </header>
  )
}

/* ── Tab bar ─────────────────────────────────────────────── */
function TabBar({ active }: { active: Tab }) {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href = tab === 'overview'
          ? '/dashboard/products/osmium-ai'
          : `/dashboard/products/osmium-ai?tab=${tab}`
        return (
          <Link
            key={tab}
            href={href}
            className="relative px-3 py-2.5 text-sm font-medium capitalize no-underline transition-colors whitespace-nowrap"
            style={{
              color: active === tab ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              borderBottom: active === tab ? '2px solid var(--color-kumo-brand)' : '2px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab === 'rate-limits' ? 'Rate limits' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </Link>
        )
      })}
    </div>
  )
}

/* ── Tab content placeholders ───────────────────────────── */
function OverviewTab() {
  return (
    <div className="py-2 px-2 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3 py-3 px-1">
        <h1 className="text-lg sm:text-xl font-semibold pl-2" style={{ color: 'var(--text-color-kumo-default)' }}>Osmium AI — Overview</h1>
        <div className="shrink-0 flex items-center gap-2">
          <Btn><Printer size={16} /><span>Print</span></Btn>
        </div>
      </div>
      <FilterBar />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 pt-2">
        <StatCard label="Total Queries"     value="0" />
        <StatCard label="Active Sessions"   value="0" />
        <StatCard label="Avg Response Time" value="—" />
        <StatCard label="Error Rate"        value="0.00%" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        <Shell title="Top query types"   pad={false} style={{ minHeight: 280 }}><NoData /></Shell>
        <Shell title="Model usage"       pad={false} style={{ minHeight: 280 }}><NoData /></Shell>
        <Shell title="Session activity"  pad={false} style={{ minHeight: 280 }}><NoData /></Shell>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
        <Shell title="Requests over time" style={{ minHeight: 240 }}><NoData /></Shell>
        <Shell title="Latency over time"  style={{ minHeight: 240 }}><NoData /></Shell>
      </div>
    </div>
  )
}

function GenericTab({ title }: { title: string }) {
  return (
    <div className="py-2 px-2 flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3 py-3 px-1">
        <h1 className="text-lg sm:text-xl font-semibold pl-2" style={{ color: 'var(--text-color-kumo-default)' }}>Osmium AI — {title}</h1>
      </div>
      <FilterBar />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-2 pt-2">
        <StatCard label="Total" value="0" />
        <StatCard label="Peak"  value="—" />
        <StatCard label="Avg"   value="—" />
        <StatCard label="Errors" value="0" />
      </div>
      <div className="px-2">
        <Shell title={`${title} over time`} style={{ minHeight: 280 }}><NoData /></Shell>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
        <Shell title="Top sources"    pad={false} style={{ minHeight: 280 }}><TopN items={[]} /></Shell>
        <Shell title="Top endpoints"  pad={false} style={{ minHeight: 280 }}><TopN items={[]} /></Shell>
        <Shell title="Distribution"   pad={false} style={{ minHeight: 280 }}><NoData /></Shell>
      </div>
    </div>
  )
}

/* ── Login gate ─────────────────────────────────────────── */
function LoginGate({ onUnlock }: { onUnlock: () => void }) {
  const [step, setStep]         = useState<'enable' | 'login'>('enable')
  const [email, setEmail]       = useState(CURRENT_USER_EMAIL)
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  function handleSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError('Please fill in all fields.'); return }
    setError('')
    setLoading(true)
    setTimeout(() => { setLoading(false); onUnlock() }, 900)
  }

  if (step === 'enable') {
    return (
      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={() => setStep('login')}
          className="enable-btn flex items-center justify-center rounded-xl text-sm font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90"
          style={{ height: 42, padding: '0 28px' }}
        >
          Enable Osmium AI
        </button>
        <div className="flex items-center gap-3" style={{ maxWidth: 320 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--color-kumo-line)' }} />
          <span className="text-xs font-medium whitespace-nowrap" style={{ color: 'var(--text-color-kumo-subtle)' }}>Login required to get access</span>
          <div style={{ flex: 1, height: 1, background: 'var(--color-kumo-line)' }} />
        </div>
      </div>
    )
  }

  return (
    <div
      className="flex flex-col gap-5 rounded-2xl border p-8 shadow-2xl"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', width: 380, maxWidth: '90vw' }}
    >
      {error && (
        <p className="text-xs rounded-lg px-3 py-2"
          style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSignIn} className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: 'var(--text-color-kumo-subtle)' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg px-3 text-sm outline-none"
            style={{ height: 40, background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)', border: '1px solid var(--color-kumo-line)' }}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium" style={{ color: 'var(--text-color-kumo-subtle)' }}>Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg px-3 pr-10 text-sm outline-none"
              style={{ height: 40, background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)', border: '1px solid var(--color-kumo-line)' }}
            />
            <button
              type="button"
              onClick={() => setShowPw(v => !v)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center justify-center border-0 bg-transparent cursor-pointer p-0"
              style={{ color: 'var(--text-color-kumo-subtle)' }}
            >
              {showPw ? <EyeSlash size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center rounded-xl text-sm font-semibold border-0 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-60 mt-1"
          style={{ height: 42, background: '#fff', color: '#111' }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <button
        type="button"
        onClick={() => { setStep('enable'); setPassword(''); setError('') }}
        className="text-xs text-center border-0 bg-transparent cursor-pointer transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-color-kumo-subtle)' }}
      >
        ← Back
      </button>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────── */
export default function OsmiumAIPage() {
  const searchParams = useSearchParams()
  const tab = (searchParams.get('tab') ?? 'overview') as Tab
  const [unlocked, setUnlocked] = useState(false)

  const tabTitles: Record<Tab, string> = {
    overview: 'Overview', usage: 'Usage', performance: 'Performance',
    health: 'Health', caching: 'Caching', 'rate-limits': 'Rate limits',
    cost: 'Cost', logs: 'Logs', insights: 'Insights',
  }

  return (
    <DashboardLayout>
      <div
        className="relative w-full h-full"
        style={{ background: 'var(--color-kumo-canvas)', overflow: unlocked ? 'auto' : 'hidden' }}
      >
        {/* Dashboard content — only rendered after unlock */}
        {unlocked && (
          <div>
            <TabBar active={tab} />
            {tab === 'overview' ? <OverviewTab /> : <GenericTab title={tabTitles[tab]} />}
          </div>
        )}

        {/* Gate overlay — absolute, scoped to main content area only */}
        {!unlocked && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: 'var(--color-kumo-canvas)' }}
          >
            <LoginGate onUnlock={() => setUnlocked(true)} />
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
