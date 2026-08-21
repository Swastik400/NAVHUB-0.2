'use client'

import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { Printer, Link, Plus, Funnel, CalendarBlank, Play, DotsThree, CaretLeft, CaretRight } from '@phosphor-icons/react'

/* ── tiny top buttons (h-6.5 = 26px) ─────────────────── */
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

/* ── filter bar buttons (h-9 = 36px) ─────────────────── */
function FBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1.5 px-3 rounded-lg text-sm font-medium border-0 cursor-pointer transition-colors"
      style={{ height: 36, background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}>
      {children}
    </button>
  )
}

/* ── date range picker ────────────────────────────────── */
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Mo','Tu','We','Th','Fr','Sa','Su']
const PRESETS = [
  { label: 'Last 1 hour',   value: '1h'  },
  { label: 'Last 6 hours',  value: '6h'  },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 7 days',   value: '7d'  },
  { label: 'Last 30 days',  value: '30d' },
  { label: 'Last 3 months', value: '3mo' },
  { label: 'Last 12 months',value: '12mo'},
  { label: 'Month to date', value: 'mtd' },
  { label: 'Year to date',  value: 'ytd' },
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
  function firstDayOfWeek(y: number, m: number) { return (new Date(y, m, 1).getDay() + 6) % 7 } // Mon=0

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
    setPreset(p)
    setStart(null); setEnd(null)
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
    <div ref={ref} className="absolute right-0 top-full mt-2 z-50 flex rounded-xl border shadow-xl overflow-hidden"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', minWidth: 560 }}>

      {/* left — presets */}
      <div className="flex flex-col py-2 border-r" style={{ borderColor: 'var(--color-kumo-line)', minWidth: 160 }}>
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

      {/* right — calendar */}
      <div className="flex flex-col flex-1 p-4 gap-3">

        {/* month nav */}
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

        {/* day headers */}
        <div className="grid grid-cols-7 gap-0.5">
          {DAYS.map(d => (
            <div key={d} className="flex items-center justify-center text-xs font-medium" style={{ height: 28, color: 'var(--text-color-kumo-subtle)' }}>{d}</div>
          ))}
        </div>

        {/* day cells */}
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
                  ...btnBase,
                  width: '100%',
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

        {/* footer */}
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

/* ── card shell ───────────────────────────────────────── */
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

/* ── stat card ────────────────────────────────────────── */
function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="relative flex flex-col gap-1 rounded-xl border px-5 py-4 shadow-xs"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)', minHeight: 100 }}>
      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span className="text-3xl font-semibold tabular-nums leading-none mt-1" style={{ color: 'var(--text-color-kumo-default)' }}>{value}</span>
      {sub && <span className="text-xs mt-1" style={{ color: 'var(--text-color-kumo-subtle)' }}>{sub}</span>}
      {!sub && <span className="text-xs mt-1" style={{ color: 'var(--text-color-kumo-subtle)' }}>No data yet</span>}
    </div>
  )
}

/* ── legend item ──────────────────────────────────────── */
function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div className="flex min-h-6 max-w-50 items-center gap-1.5 overflow-hidden pr-0.5 text-xs">
      <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color }} />
      <span className="min-w-0 truncate" style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span className="shrink-0 tabular-nums" style={{ color: 'var(--text-color-kumo-default)' }}>{value}</span>
    </div>
  )
}

/* ── chart ────────────────────────────────────────────── */
const TIME_LABELS = ['00:00','02:00','04:00','06:00','08:00','10:00','12:00','14:00','16:00','18:00','20:00','22:00','24:00']

function formatY(v: number) {
  if (v >= 1000000) return `${(v/1000000).toFixed(1)}M`
  if (v >= 1000) return `${(v/1000).toFixed(0)}k`
  return v.toString()
}

function buildCurve(xs: number[], ys: number[]) {
  return xs.reduce((acc, x, i) => {
    if (i === 0) return `M${x.toFixed(2)},${ys[i].toFixed(2)}`
    const px = xs[i-1]; const py = ys[i-1]; const cp = (x - px) * 0.42
    return `${acc} C${(px+cp).toFixed(2)},${py.toFixed(2)} ${(x-cp).toFixed(2)},${ys[i].toFixed(2)} ${x.toFixed(2)},${ys[i].toFixed(2)}`
  }, '')
}

function AreaChart({ series }: {
  series: { label: string; color: string; points: number[] }[]
}) {
  const W = 800; const H = 320
  const PL = 52; const PR = 20; const PT = 16; const PB = 40
  const cW = W - PL - PR; const cH = H - PT - PB

  const allVals = series.flatMap(s => s.points)
  const max = Math.max(...allVals, 1)
  const nPts = series[0].points.length

  const toX = (i: number) => PL + (i / (nPts - 1)) * cW
  const toY = (v: number) => PT + cH - (v / max) * cH

  // 5 horizontal grid ticks
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ t, y: PT + cH * (1 - t), label: formatY(Math.round(max * t)) }))

  // x-axis time labels — evenly spaced subset
  const xStep = Math.max(1, Math.floor((nPts - 1) / (TIME_LABELS.length - 1)))
  const xTicks = TIME_LABELS.map((lbl, i) => ({ x: toX(Math.min(i * xStep, nPts - 1)), label: lbl }))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`ag${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
            <stop offset="75%" stopColor={s.color} stopOpacity="0.04" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>

      {/* horizontal grid lines */}
      {yTicks.map(({ t, y, label }) => (
        <g key={t}>
          <line x1={PL} y1={y} x2={PL + cW} y2={y}
            stroke="var(--color-kumo-line)"
            strokeWidth={t === 0 ? 1.5 : 1}
            strokeDasharray={t === 0 ? '0' : '3 5'}
            strokeOpacity={t === 0 ? 1 : 0.7}
          />
          <text x={PL - 8} y={y} textAnchor="end" dominantBaseline="middle"
            fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">
            {label}
          </text>
        </g>
      ))}

      {/* vertical grid lines at x-ticks */}
      {xTicks.map(({ x }, i) => i > 0 && i < xTicks.length - 1 && (
        <line key={i} x1={x} y1={PT} x2={x} y2={PT + cH}
          stroke="var(--color-kumo-line)" strokeWidth="1"
          strokeDasharray="3 5" strokeOpacity="0.5"
        />
      ))}

      {/* area + curve per series */}
      {series.map((s, si) => {
        const xs = s.points.map((_, i) => toX(i))
        const ys = s.points.map(v => toY(v))
        const curve = buildCurve(xs, ys)
        const area = `${curve} L${toX(nPts-1).toFixed(2)},${(PT+cH).toFixed(2)} L${PL.toFixed(2)},${(PT+cH).toFixed(2)} Z`
        return (
          <g key={si}>
            <path d={area} fill={`url(#ag${si})`} />
            <path d={curve} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        )
      })}

      {/* x-axis labels */}
      {xTicks.map(({ x, label }, i) => (
        <text key={i} x={x} y={PT + cH + 16} textAnchor="middle"
          fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">
          {label}
        </text>
      ))}

      {/* axis border bottom */}
      <line x1={PL} y1={PT + cH} x2={PL + cW} y2={PT + cH}
        stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      {/* axis border left */}
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH}
        stroke="var(--color-kumo-line)" strokeWidth="1.5" />
    </svg>
  )
}

