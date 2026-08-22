'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { BookOpen, Export, CaretLeft, CaretRight, Info } from '@phosphor-icons/react'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const now = new Date()

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage' ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'cost'
        return (
          <a key={tab} href={href} className="relative px-3 py-2.5 text-sm font-medium no-underline transition-colors"
            style={{
              color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              borderBottom: isActive ? '2px solid var(--color-kumo-brand)' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap',
            }}>
            {tab === 'rate-limits' ? 'Rate limits' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        )
      })}
    </div>
  )
}

function FilterSelect({ label, value }: { label: string; value: string }) {
  return (
    <div style={filterBox}>
      <span style={{ color: 'var(--text-color-kumo-subtle)', fontSize: 13, flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)' }}>{value}</span>
      <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0, opacity: 0.6 }}>
        <path d="M0 0l5 6 5-6z" />
      </svg>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div style={card}>
      <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)' }}>{title}</span>
      <div style={{ marginTop: 'auto' }}>
        <span style={{ fontSize: '1.875rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', letterSpacing: '-0.02em' }}>{value}</span>
      </div>
    </div>
  )
}

// ── demo data ──────────────────────────────────────────
const MODELS_COST = ['Osmium AI / Nexus 5', 'Aegis Auth / Apex 5', 'LM Lens / Core 5', 'Natraj / Swift 4']
const MODEL_RATES = [0.000015, 0.000025, 0.000010, 0.000008] // $ per token

function makeDailyPoints(days: number) {
  return Array.from({ length: days }, (_, i) => {
    const base = 0.8 + Math.sin(i / 3) * 0.4 + (Math.sin(i * 127.1 + 311.7) * 0.5 + 0.5) * 0.6
    return parseFloat(base.toFixed(4))
  })
}

const DAYS_IN_MONTH = 30
const DAILY_COSTS = makeDailyPoints(DAYS_IN_MONTH)
const TOTAL_COST = DAILY_COSTS.reduce((a, b) => a + b, 0)
const TOKEN_COST = TOTAL_COST * 0.91
const WEB_COST   = TOTAL_COST * 0.04
const CODE_COST  = TOTAL_COST * 0.03
const SESSION_COST = TOTAL_COST * 0.02

function fmt(n: number) { return '$' + n.toFixed(2) }

// ── bar chart ───────────────────────────────────────────
function buildCurve(xs: number[], ys: number[]) {
  return xs.reduce((acc, x, i) => {
    if (i === 0) return `M${x.toFixed(2)},${ys[i].toFixed(2)}`
    const px = xs[i-1]; const py = ys[i-1]; const cp = (x - px) * 0.4
    return `${acc} C${(px+cp).toFixed(2)},${py.toFixed(2)} ${(x-cp).toFixed(2)},${ys[i].toFixed(2)} ${x.toFixed(2)},${ys[i].toFixed(2)}`
  }, '')
}

function CostChart({ points, monthIdx, year }: { points: number[]; monthIdx: number; year: number }) {
  const W = 800; const H = 260
  const PL = 52; const PR = 16; const PT = 16; const PB = 36
  const cW = W - PL - PR; const cH = H - PT - PB
  const max = Math.max(...points) * 1.15
  const nPts = points.length
  const toX = (i: number) => PL + (i / (nPts - 1)) * cW
  const toY = (v: number) => PT + cH - (v / max) * cH
  const xs = points.map((_, i) => toX(i))
  const ys = points.map(v => toY(v))
  const curve = buildCurve(xs, ys)
  const area = `${curve} L${toX(nPts-1).toFixed(2)},${(PT+cH).toFixed(2)} L${PL.toFixed(2)},${(PT+cH).toFixed(2)} Z`
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ t, y: PT + cH * (1-t), label: '$' + (max * t).toFixed(2) }))
  const xLabels = [1, 5, 10, 15, 20, 25, 30].map(d => ({ x: toX(d - 1), label: `${d}` }))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="cost-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(66,144,240)" stopOpacity="0.18" />
          <stop offset="100%" stopColor="rgb(66,144,240)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {yTicks.map(({ t, y, label }) => (
        <g key={t}>
          <line x1={PL} y1={y} x2={PL+cW} y2={y} stroke="var(--color-kumo-line)" strokeWidth={t===0?1.5:1} strokeDasharray={t===0?'0':'3 5'} strokeOpacity={t===0?1:0.6} />
          <text x={PL-6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
        </g>
      ))}
      <path d={area} fill="url(#cost-grad)" />
      <path d={curve} fill="none" stroke="rgb(66,144,240)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      {xLabels.map(({ x, label }) => (
        <text key={label} x={x} y={PT+cH+20} textAnchor="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
      ))}
      <line x1={PL} y1={PT+cH} x2={PL+cW} y2={PT+cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      <line x1={PL} y1={PT} x2={PL} y2={PT+cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
    </svg>
  )
}

