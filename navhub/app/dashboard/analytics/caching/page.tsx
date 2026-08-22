'use client'

import DashboardLayout from '@/components/dashboard-layout'

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage' ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'caching'
        return (
          <a
            key={tab}
            href={href}
            className="relative px-3 py-2.5 text-sm font-medium capitalize no-underline transition-colors"
            style={{
              color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              borderBottom: isActive ? '2px solid var(--color-kumo-brand)' : '2px solid transparent',
              marginBottom: -1, whiteSpace: 'nowrap',
            }}
          >
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

function RangeDisplay({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ ...filterBox, cursor: 'default' }}>
      <span style={{ color: 'var(--text-color-kumo-subtle)', fontSize: 13 }}>{label}</span>
      <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)' }}>{value}</span>
    </div>
  )
}

/* ── stat card ── */
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{
      background: 'var(--color-kumo-base)', borderColor: 'var(--color-kumo-line)',
      border: '1px solid', borderRadius: 10, padding: 'clamp(0.75rem,3vw,1.25rem)', minHeight: 88,
      display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
    }}>
      <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span style={{ fontSize: 'clamp(1.25rem,5vw,1.75rem)', fontWeight: 600, lineHeight: 1, marginTop: 4, color: accent ?? 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {sub && <span style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>{sub}</span>}
    </div>
  )
}

/* ── legend ── */
function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span style={{ color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}

/* ── area chart ── */
function buildCurve(xs: number[], ys: number[]) {
  return xs.reduce((acc, x, i) => {
    if (i === 0) return `M${x.toFixed(2)},${ys[i].toFixed(2)}`
    const px = xs[i - 1]; const py = ys[i - 1]; const cp = (x - px) * 0.42
    return `${acc} C${(px + cp).toFixed(2)},${py.toFixed(2)} ${(x - cp).toFixed(2)},${ys[i].toFixed(2)} ${x.toFixed(2)},${ys[i].toFixed(2)}`
  }, '')
}

const TIME_LABELS = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7']

function AreaChart({ series }: { series: { label: string; color: string; points: number[] }[] }) {
  const W = 800; const H = 280
  const PL = 52; const PR = 20; const PT = 16; const PB = 40
  const cW = W - PL - PR; const cH = H - PT - PB
  const allVals = series.flatMap(s => s.points)
  const max = Math.max(...allVals, 1)
  const nPts = series[0].points.length
  const toX = (i: number) => PL + (i / (nPts - 1)) * cW
  const toY = (v: number) => PT + cH - (v / max) * cH
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    t, y: PT + cH * (1 - t),
    label: Math.round(max * t) >= 1000 ? `${(Math.round(max * t) / 1000).toFixed(0)}k` : String(Math.round(max * t)),
  }))
  const xStep = Math.max(1, Math.floor((nPts - 1) / (TIME_LABELS.length - 1)))
  const xTicks = TIME_LABELS.map((lbl, i) => ({ x: toX(Math.min(i * xStep, nPts - 1)), label: lbl }))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`cg${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {yTicks.map(({ t, y, label }) => (
        <g key={t}>
          <line x1={PL} y1={y} x2={PL + cW} y2={y} stroke="var(--color-kumo-line)" strokeWidth={t === 0 ? 1.5 : 1} strokeDasharray={t === 0 ? '0' : '3 5'} strokeOpacity={t === 0 ? 1 : 0.7} />
          <text x={PL - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
        </g>
      ))}
      {series.map((s, si) => {
        const xs = s.points.map((_, i) => toX(i))
        const ys = s.points.map(v => toY(v))
        const curve = buildCurve(xs, ys)
        const area = `${curve} L${toX(nPts - 1).toFixed(2)},${(PT + cH).toFixed(2)} L${PL.toFixed(2)},${(PT + cH).toFixed(2)} Z`
        return (
          <g key={si}>
            <path d={area} fill={`url(#cg${si})`} />
            <path d={curve} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        )
      })}
      {xTicks.map(({ x, label }, i) => (
        <text key={i} x={x} y={PT + cH + 16} textAnchor="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
      ))}
      <line x1={PL} y1={PT + cH} x2={PL + cW} y2={PT + cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
    </svg>
  )
}

/* ── donut ── */
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
    <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
      {arcs.map((a, i) => <path key={i} d={a.d} fill="none" stroke={a.color} strokeWidth={sw} strokeLinecap="butt" />)}
    </svg>
  )
}

/* ── demo data ── */
const hitPts  = [18200, 21400, 19800, 24600, 28100, 26300, 31200]
const missPts = [4100,  3800,  4400,  3600,  3200,  3900,  2800]
const savePts = [5460,  6420,  5940,  7380,  8430,  7890,  9360]

const cacheSlices = [
  { color: 'rgb(34,197,94)',  pct: 84 },
  { color: 'rgb(239,68,68)',  pct: 10 },
  { color: 'rgb(234,179,8)',  pct: 4  },
  { color: 'rgb(148,163,184)', pct: 2 },
]

