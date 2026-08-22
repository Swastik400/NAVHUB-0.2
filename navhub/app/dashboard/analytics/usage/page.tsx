'use client'

import { useState, useRef, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { BookOpen, Export, CaretLeft, CaretRight, Check } from '@phosphor-icons/react'

const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December']
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const now = new Date()

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

// ── deterministic data helpers ─────────────────────────────────────────────
const MODELS_USAGE = ['Osmium AI', 'Aegis Auth', 'LM Lens', 'Natraj']
const MODEL_COLORS = ['rgb(66,144,240)', 'rgb(141,88,238)', 'rgb(34,197,94)', 'rgb(238,183,32)']
const WORKSPACES   = ['All', 'Default', 'Production', 'Staging']
const VIEW_BY_OPTS = ['Month', 'Week', 'Day']
const GROUP_BY_OPTS = ['Model', 'API key', 'Workspace']

function pseudo(seed: number) { return Math.sin(seed * 127.1 + 311.7) * 0.5 + 0.5 }

function genPoints(days: number, mi: number) {
  return Array.from({ length: days }, (_, i) => ({
    in:  Math.round(80000 + Math.sin(i / 3 + mi) * 30000 + pseudo(i * 4 + mi) * 40000),
    out: Math.round(18000 + Math.sin(i / 4 + mi) * 6000  + pseudo(i * 7 + mi) * 10000),
  }))
}

// pre-generate 30 days per model — used as base; workspace/model filters scale it
const BASE_DATA = MODELS_USAGE.map((_, mi) => genPoints(30, mi))

function fmtK(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return n.toString()
}

// workspace multipliers (deterministic)
const WS_SCALE: Record<string, number[]> = {
  All:        [1,    1,    1,    1   ],
  Default:    [0.55, 0.60, 0.50, 0.65],
  Production: [0.30, 0.25, 0.35, 0.20],
  Staging:    [0.15, 0.15, 0.15, 0.15],
}

// ── chart ──────────────────────────────────────────────────────────────────
function buildCurve(xs: number[], ys: number[]) {
  return xs.reduce((acc, x, i) => {
    if (i === 0) return `M${x.toFixed(2)},${ys[i].toFixed(2)}`
    const px = xs[i-1]; const cp = (x - px) * 0.4
    return `${acc} C${(px+cp).toFixed(2)},${ys[i-1].toFixed(2)} ${(x-cp).toFixed(2)},${ys[i].toFixed(2)} ${x.toFixed(2)},${ys[i].toFixed(2)}`
  }, '')
}

function TokenChart({ data, models, viewBy, monthIdx, year }: {
  data: { in: number; out: number }[][]
  models: string[]
  viewBy: string
  monthIdx: number
  year: number
}) {
  const W = 800; const H = 260
  const PL = 62; const PR = 16; const PT = 16; const PB = 36
  const cW = W - PL - PR; const cH = H - PT - PB
  const nPts = data[0]?.length ?? 1

  const maxVal = Math.max(...data.map((pts, mi) =>
    pts.map((_, i) => data.slice(0, mi + 1).reduce((a, s) => a + s[i].in, 0))
  ).flat(), 1) * 1.1

  const toX = (i: number) => PL + (i / Math.max(nPts - 1, 1)) * cW
  const toY = (v: number) => PT + cH - (v / maxVal) * cH

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    t, y: PT + cH * (1 - t), label: fmtK(Math.round(maxVal * t)),
  }))

  // x-axis labels depend on view
  const xLabels: { x: number; label: string }[] = viewBy === 'Day'
    ? Array.from({ length: Math.min(nPts, 24) }, (_, i) => ({ x: toX(i), label: `${i}:00` })).filter((_, i) => i % 3 === 0)
    : viewBy === 'Week'
    ? ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => ({ x: toX(i), label: d }))
    : [1,5,10,15,20,25,30].map(d => ({ x: toX(d - 1), label: `${d}` }))

  const activeColors = models.map(m => MODEL_COLORS[MODELS_USAGE.indexOf(m)])

  return (
    <div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginBottom: 12 }}>
        {models.map((m, i) => (
          <div key={m} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-color-kumo-subtle)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: activeColors[i], flexShrink: 0 }} />
            {m}
          </div>
        ))}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }} preserveAspectRatio="xMidYMid meet">
        <defs>
          {models.map((_, i) => (
            <linearGradient key={i} id={`ug${i}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={activeColors[i]} stopOpacity="0.2" />
              <stop offset="100%" stopColor={activeColors[i]} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {yTicks.map(({ t, y, label }) => (
          <g key={t}>
            <line x1={PL} y1={y} x2={PL+cW} y2={y} stroke="var(--color-kumo-line)" strokeWidth={t===0?1.5:1} strokeDasharray={t===0?'0':'3 5'} strokeOpacity={t===0?1:0.6} />
            <text x={PL-6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
          </g>
        ))}
        {data.map((pts, mi) => {
          const xs = pts.map((_, i) => toX(i))
          const ys = pts.map((_, i) => toY(data.slice(0, mi + 1).reduce((a, s) => a + s[i].in, 0)))
          const curve = buildCurve(xs, ys)
          const area = `${curve} L${toX(nPts-1).toFixed(2)},${(PT+cH).toFixed(2)} L${PL.toFixed(2)},${(PT+cH).toFixed(2)} Z`
          return (
            <g key={mi}>
              <path d={area} fill={`url(#ug${mi})`} />
              <path d={curve} fill="none" stroke={activeColors[mi]} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
            </g>
          )
        })}
        {xLabels.map(({ x, label }) => (
          <text key={label} x={x} y={PT+cH+20} textAnchor="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
        ))}
        <line x1={PL} y1={PT+cH} x2={PL+cW} y2={PT+cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
        <line x1={PL} y1={PT} x2={PL} y2={PT+cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      </svg>
    </div>
  )
}

// ── dropdown ───────────────────────────────────────────────────────────────
function Dropdown({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function h(e: MouseEvent) { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button type="button" onClick={() => setOpen(o => !o)} style={filterBox}>
        <span style={{ color: 'var(--text-color-kumo-subtle)', fontSize: 13, flexShrink: 0 }}>{label}</span>
        <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)' }}>{value}</span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0, opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <path d="M0 0l5 6 5-6z" />
        </svg>
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line), 0 8px 24px rgba(0,0,0,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 50, minWidth: 140 }}>
          {options.map(opt => (
            <button key={opt} type="button" onClick={() => { onChange(opt); setOpen(false) }}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '8px 12px', border: 'none', cursor: 'pointer', fontSize: 13, background: opt === value ? 'var(--color-kumo-tint)' : 'transparent', color: 'var(--text-color-kumo-default)', fontWeight: opt === value ? 600 : 400, gap: 8 }}>
              {opt}
              {opt === value && <Check size={14} style={{ color: 'var(--color-kumo-brand)', flexShrink: 0 }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ── tab bar ────────────────────────────────────────────────────────────────
function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href = tab === 'overview' ? '/dashboard/analytics' : tab === 'usage' ? '/dashboard/analytics/usage' : `/dashboard/analytics/${tab}`
        const isActive = tab === 'usage'
        return (
          <a key={tab} href={href} className="relative px-3 py-2.5 text-sm font-medium no-underline transition-colors"
            style={{ color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)', borderBottom: isActive ? '2px solid var(--color-kumo-brand)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' }}>
            {tab === 'rate-limits' ? 'Rate limits' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        )
      })}
    </div>
  )
}

// ── page ───────────────────────────────────────────────────────────────────
export default function UsagePage() {
  const [monthIdx, setMonthIdx] = useState(now.getMonth())
  const [year, setYear]         = useState(now.getFullYear())
  const [workspace, setWorkspace] = useState('All')
  const [viewBy, setViewBy]       = useState('Month')
  const [modelFilter, setModelFilter] = useState('All')
  const [apiKey, setApiKey]           = useState('All')
  const [groupBy, setGroupBy]         = useState('Model')

  const isCurrentMonth = monthIdx === now.getMonth() && year === now.getFullYear()

  function prev() {
    if (monthIdx === 0) { setMonthIdx(11); setYear(y => y - 1) }
    else setMonthIdx(m => m - 1)
  }
  function next() {
    if (isCurrentMonth) return
    if (monthIdx === 11) { setMonthIdx(0); setYear(y => y + 1) }
    else setMonthIdx(m => m + 1)
  }

  // derive active models from filter
  const activeModels = modelFilter === 'All' ? MODELS_USAGE : [modelFilter]
  const wsScale = WS_SCALE[workspace] ?? WS_SCALE['All']

  // scale data by workspace + model filter
  const filteredData = MODELS_USAGE
    .map((m, mi) => ({ m, mi, pts: BASE_DATA[mi].map(p => ({ in: Math.round(p.in * wsScale[mi]), out: Math.round(p.out * wsScale[mi]) })) }))
    .filter(({ m }) => modelFilter === 'All' || m === modelFilter)

  // for view-by week: aggregate into 7 days; for day: use 24 hours (simulate)
  function getViewData(pts: { in: number; out: number }[]) {
    if (viewBy === 'Week') {
      return Array.from({ length: 7 }, (_, d) => ({
        in:  pts.slice(d*4, d*4+4).reduce((a,b)=>a+b.in,0),
        out: pts.slice(d*4, d*4+4).reduce((a,b)=>a+b.out,0),
      }))
    }
    if (viewBy === 'Day') {
      return Array.from({ length: 24 }, (_, h) => ({
        in:  Math.round(pts[h % pts.length].in / 24),
        out: Math.round(pts[h % pts.length].out / 24),
      }))
    }
    return pts
  }

  const chartData = filteredData.map(({ pts }) => getViewData(pts))
  const totalIn   = filteredData.reduce((a, { pts }) => a + pts.reduce((s,p)=>s+p.in,0), 0)
  const totalOut  = filteredData.reduce((a, { pts }) => a + pts.reduce((s,p)=>s+p.out,0), 0)
  const searches  = workspace === 'All' ? 1284 : workspace === 'Default' ? 706 : workspace === 'Production' ? 384 : 194

  function handleExport() {
    const rows = [['Model','Input Tokens','Output Tokens','Total']]
    filteredData.forEach(({ m, pts }) => {
      const inp = pts.reduce((a,p)=>a+p.in,0)
      const out = pts.reduce((a,p)=>a+p.out,0)
      rows.push([m, inp.toString(), out.toString(), (inp+out).toString()])
    })
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    a.download = `usage-${MONTHS_SHORT[monthIdx]}-${year}.csv`
    a.click()
  }

  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', width: '100%' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Usage</h1>
            <p style={{ fontSize: 14, color: 'var(--text-color-kumo-subtle)', marginTop: 6, marginBottom: 0 }}>Token usage across your organization over time.</p>
          </div>
          <a href="#" aria-label="View documentation" title="View documentation" style={iconBtn}>
            <BookOpen size={20} />
          </a>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0' }} />

        {/* Sticky filter bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-kumo-canvas)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>

              <Dropdown label="Workspace" value={workspace} options={WORKSPACES} onChange={setWorkspace} />
              <Dropdown label="View by" value={viewBy} options={VIEW_BY_OPTS} onChange={v => { setViewBy(v) }} />

              {/* Month navigator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 36, background: 'var(--color-kumo-base)', borderRadius: 8, boxShadow: '0 0 0 1px var(--color-kumo-line)', padding: '0 2px' }}>
                <button type="button" onClick={prev} style={navBtn} aria-label="Previous period"><CaretLeft size={15} /></button>
                <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)', padding: '0 6px', whiteSpace: 'nowrap' }}>
                  {viewBy === 'Day' ? `${MONTHS_SHORT[monthIdx]} ${now.getDate()}, ${year}` : `${MONTHS_SHORT[monthIdx]} ${year}`}
                </span>
                <button type="button" onClick={next} disabled={isCurrentMonth} style={{ ...navBtn, opacity: isCurrentMonth ? 0.3 : 1 }} aria-label="Next period"><CaretRight size={15} /></button>
              </div>

            </div>
            <button type="button" onClick={handleExport} style={iconBtn} aria-label="Export" title="Export CSV">
              <Export size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            <div style={card}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)' }}>Total tokens in</span>
              <div style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', letterSpacing: '-0.02em' }}>{fmtK(totalIn)}</span>
              </div>
            </div>
            <div style={card}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)' }}>Total tokens out</span>
              <div style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', letterSpacing: '-0.02em' }}>{fmtK(totalOut)}</span>
              </div>
            </div>
            <div style={card}>
              <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)' }}>Total web searches</span>
              <div style={{ marginTop: 'auto' }}>
                <span style={{ fontSize: '1.875rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', letterSpacing: '-0.02em' }}>{searches.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Token usage chart */}
          <div style={{ ...card, gap: 0 }}>
            <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', margin: 0 }}>Token usage</h2>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', marginTop: 4, marginBottom: 16, opacity: 0.7 }}>Includes usage from both API and Console</p>

            {/* Chart filters */}
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Dropdown label="API key" value={apiKey} options={['All','key_prod_1','key_prod_2','key_staging']} onChange={setApiKey} />
              <Dropdown label="Model" value={modelFilter} options={['All', ...MODELS_USAGE]} onChange={setModelFilter} />
              <div style={{ width: 1, height: 16, background: 'var(--color-kumo-line)' }} />
              <Dropdown label="Group by" value={groupBy} options={GROUP_BY_OPTS} onChange={setGroupBy} />
            </div>

            <TokenChart
              data={chartData}
              models={activeModels.filter(m => filteredData.some(d => d.m === m))}
              viewBy={viewBy}
              monthIdx={monthIdx}
              year={year}
            />
          </div>

          {/* Model breakdown table */}
          <div style={{ ...card, gap: 0 }}>
            <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', margin: 0, marginBottom: 12 }}>
              Usage by {groupBy.toLowerCase()}
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
                <thead>
                  <tr>
                    {[groupBy, 'Input tokens', 'Output tokens', 'Total tokens'].map(h => (
                      <th key={h} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textAlign: h === groupBy ? 'left' : 'right', borderBottom: '1px solid var(--color-kumo-line)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(({ m, mi, pts }) => {
                    const inp = pts.reduce((a,p)=>a+p.in,0)
                    const out = pts.reduce((a,p)=>a+p.out,0)
                    return (
                      <tr key={m}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: MODEL_COLORS[mi], flexShrink: 0 }} />
                            {m}
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{inp.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{out.toLocaleString()}</td>
                        <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{(inp+out).toLocaleString()}</td>
                      </tr>
                    )
                  })}
                  <tr>
                    <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Total</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{totalIn.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{totalOut.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{(totalIn+totalOut).toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

const card: React.CSSProperties = {
  background: 'var(--color-kumo-base)', borderRadius: 12,
  boxShadow: '0 0 0 1px var(--color-kumo-line)', padding: '1.25rem',
  display: 'flex', flexDirection: 'column', gap: 12, minHeight: 120,
}
const filterBox: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 36, padding: '0 10px', borderRadius: 8, cursor: 'pointer', border: 'none',
  background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)',
  whiteSpace: 'nowrap',
}
const iconBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'transparent', color: 'var(--text-color-kumo-default)', textDecoration: 'none',
}
const navBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 28, height: 28, borderRadius: 6, border: 'none', cursor: 'pointer',
  background: 'transparent', color: 'var(--text-color-kumo-default)',
}