/* ── donut ────────────────────────────────────────────── */
function Donut({ slices }: { slices: { color: string; pct: number }[] }) {
  const r = 40; const cx = 50; const cy = 50; const sw = 14
  let angle = -90
  const arcs = slices.map(s => {
    const a1 = angle; const a2 = angle + s.pct * 3.6; angle = a2
    const rad = (d: number) => d * Math.PI / 180
    const x1 = cx + r * Math.cos(rad(a1)); const y1 = cy + r * Math.sin(rad(a1))
    const x2 = cx + r * Math.cos(rad(a2)); const y2 = cy + r * Math.sin(rad(a2))
    return { d: `M${x1.toFixed(2)},${y1.toFixed(2)} A${r},${r} 0 ${s.pct > 50 ? 1 : 0},1 ${x2.toFixed(2)},${y2.toFixed(2)}`, color: s.color }
  })
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {arcs.map((a, i) => <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw} strokeLinecap="butt" />)}
    </svg>
  )
}

/* ── status codes card ────────────────────────────────── */
const STATUS_CODES = [
  { code: '2xx', label: 'Success',     color: 'rgb(34,197,94)',   bg: 'rgba(34,197,94,0.08)',   pct: 72, count: '0' },
  { code: '3xx', label: 'Redirect',    color: 'rgb(234,179,8)',   bg: 'rgba(234,179,8,0.08)',   pct: 15, count: '0' },
  { code: '4xx', label: 'Client Err',  color: 'rgb(249,115,22)',  bg: 'rgba(249,115,22,0.08)',  pct: 10, count: '0' },
  { code: '5xx', label: 'Server Err',  color: 'rgb(239,68,68)',   bg: 'rgba(239,68,68,0.08)',   pct: 3,  count: '0' },
]

function StatusCodesCard() {
  return (
    <div className="rounded-xl border shadow-xs flex flex-col"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>

      {/* header */}
      <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b"
        style={{ borderColor: 'var(--color-kumo-line)' }}>
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Status codes</div>
          <div className="text-xs mt-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>Distribution of HTTP response codes</div>
        </div>
        <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint)"
          style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
          <DotsThree size={16} weight="bold" />
        </button>
      </div>

      {/* no data body */}
      <div className="flex items-center justify-center py-10">
        <div className="flex flex-col gap-4 items-center w-full max-w-xs text-center">
          <svg className="mx-auto opacity-60" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" style={{ color: 'var(--color-kumo-tint)' }} />
            <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="34.5" y="58" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" style={{ color: 'var(--color-kumo-tint)' }} />
            <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="27" y="36" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            <g filter="url(#filter_sc)">
              <rect x="12" y="6" width="154" height="40" rx="8" fill="currentColor" style={{ color: 'var(--color-kumo-base)' }} shapeRendering="crispEdges" />
              <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} shapeRendering="crispEdges" />
              <rect x="20" y="14" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
              <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
              <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
            </g>
            <defs>
              <filter id="filter_sc" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                <feOffset dy="6" />
                <feGaussianBlur stdDeviation="6" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
              </filter>
            </defs>
          </svg>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>No status code data</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-color-kumo-subtle)' }}>HTTP response code distribution will appear here once traffic is recorded</p>
          </div>
          <button type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer focus:outline-none"
            style={{ height: 32, background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', borderColor: 'var(--color-kumo-line)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
            Create insight
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── top-N list ───────────────────────────────────────── */
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

/* ── no data ──────────────────────────────────────────── */
function NoData() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-8 text-center">
      <Funnel size={32} style={{ color: 'var(--text-color-kumo-subtle)' }} />
      <p className="mt-3 text-base font-medium" style={{ color: 'var(--text-color-kumo-default)' }}>No data found</p>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>There is no activity to display for this time range or set of filters.</p>
    </div>
  )
}

/* ── mock data ────────────────────────────────────────── */
const sparkPts = [0,2,1,4,3,8,5,12,9,15,11,18,14,20,17,22,19,25,21,28,24,30,26,28,22,18,14,10,6,3]
const cachedPts = [0,1,0,2,1,4,3,6,4,8,6,10,8,12,10,14,12,16,14,18,16,20,18,16,12,10,8,6,4,2]
const devSlices = [{ color:'rgb(66,144,240)', pct:60 },{ color:'rgb(238,183,32)', pct:30 },{ color:'rgb(232,100,157)', pct:10 }]
const topPaths   = ['/api/v1/users','/dashboard','/api/v1/auth','/static/main.js','/favicon.ico'].map(l=>({label:l,value:'0'}))
const topHosts   = ['app.example.com','api.example.com','cdn.example.com'].map(l=>({label:l,value:'0'}))
const topIPs     = ['192.168.1.1','10.0.0.5','172.16.0.2'].map(l=>({label:l,value:'0'}))
const topBrowsers= ['Chrome','Safari','Firefox','Edge'].map(l=>({label:l,value:'0'}))
const topOS      = ['Windows','macOS','Android','iOS'].map(l=>({label:l,value:'0'}))
const topUA      = ['Chrome/124 Windows','Safari/17 macOS','Firefox/125 Linux'].map(l=>({label:l,value:'0'}))
const topCache   = ['HIT','MISS','EXPIRED'].map(l=>({label:l,value:'0'}))
const topOrigin  = ['200 OK','304 Not Modified','404 Not Found','500 Internal Error'].map(l=>({label:l,value:'0'}))

/* ── date range button ───────────────────────────────── */
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

/* ── tab bar ─────────────────────────────────────────── */
const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const
type Tab = typeof TABS[number]