// ── model breakdown table ───────────────────────────────
function ModelBreakdown() {
  const rows = MODELS_COST.map((m, i) => {
    const tokens = [148320, 97540, 203810, 61200][i % 4]
    const cost = tokens * MODEL_RATES[i]
    return { model: m, tokens, cost }
  })
  const total = rows.reduce((a, r) => a + r.cost, 0)
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13 }}>
        <thead>
          <tr>
            {['Model', 'Tokens used', 'Cost'].map(h => (
              <th key={h} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textAlign: h === 'Model' ? 'left' : 'right', borderBottom: '1px solid var(--color-kumo-line)', whiteSpace: 'nowrap' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)' }}>{r.model}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-subtle)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{r.tokens.toLocaleString()}</td>
              <td style={{ padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', textAlign: 'right', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{fmt(r.cost)}</td>
            </tr>
          ))}
          <tr>
            <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Total</td>
            <td />
            <td style={{ padding: '10px 12px', fontWeight: 600, color: 'var(--text-color-kumo-default)', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{fmt(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default function CostPage() {
  const [monthIdx, setMonthIdx] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())

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

  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', width: '100%' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Cost</h1>
            <p style={{ fontSize: 14, color: 'var(--text-color-kumo-subtle)', marginTop: 6, marginBottom: 0 }}>Cost of your organization's usage over time.</p>
          </div>
          <a href="#" aria-label="View documentation" title="View documentation" style={iconBtn}>
            <BookOpen size={20} />
          </a>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0' }} />

        {/* Info banner */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 10, background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)', marginBottom: 16, fontSize: 13, color: 'var(--text-color-kumo-default)' }}>
          <Info size={18} style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0, marginTop: 1 }} />
          <span style={{ flex: 1 }}>Costs from service accounts are only shown when grouping by service account.</span>
          <button type="button" style={{ ...iconBtn, width: 'auto', height: 'auto', padding: '2px 10px', fontSize: 13, background: 'var(--color-kumo-tint)', borderRadius: 6, boxShadow: '0 0 0 1px var(--color-kumo-line)', whiteSpace: 'nowrap' }}>
            Group by service account
          </button>
        </div>

        {/* Sticky filter bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-kumo-canvas)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <FilterSelect label="Workspace" value="All" />
              <FilterSelect label="API key" value="All" />
              <FilterSelect label="Model" value="All" />
              {/* Month navigator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 2, height: 36, background: 'var(--color-kumo-base)', borderRadius: 8, boxShadow: '0 0 0 1px var(--color-kumo-line)', padding: '0 2px' }}>
                <button type="button" onClick={prev} style={navBtn} aria-label="Previous month"><CaretLeft size={15} /></button>
                <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)', padding: '0 6px', whiteSpace: 'nowrap' }}>
                  {MONTHS[monthIdx]} {year}
                </span>
                <button type="button" onClick={next} disabled={isCurrentMonth} style={{ ...navBtn, opacity: isCurrentMonth ? 0.3 : 1 }} aria-label="Next month"><CaretRight size={15} /></button>
              </div>
              <div style={{ width: 1, height: 16, background: 'var(--color-kumo-line)' }} />
              <FilterSelect label="Group by" value="Model" />
            </div>
            <button type="button" style={iconBtn} aria-label="Export" title="Export">
              <Export size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Stat cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
            <StatCard title="Total cost" value={fmt(TOTAL_COST)} />
            <StatCard title="Total token cost" value={fmt(TOKEN_COST)} />
            <StatCard title="Total web search cost" value={fmt(WEB_COST)} />
            <StatCard title="Total code execution cost" value={fmt(CODE_COST)} />
            <StatCard title="Total session runtime cost" value={fmt(SESSION_COST)} />
          </div>

          {/* Daily token cost chart */}
          <div style={{ ...card, gap: 0 }}>
            <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Daily token cost</h2>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', marginTop: 4, marginBottom: 16, opacity: 0.7 }}>Includes token usage from both API and Console</p>
            <CostChart points={DAILY_COSTS} monthIdx={monthIdx} year={year} />
          </div>

          {/* Model breakdown */}
          <div style={{ ...card, gap: 0 }}>
            <h2 style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0, marginBottom: 12 }}>Cost by model</h2>
            <ModelBreakdown />
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

const card: React.CSSProperties = {
  background: 'var(--color-kumo-base)',
  borderRadius: 12,
  boxShadow: '0 0 0 1px var(--color-kumo-line)',
  padding: '1.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  minHeight: 120,
}
const filterBox: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 36, padding: '0 10px', borderRadius: 8, cursor: 'pointer',
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
