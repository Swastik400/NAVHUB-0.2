'use client'

import DashboardLayout from '@/components/dashboard-layout'

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage'    ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'performance'
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

/* ── helpers ── */
function buildCurve(xs: number[], ys: number[]) {
  return xs.reduce((acc, x, i) => {
    if (i === 0) return `M${x.toFixed(2)},${ys[i].toFixed(2)}`
    const px = xs[i - 1]; const cp = (x - px) * 0.42
    return `${acc} C${(px + cp).toFixed(2)},${ys[i - 1].toFixed(2)} ${(x - cp).toFixed(2)},${ys[i].toFixed(2)} ${x.toFixed(2)},${ys[i].toFixed(2)}`
  }, '')
}

function AreaChart({ series, yFmt = (v: number) => `${v}` }: {
  series: { label: string; color: string; points: number[] }[]
  yFmt?: (v: number) => string
}) {
  const W = 800; const H = 260
  const PL = 58; const PR = 16; const PT = 16; const PB = 36
  const cW = W - PL - PR; const cH = H - PT - PB
  const allVals = series.flatMap(s => s.points)
  const max = Math.max(...allVals, 1) * 1.1
  const nPts = series[0].points.length
  const toX = (i: number) => PL + (i / (nPts - 1)) * cW
  const toY = (v: number) => PT + cH - (v / max) * cH
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({ t, y: PT + cH * (1 - t), label: yFmt(Math.round(max * t)) }))
  const xLabels = [1, 5, 10, 15, 20, 25, 30].map(d => ({ x: toX(d - 1), label: `${d}` }))
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 260 }} preserveAspectRatio="xMidYMid meet">
      <defs>
        {series.map((s, si) => (
          <linearGradient key={si} id={`pg${si}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {yTicks.map(({ t, y, label }) => (
        <g key={t}>
          <line x1={PL} y1={y} x2={PL + cW} y2={y} stroke="var(--color-kumo-line)" strokeWidth={t === 0 ? 1.5 : 1} strokeDasharray={t === 0 ? '0' : '3 5'} strokeOpacity={t === 0 ? 1 : 0.6} />
          <text x={PL - 6} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
        </g>
      ))}
      {series.map((s, si) => {
        const xs = s.points.map((_, i) => toX(i))
        const ys = s.points.map(v => toY(v))
        const curve = buildCurve(xs, ys)
        const area = `${curve} L${toX(nPts - 1).toFixed(2)},${(PT + cH).toFixed(2)} L${PL.toFixed(2)},${(PT + cH).toFixed(2)} Z`
        return (
          <g key={si}>
            <path d={area} fill={`url(#pg${si})`} />
            <path d={curve} fill="none" stroke={s.color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        )
      })}
      {xLabels.map(({ x, label }) => (
        <text key={label} x={x} y={PT + cH + 20} textAnchor="middle" fontSize="11" fontFamily="inherit" fill="var(--text-color-kumo-subtle)">{label}</text>
      ))}
      <line x1={PL} y1={PT + cH} x2={PL + cW} y2={PT + cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
      <line x1={PL} y1={PT} x2={PL} y2={PT + cH} stroke="var(--color-kumo-line)" strokeWidth="1.5" />
    </svg>
  )
}

function Legend({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span style={{ color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
    </div>
  )
}

function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '16px 20px', minHeight: 100, display: 'flex', flexDirection: 'column', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
      <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-color-kumo-subtle)' }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 600, lineHeight: 1, marginTop: 4, color: accent ?? 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{value}</span>
      {sub && <span style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>{sub}</span>}
    </div>
  )
}

/* ── demo data ── */
function pseudo(s: number) { return Math.sin(s * 127.1 + 311.7) * 0.5 + 0.5 }
const pts30 = (base: number, amp: number) => Array.from({ length: 30 }, (_, i) => Math.round(base + Math.sin(i / 4) * amp + pseudo(i) * amp * 0.6))

const p50Pts  = pts30(120, 30)
const p95Pts  = pts30(280, 60)
const p99Pts  = pts30(420, 90)
const errPts  = Array.from({ length: 30 }, (_, i) => parseFloat((0.2 + pseudo(i * 3) * 0.8).toFixed(2)))
const tputPts = pts30(340, 80)

const slowPaths = [
  { path: '/api/v1/reports',      p50: '842 ms', p95: '1.4 s', p99: '2.1 s' },
  { path: '/api/v1/analytics',    p50: '631 ms', p95: '980 ms', p99: '1.6 s' },
  { path: '/dashboard/compute',   p50: '524 ms', p95: '810 ms', p99: '1.2 s' },
  { path: '/api/v1/users/search', p50: '418 ms', p95: '640 ms', p99: '920 ms' },
  { path: '/api/v1/export',       p50: '392 ms', p95: '590 ms', p99: '840 ms' },
]