function TabBar({ active }: { active: Tab }) {
  return (
    <div className="flex items-center gap-1 px-4 border-b" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage' ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        return (
          <a
            key={tab}
            href={href}
            className="relative px-3 py-2.5 text-sm font-medium capitalize no-underline transition-colors"
            style={{
              color: active === tab ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              borderBottom: active === tab ? '2px solid var(--color-kumo-brand)' : '2px solid transparent',
              marginBottom: -1,
              whiteSpace: 'nowrap',
            }}
          >
            {tab === 'rate-limits' ? 'Rate limits' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        )
      })}
    </div>
  )
}

/* ── bar chart ────────────────────────────────────────── */
function BarChart({ bars }: { bars: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...bars.map(b => b.value), 1)
  return (
    <div className="flex flex-col gap-2 w-full py-1">
      {bars.map((b, i) => (
        <div key={i} className="flex items-center gap-3 px-4">
          <span className="text-xs w-20 shrink-0 truncate" style={{ color: 'var(--text-color-kumo-subtle)' }}>{b.label}</span>
          <div className="flex-1 rounded-full overflow-hidden" style={{ height: 8, background: 'var(--color-kumo-tint)' }}>
            <div className="h-full rounded-full transition-all" style={{ width: `${(b.value / max) * 100}%`, background: b.color }} />
          </div>
          <span className="text-xs tabular-nums w-8 text-right shrink-0" style={{ color: 'var(--text-color-kumo-default)' }}>{b.value}</span>
        </div>
      ))}
    </div>
  )
}

/* ── traffic mock data ────────────────────────────────── */
const trafPts     = [12,18,14,22,30,45,52,48,60,72,68,80,75,88,92,85,78,70,65,58,50,42,35,28,22,18,15,12,10,8]
const trafUniq    = [8,12,10,15,20,30,35,32,40,48,45,54,50,58,62,57,52,47,43,39,34,28,23,19,15,12,10,8,7,5]
const trafBandPts = [0.2,0.4,0.3,0.6,0.9,1.4,1.7,1.5,2.0,2.4,2.2,2.8,2.5,3.0,3.2,2.9,2.6,2.3,2.1,1.9,1.6,1.3,1.0,0.8,0.6,0.4,0.3,0.2,0.15,0.1].map(v => Math.round(v * 1000))
const trafErrPts  = [0,0,0,1,0,2,1,0,3,2,1,0,2,1,0,1,0,2,1,0,1,0,0,1,0,0,1,0,0,0]

const methodBars  = [
  { label: 'GET',     value: 72, color: 'rgb(66,144,240)'  },
  { label: 'POST',    value: 18, color: 'rgb(141,88,238)'  },
  { label: 'PUT',     value: 6,  color: 'rgb(238,183,32)'  },
  { label: 'DELETE',  value: 3,  color: 'rgb(249,115,22)'  },
  { label: 'PATCH',   value: 1,  color: 'rgb(232,100,157)' },
]
const protocolBars = [
  { label: 'HTTP/2',  value: 61, color: 'rgb(66,144,240)'  },
  { label: 'HTTP/1.1',value: 28, color: 'rgb(141,88,238)'  },
  { label: 'HTTP/3',  value: 11, color: 'rgb(34,197,94)'   },
]
const contentBars = [
  { label: 'HTML',    value: 38, color: 'rgb(66,144,240)'  },
  { label: 'JSON',    value: 29, color: 'rgb(141,88,238)'  },
  { label: 'JS',      value: 16, color: 'rgb(238,183,32)'  },
  { label: 'CSS',     value: 10, color: 'rgb(34,197,94)'   },
  { label: 'Image',   value: 7,  color: 'rgb(232,100,157)' },
]
const methodSlices  = methodBars.map(b  => ({ color: b.color,  pct: b.value  }))
const protocolSlices= protocolBars.map(b => ({ color: b.color, pct: b.value  }))

const topReferrers  = ['google.com','github.com','twitter.com','linkedin.com','direct'].map(l => ({ label: l, value: '0' }))
const topCountries  = ['United States','India','Germany','United Kingdom','France'].map(l => ({ label: l, value: '0' }))
const topBandwidth  = ['app.example.com','api.example.com','cdn.example.com'].map(l => ({ label: l, value: '0 B' }))
const topStatusTraf = ['200 OK','301 Moved','304 Not Modified','404 Not Found','500 Error'].map(l => ({ label: l, value: '0' }))