const topModels = [
  { model: 'claude-3-5-sonnet-20241022', hits: '12,840', misses: '1,204', rate: '91.4%', saved: '$3.21' },
  { model: 'claude-3-5-haiku-20241022',  hits: '8,612',  misses: '980',   rate: '89.8%', saved: '$1.87' },
  { model: 'claude-3-opus-20240229',     hits: '5,230',  misses: '720',   rate: '87.9%', saved: '$2.64' },
  { model: 'claude-3-sonnet-20240229',   hits: '3,110',  misses: '540',   rate: '85.2%', saved: '$0.94' },
  { model: 'claude-3-haiku-20240307',    hits: '1,408',  misses: '356',   rate: '79.8%', saved: '$0.18' },
]

export default function CachingPage() {
  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(0.75rem,4vw,2rem)', width: '100%' }}>

        {/* Page header */}
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: 'clamp(1.1rem,4vw,1.375rem)', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Caching</h1>
          <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', marginTop: 4, marginBottom: 0 }}>
            Prompt caching activity from your API, Batch, Workbench, and Claude Code traffic.
          </p>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0' }} />

        {/* Sticky filter bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-kumo-canvas)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
              <FilterSelect label="Workspace" value="All" />
              <FilterSelect label="Model:" value="All" />
              <RangeDisplay label="Range" value="Last 7 days" />
              <div style={{ width: 1, height: 16, background: 'var(--color-kumo-line)' }} />
              <FilterSelect label="Group by" value="Model" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-color-kumo-subtle)', background: 'var(--color-kumo-tint)', borderRadius: 6, padding: '4px 10px' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgb(34,197,94)', display: 'inline-block' }} />
              Demo data
            </div>
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 10, marginBottom: 20 }}>
          <StatCard label="Cache Hit Rate"     value="84.2%"   sub="↑ 3.1% vs last week" accent="rgb(34,197,94)" />
          <StatCard label="Total Cache Hits"   value="31,200"  sub="Last 7 days" />
          <StatCard label="Total Cache Misses" value="5,880"   sub="Last 7 days" />
          <StatCard label="Estimated Savings"  value="$8.84"   sub="Input tokens saved" accent="rgb(66,144,240)" />
        </div>

        {/* Cache hits/misses over time */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, marginBottom: 20, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid var(--color-kumo-line)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Cache hits &amp; misses over time</div>
              <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>Last 7 days · daily intervals</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Legend color="rgb(34,197,94)"  label="Hits"   value="31,200" />
              <Legend color="rgb(239,68,68)"  label="Misses" value="5,880" />
              <Legend color="rgb(66,144,240)" label="Tokens saved" value="9,360" />
            </div>
          </div>
          <div style={{ padding: '8px 8px 4px', height: 280 }}>
            <AreaChart series={[
              { label: 'Hits',         color: 'rgb(34,197,94)',  points: hitPts  },
              { label: 'Misses',       color: 'rgb(239,68,68)',  points: missPts },
              { label: 'Tokens saved', color: 'rgb(66,144,240)', points: savePts },
            ]} />
          </div>
          <div style={{ display: 'flex', gap: 24, padding: '12px 20px', borderTop: '1px solid var(--color-kumo-line)' }}>
            {[
              { label: 'Peak hit rate', value: '91.4%',   color: 'rgb(34,197,94)' },
              { label: 'Avg hit rate',  value: '84.2%',   color: 'var(--text-color-kumo-subtle)' },
              { label: 'Total tokens',  value: '~2.1M',   color: 'var(--text-color-kumo-subtle)' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color, fontVariantNumeric: 'tabular-nums' }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cache status donut + top models table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 20 }}>

          {/* Donut */}
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>Cache status</div>
            <div style={{ width: 120, height: 120, margin: '0 auto 16px' }}>
              <Donut slices={cacheSlices} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { color: 'rgb(34,197,94)',   label: 'HIT',     pct: '84%' },
                { color: 'rgb(239,68,68)',   label: 'MISS',    pct: '10%' },
                { color: 'rgb(234,179,8)',   label: 'EXPIRED', pct: '4%'  },
                { color: 'rgb(148,163,184)', label: 'BYPASS',  pct: '2%'  },
              ].map(({ color, label, pct }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-color-kumo-subtle)', fontVariantNumeric: 'tabular-nums' }}>{pct}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top models table */}
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden', boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
            <div style={{ padding: '16px 20px 12px', borderBottom: '1px solid var(--color-kumo-line)' }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cache performance by model</div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-kumo-line)' }}>
                  {['Model', 'Hits', 'Misses', 'Hit rate', 'Est. savings'].map(h => (
                    <th key={h} style={{ padding: '8px 16px', textAlign: h === 'Model' ? 'left' : 'right', fontWeight: 500, color: 'var(--text-color-kumo-subtle)', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topModels.map((row, i) => (
                  <tr key={i} style={{ borderBottom: i < topModels.length - 1 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                    <td style={{ padding: '10px 16px', color: 'var(--text-color-kumo-default)', fontFamily: 'monospace', fontSize: 12 }}>{row.model}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'rgb(34,197,94)', fontVariantNumeric: 'tabular-nums' }}>{row.hits}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'rgb(239,68,68)', fontVariantNumeric: 'tabular-nums' }}>{row.misses}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', fontWeight: 600, color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{row.rate}</td>
                    <td style={{ padding: '10px 16px', textAlign: 'right', color: 'rgb(66,144,240)', fontVariantNumeric: 'tabular-nums' }}>{row.saved}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

const filterBox: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  height: 36, padding: '0 10px', borderRadius: 8, cursor: 'pointer',
  background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)',
  whiteSpace: 'nowrap',
}