const regions = [
  { name: 'Frankfurt (FRA)', p50: '118 ms', p95: '260 ms', status: 'good' },
  { name: 'Ashburn (IAD)',   p50: '134 ms', p95: '298 ms', status: 'good' },
  { name: 'Singapore (SIN)', p50: '162 ms', p95: '340 ms', status: 'warn' },
  { name: 'London (LHR)',    p50: '122 ms', p95: '272 ms', status: 'good' },
  { name: 'São Paulo (GRU)', p50: '198 ms', p95: '420 ms', status: 'warn' },
]

export default function PerformancePage() {
  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', width: '100%' }}>

        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Performance</h1>
          <p style={{ fontSize: 14, color: 'var(--text-color-kumo-subtle)', marginTop: 6, marginBottom: 0 }}>Latency, throughput, and error rate across your API traffic.</p>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0 20px' }} />

        {/* Stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 20 }}>
          <StatCard label="P50 Latency"   value="124 ms" sub="↓ 8 ms vs last week" accent="rgb(34,197,94)" />
          <StatCard label="P95 Latency"   value="286 ms" sub="Last 30 days" />
          <StatCard label="P99 Latency"   value="438 ms" sub="Last 30 days" />
          <StatCard label="Throughput"    value="342 /s"  sub="Avg requests/sec" />
          <StatCard label="Error Rate"    value="0.41%"  sub="4xx + 5xx" accent="rgb(239,68,68)" />
        </div>

        {/* Latency over time */}
        <div style={{ ...card, gap: 0, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px 12px', borderBottom: '1px solid var(--color-kumo-line)' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Response latency over time</div>
              <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>Last 30 days · daily intervals · milliseconds</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <Legend color="rgb(34,197,94)"  label="P50" value="124 ms" />
              <Legend color="rgb(66,144,240)" label="P95" value="286 ms" />
              <Legend color="rgb(239,68,68)"  label="P99" value="438 ms" />
            </div>
          </div>
          <div style={{ padding: '8px 8px 4px' }}>
            <AreaChart
              series={[
                { label: 'P50', color: 'rgb(34,197,94)',  points: p50Pts },
                { label: 'P95', color: 'rgb(66,144,240)', points: p95Pts },
                { label: 'P99', color: 'rgb(239,68,68)',  points: p99Pts },
              ]}
              yFmt={v => `${v} ms`}
            />
          </div>
        </div>

        {/* Throughput + Error rate */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16, marginBottom: 20 }}>

          <div style={{ ...card, gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Throughput</div>
                <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>Requests per second</div>
              </div>
              <Legend color="rgb(141,88,238)" label="req/s" value="342" />
            </div>
            <AreaChart series={[{ label: 'Throughput', color: 'rgb(141,88,238)', points: tputPts }]} yFmt={v => `${v}`} />
          </div>

          <div style={{ ...card, gap: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Error rate</div>
                <div style={{ fontSize: 12, marginTop: 2, color: 'var(--text-color-kumo-subtle)' }}>4xx + 5xx responses (%)</div>
              </div>
              <Legend color="rgb(239,68,68)" label="error %" value="0.41%" />
            </div>
            <AreaChart series={[{ label: 'Error rate', color: 'rgb(239,68,68)', points: errPts }]} yFmt={v => `${v}%`} />
          </div>
        </div>

        {/* Slowest paths + Regional */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>

          <div style={{ ...card, gap: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', marginBottom: 12 }}>Slowest paths</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Path', 'P50', 'P95', 'P99'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textAlign: h === 'Path' ? 'left' : 'right', borderBottom: '1px solid var(--color-kumo-line)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slowPaths.map((r, i) => (
                  <tr key={i} onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', fontFamily: 'monospace', fontSize: 12, color: 'var(--text-color-kumo-default)' }}>{r.path}</td>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'right', color: 'var(--text-color-kumo-subtle)', fontVariantNumeric: 'tabular-nums' }}>{r.p50}</td>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'right', color: 'var(--text-color-kumo-subtle)', fontVariantNumeric: 'tabular-nums' }}>{r.p95}</td>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'right', fontWeight: 600, color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{r.p99}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ ...card, gap: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', marginBottom: 12 }}>Regional performance</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Region', 'P50', 'P95'].map(h => (
                    <th key={h} style={{ padding: '6px 10px', fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', textAlign: h === 'Region' ? 'left' : 'right', borderBottom: '1px solid var(--color-kumo-line)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regions.map((r, i) => (
                  <tr key={i} onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')} onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: r.status === 'good' ? 'rgb(34,197,94)' : 'rgb(234,179,8)' }} />
                        {r.name}
                      </div>
                    </td>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'right', color: 'var(--text-color-kumo-subtle)', fontVariantNumeric: 'tabular-nums' }}>{r.p50}</td>
                    <td style={{ padding: '9px 10px', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'right', fontWeight: 600, color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{r.p95}</td>
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

const card: React.CSSProperties = {
  background: 'var(--color-kumo-base)', borderRadius: 12,
  boxShadow: '0 0 0 1px var(--color-kumo-line)', padding: '1.25rem',
  display: 'flex', flexDirection: 'column', gap: 12,
}