/* ── traffic section ──────────────────────────────────── */
function TrafficSection() {
  return (
    <div style={{ background: 'var(--color-kumo-canvas)' }}>

      {/* title bar */}
      <div className="flex flex-wrap items-start justify-between gap-3 py-3 px-3">
        <div className="flex items-center flex-1">
          <h1 className="inline-block pl-2 border border-dashed border-transparent text-xl font-semibold hover:cursor-pointer hover:rounded hover:border-(--color-kumo-line) hover:bg-(--color-kumo-tint)"
            style={{ color: 'var(--text-color-kumo-default)' }}>Traffic</h1>
        </div>
        <div className="shrink-0 flex items-center flex-wrap gap-2 pr-2">
          <Btn><Printer size={16} /><span>Print</span></Btn>
          <Btn><Link size={16} /><span>Copy link</span></Btn>
          <Btn emphasis><Plus size={16} /><span>Add a chart</span></Btn>
        </div>
      </div>

      {/* filter bar */}
      <header className="flex items-center justify-between gap-3 px-4 border-b sticky top-0 z-20"
        style={{ height: 'var(--header-height, 58px)', borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-elevated)' }}>
        <div className="flex items-center gap-2">
          <FBtn><Funnel size={16} />Add filter</FBtn>
        </div>
        <div className="inline-flex items-center gap-2">
          <FBtn><Play size={16} />Live refresh</FBtn>
          <DateRangeBtn />
        </div>
      </header>

      <div className="py-2 px-2 flex flex-col gap-4">

        {/* row 1 — stat cards */}
        <div className="grid grid-cols-4 gap-3">
          <StatCard label="Total Requests"   value="0" />
          <StatCard label="Unique Visitors"  value="0" />
          <StatCard label="Bandwidth Used"   value="0 B" />
          <StatCard label="Error Rate"       value="0.00%" />
        </div>

        {/* row 2 — requests + unique visitors over time */}
        <div className="rounded-xl border shadow-xs flex flex-col"
          style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
          <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b shrink-0"
            style={{ borderColor: 'var(--color-kumo-line)' }}>
            <div>
              <div className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Requests &amp; unique visitors over time</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>Last 24 hours · 30-min intervals</div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Legend color="rgb(66,144,240)"  label="Requests" value="0" />
                <Legend color="rgb(34,197,94)"   label="Visitors" value="0" />
              </div>
              <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint)"
                style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
                <DotsThree size={16} weight="bold" />
              </button>
            </div>
          </div>
          <div className="px-2 pt-2 pb-1" style={{ height: 320 }}>
            <AreaChart series={[
              { label: 'Requests', color: 'rgb(66,144,240)',  points: trafPts  },
              { label: 'Visitors', color: 'rgb(34,197,94)',   points: trafUniq },
            ]} />
          </div>
          <div className="flex items-center gap-6 px-5 py-3 border-t" style={{ borderColor: 'var(--color-kumo-line)' }}>
            {[
              { label: 'Peak',    value: '92 req/min', color: 'rgb(66,144,240)' },
              { label: 'Average', value: '41 req/min', color: 'var(--text-color-kumo-subtle)' },
              { label: 'Total',   value: '0',          color: 'var(--text-color-kumo-subtle)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex items-center gap-2">
                <span className="text-xs" style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
                <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* row 3 — bandwidth + errors over time */}
        <div className="grid grid-cols-2 gap-4">

          {/* bandwidth */}
          <div className="rounded-xl border shadow-xs flex flex-col"
            style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b shrink-0"
              style={{ borderColor: 'var(--color-kumo-line)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Bandwidth over time</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>Bytes transferred per interval</div>
              </div>
              <div className="flex items-center gap-3">
                <Legend color="rgb(141,88,238)" label="Bandwidth" value="0 B" />
                <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint)"
                  style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
                  <DotsThree size={16} weight="bold" />
                </button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-1" style={{ height: 240 }}>
              <AreaChart series={[{ label: 'Bandwidth', color: 'rgb(141,88,238)', points: trafBandPts }]} />
            </div>
          </div>

          {/* errors */}
          <div className="rounded-xl border shadow-xs flex flex-col"
            style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b shrink-0"
              style={{ borderColor: 'var(--color-kumo-line)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Errors over time</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>4xx + 5xx responses per interval</div>
              </div>
              <div className="flex items-center gap-3">
                <Legend color="rgb(239,68,68)" label="Errors" value="0" />
                <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint)"
                  style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
                  <DotsThree size={16} weight="bold" />
                </button>
              </div>
            </div>
            <div className="px-2 pt-2 pb-1" style={{ height: 240 }}>
              <AreaChart series={[{ label: 'Errors', color: 'rgb(239,68,68)', points: trafErrPts }]} />
            </div>
          </div>
        </div>

        {/* row 4 — method + protocol + content type */}
        <div className="grid grid-cols-3 gap-4">

          <Shell title="Requests by HTTP method" style={{ height: 340 }}>
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32"><Donut slices={methodSlices} /></div>
              </div>
              <BarChart bars={methodBars} />
            </div>
          </Shell>

          <Shell title="Requests by protocol" style={{ height: 340 }}>
            <div className="flex h-full flex-col gap-3">
              <div className="flex items-center justify-center">
                <div className="w-32 h-32"><Donut slices={protocolSlices} /></div>
              </div>
              <BarChart bars={protocolBars} />
            </div>
          </Shell>

          <Shell title="Requests by content type" style={{ height: 340 }}>
            <div className="flex h-full flex-col gap-4 justify-center">
              <BarChart bars={contentBars} />
            </div>
          </Shell>
        </div>

        {/* row 5 — top referrers / countries / bandwidth by host */}
        <div className="grid grid-cols-3 gap-4">
          <Shell title="Top referrers"         pad={false} style={{ height: 440 }}><TopN items={topReferrers}  /></Shell>
          <Shell title="Top countries"          pad={false} style={{ height: 440 }}><TopN items={topCountries}  /></Shell>
          <Shell title="Bandwidth by host"      pad={false} style={{ height: 440 }}><TopN items={topBandwidth}  /></Shell>
        </div>

        {/* row 6 — status codes / top paths / top IPs */}
        <div className="grid grid-cols-3 gap-4">
          <Shell title="Top status codes"       pad={false} style={{ height: 440 }}><TopN items={topStatusTraf} /></Shell>
          <Shell title="Top paths by traffic"   pad={false} style={{ height: 440 }}><TopN items={topPaths}      /></Shell>
          <Shell title="Top client IPs"         pad={false} style={{ height: 440 }}><TopN items={topIPs}        /></Shell>
        </div>

      </div>
    </div>
  )
}

/* ── feature card ─────────────────────────────────────── */
function FeatureCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex flex-col gap-2 p-6 rounded-xl border shadow-xs w-80 shrink-0"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
      <div style={{ color: 'var(--text-color-kumo-default)' }}>{icon}</div>
      <p className="text-sm font-medium mt-4" style={{ color: 'var(--text-color-kumo-default)' }}>{title}</p>
      <p className="text-xs leading-relaxed" style={{ color: 'var(--text-color-kumo-subtle)' }}>{desc}</p>
    </div>
  )
}

/* ── analytics panel (pages/referrers/countries/devices/etc.) ── */
function AnalyticsPanel({ tabs, columns }: { tabs: string[]; columns: string[] }) {
  const [active, setActive] = useState(tabs[0])
  const rows = 7
  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-xl border shadow-xs"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
      {/* tab header */}
      <div className="flex items-center justify-between border-b px-5 pt-1"
        style={{ borderColor: 'var(--color-kumo-line)' }}>
        <div className="flex gap-6">
          {tabs.map(t => (
            <button key={t} type="button" onClick={() => setActive(t)}
              className="border-0 bg-transparent cursor-pointer py-3.5 px-0.5 text-sm font-medium border-b-2 transition-colors"
              style={{
                color: active === t ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
                borderBottomColor: active === t ? 'var(--text-color-kumo-default)' : 'transparent',
                marginBottom: -1,
              }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-4 pb-1">
          {columns.map(c => (
            <span key={c} className="text-xs font-medium uppercase" style={{ color: 'var(--text-color-kumo-subtle)' }}>{c}</span>
          ))}
        </div>
      </div>
      {/* skeleton rows */}
      <div className="flex flex-col my-2" style={{ minHeight: 280 }}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center px-3" style={{ height: 40 }}>
            <div className="w-full rounded-md" style={{ minHeight: 32, opacity: 0.5, background: 'var(--color-kumo-tint)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── analytics panel (smaller, 5 rows) ─────────────────── */
function AnalyticsPanelSm({ tabs, columns }: { tabs: string[]; columns: string[] }) {
  const [active, setActive] = useState(tabs[0])
  return (
    <div className="flex flex-col flex-1 overflow-hidden rounded-xl border shadow-xs"
      style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
      <div className="flex items-center justify-between border-b px-5 pt-1"
        style={{ borderColor: 'var(--color-kumo-line)' }}>
        <div className="flex gap-6">
          {tabs.map(t => (
            <button key={t} type="button" onClick={() => setActive(t)}
              className="border-0 bg-transparent cursor-pointer py-3.5 px-0.5 text-sm font-medium border-b-2 transition-colors"
              style={{
                color: active === t ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
                borderBottomColor: active === t ? 'var(--text-color-kumo-default)' : 'transparent',
                marginBottom: -1,
              }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-4 pb-1">
          {columns.map(c => (
            <span key={c} className="text-xs font-medium uppercase" style={{ color: 'var(--text-color-kumo-subtle)' }}>{c}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-col my-2" style={{ minHeight: 200 }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center px-3" style={{ height: 40 }}>
            <div className="w-full rounded-md" style={{ minHeight: 32, opacity: 0.5, background: 'var(--color-kumo-tint)' }} />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── metric tab button ─────────────────────────────────── */
function MetricTab({ label, active }: { label: string; active: boolean }) {
  return (
    <button type="button"
      className="flex flex-col gap-2 p-4 min-w-[220px] shrink-0 cursor-pointer border-0 border-b-2 focus:outline-none transition-colors"
      style={{
        background: active ? 'var(--color-kumo-base)' : 'var(--color-kumo-tint)',
        borderBottomColor: active ? 'var(--text-color-kumo-default)' : 'transparent',
        color: 'var(--text-color-kumo-default)',
      }}>
      <p className="text-xs font-medium" style={{ color: 'var(--text-color-kumo-subtle)', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</p>
      <div className="w-[105px] h-8 rounded-md" style={{ background: 'var(--color-kumo-tint)', opacity: 0.7 }} />
    </button>
  )
}

/* ── web analytics chart (demo) ────────────────────────── */
const WA_DATES = ['Jul 25','Jul 27','Jul 29','Jul 31','Aug 1','Aug 3','Aug 5','Aug 7','Aug 9','Aug 11','Aug 13']
const WA_PTS   = [4,3.5,2.5,7,5.5,8.5,9,10.5,10.5,8,14.5,15.5,17,20.5,18,17.5,16.5,10.5,25,27,24,27.5]

function WebAnalyticsChart() {
  const W = 928; const H = 400
  const PL = 60; const PR = 0; const PT = 25; const PB = 40
  const cW = W - PL - PR; const cH = H - PT - PB
  const max = 18000
  const nPts = WA_PTS.length
  const toX = (i: number) => PL + (i / (nPts - 1)) * cW
  const toY = (v: number) => PT + cH - (v / max) * cH * 1000
  const yTicks = [0, 5000, 10000, 15000]
  const xs = WA_PTS.map((_, i) => toX(i))
  const ys = WA_PTS.map(v => toY(v))
  const curve = buildCurve(xs, ys)
  const area = `${curve} L${toX(nPts-1).toFixed(2)},${(PT+cH).toFixed(2)} L${PL.toFixed(2)},${(PT+cH).toFixed(2)} Z`
  const xStep = Math.max(1, Math.floor((nPts - 1) / (WA_DATES.length - 1)))
  return (
    <div className="relative" style={{ height: 400 }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="wa-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(59,130,246)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(59,130,246)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {yTicks.map(v => {
          const y = PT + cH - (v / max) * cH
          return (
            <g key={v}>
              <line x1={PL} y1={y} x2={PL+cW} y2={y} stroke="var(--color-kumo-line)" strokeWidth="1" />
              <text x={PL-8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="12" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">
                {v === 0 ? '0' : v >= 1000 ? `${v/1000}K` : v}
              </text>
            </g>
          )
        })}
        <path d={area} fill="url(#wa-grad)" />
        <path d={curve} fill="none" stroke="rgb(59,130,246)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
        {WA_DATES.map((lbl, i) => (
          <text key={i} x={toX(Math.min(i * xStep, nPts-1))} y={PT+cH+20} textAnchor="middle" fontSize="12" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{lbl}</text>
        ))}
        <line x1={PL} y1={PT+cH} x2={PL+cW} y2={PT+cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      </svg>
      <div className="absolute right-6 top-2 rounded-md px-1.5 py-0.5 text-xs font-medium"
        style={{ background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)' }}>
        Demo Data
      </div>
    </div>
  )
}

/* ── performance mock data ───────────────────────────── */
const perfTTFB     = [120,115,130,118,125,140,135,128,122,119,132,145,138,126,121,118,130,142,136,124,120,117,129,141,135,123,119,116,128,140]
const perfOrigin   = [280,265,290,272,285,310,298,276,268,262,288,315,302,274,266,260,284,308,296,270,264,258,282,312,300,272,264,256,280,308]
const perfCached   = [18,16,20,17,19,22,21,18,17,16,20,23,22,18,17,16,20,22,21,18,17,15,19,22,21,17,16,15,19,21]
const perfP95      = [380,360,400,372,385,420,408,376,368,360,392,425,412,374,366,358,388,418,406,370,362,356,386,422,410,372,362,354,384,416]
const perfErrRate  = [0.2,0.1,0.3,0.1,0.2,0.4,0.3,0.2,0.1,0.1,0.2,0.5,0.4,0.2,0.1,0.1,0.2,0.4,0.3,0.2,0.1,0.1,0.2,0.4,0.3,0.2,0.1,0.1,0.2,0.3].map(v => v * 10)
const perfCacheHit = [88,90,87,91,89,85,86,90,92,91,88,84,85,90,92,93,89,85,86,91,92,93,89,85,86,90,93,94,90,86]
const perfCacheMiss= perfCacheHit.map(v => 100 - v)

const cwvBars = [
  { label: 'Good',         value: 68, color: 'rgb(34,197,94)'  },
  { label: 'Needs Improv', value: 22, color: 'rgb(234,179,8)'  },
  { label: 'Poor',         value: 10, color: 'rgb(239,68,68)'  },
]
const cacheSlices = [
  { color: 'rgb(34,197,94)',  pct: 88 },
  { color: 'rgb(239,68,68)',  pct: 8  },
  { color: 'rgb(234,179,8)',  pct: 4  },
]
const topSlowPaths = [
  { label: '/api/v1/reports',       value: '842 ms' },
  { label: '/api/v1/analytics',     value: '631 ms' },
  { label: '/dashboard/compute',    value: '524 ms' },
  { label: '/api/v1/users/search',  value: '418 ms' },
  { label: '/api/v1/export',        value: '392 ms' },
]
const topSlowOrigins = [
  { label: 'api.example.com',       value: '612 ms' },
  { label: 'app.example.com',       value: '388 ms' },
  { label: 'cdn.example.com',       value: '142 ms' },
]
const topCacheStatus = [
  { label: 'HIT',     value: '88%' },
  { label: 'MISS',    value: '8%'  },
  { label: 'EXPIRED', value: '3%'  },
  { label: 'BYPASS',  value: '1%'  },
]
const topEdgeLocs = [
  { label: 'Frankfurt (FRA)',   value: '0' },
  { label: 'Ashburn (IAD)',     value: '0' },
  { label: 'Singapore (SIN)',   value: '0' },
  { label: 'London (LHR)',      value: '0' },
  { label: 'São Paulo (GRU)',   value: '0' },
]

function PerformanceSection() {
  const [metricTab, setMetricTab] = useState(0)
  const metrics = ['Visitors', 'Page Views', 'Bounce Rate']

  return (
    <div style={{ background: 'var(--color-kumo-canvas)' }}>

      {/* ── header ── */}
      <div className="border-b" style={{ borderColor: 'var(--color-kumo-line)', marginBottom: '3rem' }}>
        <div className="px-6 py-10 flex flex-col gap-6">

          {/* title + description */}
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-medium" style={{ color: 'var(--text-color-kumo-default)' }}>Web Analytics</h1>
            <div className="flex flex-col gap-8">
              <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>
                Collect valuable insights on user behavior and site performance with detailed page view metrics. Gain knowledge on top pages.{' '}
                <a href="#" className="inline-flex items-center gap-0.5 text-sm" style={{ color: 'var(--color-kumo-brand)' }}>
                  Learn more
                  <svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor">
                    <path fillRule="evenodd" d="M11.5 9.75v1.5q-.02.23-.25.25h-6.5a.25.25 0 0 1-.25-.25v-6.5c0-.14.11-.25.25-.25H7V3H4.75C3.78 3 3 3.78 3 4.75v6.5c0 .97.78 1.75 1.75 1.75h6.5c.97 0 1.75-.78 1.75-1.75V9h-1.5zM8.5 3h3.75c.41 0 .75.34.75.75V7.5h-1.5V5.56L8.53 8.53 8 9.06 6.94 8l.53-.53 2.97-2.97H8.5z" clipRule="evenodd" />
                  </svg>
                </a>
              </p>
              <div className="flex items-center gap-3">
                <button type="button"
                  className="enable-btn flex items-center justify-center rounded-md px-3 text-sm font-medium border-0 cursor-pointer transition-colors"
                  style={{ height: 36, minWidth: 120 }}>
                  Enable
                </button>
                <a href="#"
                  className="flex items-center gap-0.5 rounded-md px-3 text-sm font-medium no-underline transition-colors"
                  style={{ height: 36, color: 'var(--text-color-kumo-default)', background: 'transparent' }}>
                  Limits &amp; Pricing
                  <svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor">
                    <path fillRule="evenodd" d="M11.5 9.75v1.5q-.02.23-.25.25h-6.5a.25.25 0 0 1-.25-.25v-6.5c0-.14.11-.25.25-.25H7V3H4.75C3.78 3 3 3.78 3 4.75v6.5c0 .97.78 1.75 1.75 1.75h6.5c.97 0 1.75-.78 1.75-1.75V9h-1.5zM8.5 3h3.75c.41 0 .75.34.75.75V7.5h-1.5V5.56L8.53 8.53 8 9.06 6.94 8l.53-.53 2.97-2.97H8.5z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* feature cards scroller */}
          <div className="flex gap-4 overflow-x-auto pb-1 no-scrollbar">
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="M1 1v11.75C1 13.99 2 15 3.25 15H15v-1.5H3.25a.75.75 0 0 1-.75-.75V1zm13.3 5.01.51-.54-1.1-1.03-.5.55-3.23 3.43-2.27-2.27a1 1 0 0 0-1.42 0L4.22 8.22l-.53.53 1.06 1.06.53-.53L7 7.56l2.29 2.29a1 1 0 0 0 1.43-.03z" clipRule="evenodd" /></svg>}
              title="Real-time insights into your traffic"
              desc="Ensure smooth performance with real-time bandwidth analysis."
            />
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="M7.16 0 2.33 9.4l-.56 1.1H7c.14 0 .25.11.25.25V16h1.6l4.82-9.4.56-1.1H9a.25.25 0 0 1-.25-.25V0zM7 9H4.23l3.02-5.9v2.15C7.25 6.22 8.03 7 9 7h2.77l-3.02 5.9v-2.15C8.75 9.78 7.97 9 7 9" clipRule="evenodd" /></svg>}
              title="Deeper insights with custom events"
              desc="Track whatever is relevant for your website."
            />
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="M3.5 4.06v5.47c0 1.4.77 2.67 2.01 3.32L8 14.15l2.49-1.3a3.8 3.8 0 0 0 2.01-3.32V4.06l-1.07-.29a13 13 0 0 1-1.82-.6A4.5 4.5 0 0 1 8 2.06a4.5 4.5 0 0 1-1.61 1.11 13 13 0 0 1-2.28.73zM7.25 0q-.01.69-.37 1.06-.36.42-1.1.74a11 11 0 0 1-2.01.63c-.43.12-.88.23-1.26.36L2 2.96v6.57a5.3 5.3 0 0 0 2.81 4.65l2.84 1.48.35.19.35-.19 2.84-1.48A5.3 5.3 0 0 0 14 9.53V2.96l-.51-.17c-.38-.13-.83-.24-1.26-.36l-.4-.1q-.88-.23-1.62-.53a3 3 0 0 1-1.09-.74Q8.76.68 8.75 0z" clipRule="evenodd" /></svg>}
              title="Respects visitor privacy"
              desc="Web Analytics doesn't rely on cookies and doesn't store personal information."
            />
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" clipRule="evenodd" /></svg>}
              title="First-party, at the edge"
              desc="Data is collected through your own domain."
            />
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="m1.8 4.44.45.44.88-.88-.44-.44L1.63 2.5 2.7 1.44 3.13 1 2.25.12l-.44.44L.48 1.88a.87.87 0 0 0 0 1.24zM12 1h-.75v1.5h2.25v9.25c0 .97-.78 1.75-1.75 1.75h-7.5c-.97 0-1.75-.78-1.75-1.75v-5.5H1v5.5C1 13.55 2.46 15 4.25 15h7.5c1.8 0 3.25-1.46 3.25-3.25V1h-3M7.75 4.88l.44-.44 1.33-1.32a.87.87 0 0 0 0-1.24L8.19.56 7.75.12 6.87 1l.44.44L8.37 2.5 7.3 3.56 6.87 4zM4.13 3.9l-.1.62 1.24.2.1-.62.5-3 .1-.62-1.24-.2-.1.62z" clipRule="evenodd" /></svg>}
              title="Easy integration"
              desc="Start collecting data with one line of code. Supports all major frameworks."
            />
            <FeatureCard
              icon={<svg viewBox="0 0 16 16" height="16" width="16" fill="currentColor"><path fillRule="evenodd" d="M9 1.58A6.5 6.5 0 0 0 3.4 12.6l.53.53-1.06 1.06-.53-.53A8 8 0 0 1 9.97.24zm4.83 3.54a6.5 6.5 0 0 1-1.23 7.48l-.53.53 1.06 1.06.53-.53a8 8 0 0 0 1.15-9.87zM8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2m0 1.5a2.5 2.5 0 0 0 1.98-4.03l3.47-4.33a8 8 0 0 0-1.2-.91L8.76 5.6A2.5 2.5 0 1 0 8 10.5" clipRule="evenodd" /></svg>}
              title="Your site stays fast"
              desc="The light-weight tracking script is less than 5kb."
            />
          </div>
        </div>
      </div>

      {/* ── demo dashboard ── */}
      <div className="relative px-4 pb-8">
        <div className="max-h-[880px] overflow-y-hidden pt-px">
          <div className="flex flex-col gap-4 pb-8">

            {/* metric tabs + chart */}
            <div className="rounded-xl border shadow-xs overflow-hidden"
              style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>
              {/* metric tab row */}
              <div className="flex overflow-x-auto border-b divide-x"
                style={{ borderColor: 'var(--color-kumo-line)' }}>
                {metrics.map((m, i) => (
                  <button key={m} type="button" onClick={() => setMetricTab(i)}
                    className="flex flex-col gap-2 p-4 min-w-[220px] shrink-0 cursor-pointer border-0 border-b-2 focus:outline-none transition-colors"
                    style={{
                      background: metricTab === i ? 'var(--color-kumo-base)' : 'var(--color-kumo-tint)',
                      borderBottomColor: metricTab === i ? 'var(--text-color-kumo-default)' : 'transparent',
                    }}>
                    <p className="text-xs font-medium text-left" style={{ color: 'var(--text-color-kumo-subtle)' }}>{m}</p>
                    <div className="w-[105px] h-8 rounded-md" style={{ background: 'var(--color-kumo-line)', opacity: 0.6 }} />
                  </button>
                ))}
              </div>
              {/* chart */}
              <WebAnalyticsChart />
            </div>

            {/* row 1 — pages + referrers */}
            <div className="flex gap-4">
              <AnalyticsPanel tabs={['Pages', 'Routes', 'Hostnames']} columns={['Visitors']} />
              <AnalyticsPanel tabs={['Referrers', 'UTM Parameters']} columns={['Visitors']} />
            </div>

            {/* row 2 — countries + devices + OS */}
            <div className="flex gap-4">
              <AnalyticsPanelSm tabs={['Countries']} columns={['Visitors']} />
              <AnalyticsPanelSm tabs={['Devices', 'Browsers']} columns={['Visitors']} />
              <AnalyticsPanelSm tabs={['Operating Systems']} columns={['Visitors']} />
            </div>

            {/* row 3 — events + flags */}
            <div className="flex gap-4">
              <AnalyticsPanelSm tabs={['Events']} columns={['Visitors', 'Total']} />
              <div className="flex flex-1">
                <AnalyticsPanelSm tabs={['Flags']} columns={['Visitors', 'Total']} />
              </div>
            </div>

          </div>
        </div>

        {/* fade overlay */}
        <div className="absolute inset-0 -mt-6 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 0%, var(--color-kumo-canvas) 70%)' }} />
      </div>
    </div>
  )
}

/* ── page ─────────────────────────────────────────────── */
export default function AnalyticsPage() {
  const searchParams = useSearchParams()
  const tab = (searchParams.get('tab') ?? 'overview') as Tab

  return (
    <DashboardLayout>
      <main className="w-full h-full grow overflow-y-auto" style={{ background: 'var(--color-kumo-canvas)' }}>

        {/* tab bar */}
        <TabBar active={tab} />

        {/* overview content */}
        {tab === 'overview' && <>

        {/* title bar */}
        <div className="flex-1 flex flex-wrap items-start justify-between gap-3 py-3 px-3">
          <div className="flex items-center flex-1">
            <h1 className="inline-block pl-2 border border-dashed border-transparent text-xl font-semibold hover:cursor-pointer hover:rounded hover:border-(--color-kumo-line) hover:bg-(--color-kumo-tint)"
              style={{ color: 'var(--text-color-kumo-default)' }}>Traffic overview</h1>
          </div>
          <div className="shrink-0 flex items-center flex-wrap gap-2 pr-2">
            <Btn><Printer size={16} /><span>Print</span></Btn>
            <Btn><Link size={16} /><span>Copy link</span></Btn>
            <Btn emphasis><Plus size={16} /><span>Add a chart</span></Btn>
          </div>
        </div>

        {/* filter bar */}
        <header className="flex items-center justify-between gap-3 px-4 border-b sticky top-0 z-20"
          style={{ height: 'var(--header-height, 58px)', borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-elevated)' }}>
          <div className="flex items-center gap-2">
            <FBtn><Funnel size={16} />Add filter</FBtn>
          </div>
          <div className="inline-flex items-center gap-2">
            <FBtn><Play size={16} />Live refresh</FBtn>
            <DateRangeBtn />
          </div>
        </header>

        {/* grid */}
        <div className="py-2 px-2 flex flex-col gap-4">

          {/* row 1 — 4 stat cards */}
          <div className="grid grid-cols-4 gap-3">
            <StatCard label="Total Requests" value="0" />
            <StatCard label="Total Visits" value="0" />
            <StatCard label="Cache Hit Rate" value="0.00%" />
            <StatCard label="Data Transfer" value="0 B" />
          </div>

          {/* row 2 — requests over time */}
          <div className="rounded-xl border shadow-xs flex flex-col"
            style={{ background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)' }}>

            {/* chart header */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b shrink-0"
              style={{ borderColor: 'var(--color-kumo-line)' }}>
              <div>
                <div className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Requests over time</div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>Last 24 hours · 30-min intervals</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <Legend color="rgb(66,144,240)" label="Requests" value="0" />
                  <Legend color="rgb(141,88,238)" label="Cached" value="0" />
                </div>
                <button type="button" className="flex items-center justify-center rounded-md border-0 cursor-pointer bg-transparent transition-colors hover:bg-(--color-kumo-tint)"
                  style={{ width: 26, height: 26, color: 'var(--text-color-kumo-default)' }}>
                  <DotsThree size={16} weight="bold" />
                </button>
              </div>
            </div>

            {/* chart body */}
            <div className="px-2 pt-3 pb-1 flex items-center justify-center" style={{ height: 360 }}>
              <div className="flex flex-col gap-4 items-center w-full max-w-xs text-center py-8">
                <svg className="mx-auto opacity-60" width="178" height="90" viewBox="0 0 178 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="27" y="50.5" width="124" height="39" rx="7.5" fill="currentColor" style={{ color: 'var(--color-kumo-tint)' }} />
                  <rect x="27" y="50.5" width="124" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="34.5" y="58" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="66.5" y="61" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="66.5" y="73" width="77" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" fill="currentColor" style={{ color: 'var(--color-kumo-tint)' }} />
                  <rect x="19.5" y="28.5" width="139" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="27" y="36" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="59" y="39" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <rect x="59" y="51" width="92" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  <g filter="url(#filter1)">
                    <rect x="12" y="6" width="154" height="40" rx="8" fill="currentColor" style={{ color: 'var(--color-kumo-base)' }} shapeRendering="crispEdges" />
                    <rect x="12.5" y="6.5" width="153" height="39" rx="7.5" stroke="currentColor" style={{ color: 'var(--color-kumo-line)' }} shapeRendering="crispEdges" />
                    <rect x="20" y="14" width="24" height="24" rx="4" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                    <rect x="52" y="17" width="60" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                    <rect x="52" y="29" width="106" height="6" rx="3" fill="currentColor" style={{ color: 'var(--color-kumo-line)' }} />
                  </g>
                  <defs>
                    <filter id="filter1" x="0" y="0" width="178" height="64" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                      <feOffset dy="6" />
                      <feGaussianBlur stdDeviation="6" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0" />
                      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow" />
                      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape" />
                    </filter>
                  </defs>
                </svg>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>No data available</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-color-kumo-subtle)' }}>In the meantime, you can create new custom insights to monitor your most important metrics</p>
                </div>
                <button type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border px-3 text-xs font-medium transition-colors cursor-pointer focus:outline-none"
                  style={{ height: 32, background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', borderColor: 'var(--color-kumo-line)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" /><path d="M12 5v14" />
                  </svg>
                  Create insight
                </button>
              </div>
            </div>

            {/* chart footer — summary pills */}
            <div className="flex items-center gap-6 px-5 py-3 border-t" style={{ borderColor: 'var(--color-kumo-line)' }}>
              {[
                { label: 'Peak',    value: '30 req/min', color: 'rgb(66,144,240)' },
                { label: 'Average', value: '14 req/min', color: 'var(--text-color-kumo-subtle)' },
                { label: 'Total',   value: '0',          color: 'var(--text-color-kumo-subtle)' },
              ].map(({ label, value, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <span className="text-xs" style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
                  <span className="text-xs font-semibold tabular-nums" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* row 3 — device type (364px) + by country (364px) */}
          <div className="grid grid-cols-3 gap-4">
            <Shell title="Requests by device type" style={{ height: 364 }}>
              <div className="flex h-full flex-col gap-2">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <Legend color="rgb(66,144,240)" label="Desktop" value="0" />
                  <Legend color="rgb(238,183,32)" label="Mobile" value="0" />
                  <Legend color="rgb(232,100,157)" label="Tablet" value="0" />
                </div>
                <div className="relative min-h-0 flex-1 flex items-center justify-center">
                  <div className="w-44 h-44"><Donut slices={devSlices} /></div>
                </div>
              </div>
            </Shell>
            <div className="col-span-2">
              <Shell title="Requests by country" pad={false} style={{ height: 364 }}><NoData /></Shell>
            </div>
          </div>

          {/* row 4 — status codes */}
          <StatusCodesCard />

          {/* row 5 — top paths / hosts / IPs (440px each) */}
          <div className="grid grid-cols-3 gap-4">
            <Shell title="Top paths" pad={false} style={{ height: 440 }}><TopN items={topPaths} /></Shell>
            <Shell title="Top hosts" pad={false} style={{ height: 440 }}><TopN items={topHosts} /></Shell>
            <Shell title="Top client IPs" pad={false} style={{ height: 440 }}><TopN items={topIPs} /></Shell>
          </div>

          {/* row 6 — top browsers / OS / UA (440px each) */}
          <div className="grid grid-cols-3 gap-4">
            <Shell title="Top browsers" pad={false} style={{ height: 440 }}><TopN items={topBrowsers} /></Shell>
            <Shell title="Top operating systems" pad={false} style={{ height: 440 }}><TopN items={topOS} /></Shell>
            <Shell title="Top user agents" pad={false} style={{ height: 440 }}><TopN items={topUA} /></Shell>
          </div>

          {/* row 7 — top HTTP / cache / origin (440px each) */}
          <div className="grid grid-cols-3 gap-4">
            <Shell title="Top HTTP versions" pad={false} style={{ height: 440 }}><TopN items={[]} /></Shell>
            <Shell title="Top cache statuses" pad={false} style={{ height: 440 }}><TopN items={topCache} /></Shell>
            <Shell title="Top origin status codes" pad={false} style={{ height: 440 }}><TopN items={topOrigin} /></Shell>
          </div>

        </div>
        </> }
      </main>
    </DashboardLayout>
  )
}
