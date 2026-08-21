'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard-layout'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage' ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'logs'
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

const COLUMNS = ['Time', 'ID', 'Model', 'Input Tokens', 'Output Tokens', 'Type', 'Service Tier', 'Request']
const PAGE_SIZES = [10, 25, 50, 100]

const now = new Date()
const refreshTime = now.toLocaleString('en-US', {
  month: 'long', day: 'numeric', year: 'numeric',
  hour: 'numeric', minute: '2-digit', timeZoneName: 'shortOffset',
})

type LogRow = { time: string; id: string; model: string; inputTokens: number; outputTokens: number; type: string; serviceTier: string; request: string }

function makeId() { return 'msg_' + Math.random().toString(36).slice(2, 14) }
const MODELS = ['Osmium AI / Nexus 5', 'Aegis Auth / Apex 5', 'LM Lens / Core 5', 'Natraj / Swift 4']
const TYPES = ['message', 'message', 'message', 'batch']
const TIERS = ['standard', 'standard', 'priority', 'standard']
const REQUESTS = ['/v1/messages', '/v1/messages', '/v1/messages/batches', '/v1/messages']

function makeLog(minutesAgo: number): LogRow {
  const d = new Date(now.getTime() - minutesAgo * 60 * 1000)
  const mi = Math.floor(Math.random() * MODELS.length)
  return {
    time: d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    id: makeId(),
    model: MODELS[mi],
    inputTokens: Math.floor(Math.random() * 8000) + 200,
    outputTokens: Math.floor(Math.random() * 1200) + 50,
    type: TYPES[mi],
    serviceTier: TIERS[mi],
    request: REQUESTS[mi],
  }
}

const ALL_LOGS: LogRow[] = Array.from({ length: 47 }, (_, i) => makeLog(i * 3 + Math.floor(Math.random() * 3)))

function LogsContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const keyFilter = searchParams.get('key')

  const [pageSize, setPageSize] = useState(10)
  const [pageSizeOpen, setPageSizeOpen] = useState(false)
  const [page, setPage] = useState(1)

  const visibleLogs = keyFilter
    ? ALL_LOGS.filter((_, i) => i % 3 !== 2) // simulate key-specific subset
    : ALL_LOGS

  const totalPages = Math.ceil(visibleLogs.length / pageSize)
  const pageRows = visibleLogs.slice((page - 1) * pageSize, page * pageSize)

  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2rem', width: '100%', minWidth: 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8, marginBottom: keyFilter ? 12 : 16 }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Logs</h1>
          <span style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)' }}>
            Last refresh time: {refreshTime}
          </span>
        </div>

        {/* Key filter banner */}
        {keyFilter && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, padding: '8px 12px', borderRadius: 8, background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)', fontSize: 13 }}>
            <span style={{ color: 'var(--text-color-kumo-subtle)' }}>Filtered by key:</span>
            <span style={{ fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{keyFilter}</span>
            <button
              onClick={() => router.push('/dashboard/analytics/logs')}
              style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', height: 24, padding: '0 8px', borderRadius: 6, border: '1px solid var(--color-kumo-line)', background: 'var(--color-kumo-base)', cursor: 'pointer', fontSize: 11, fontWeight: 500, color: 'var(--text-color-kumo-subtle)' }}
            >
              ✕ Clear filter
            </button>
          </div>
        )}

        {/* Table */}
        <div style={{ overflowX: 'auto', margin: '0 -1px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13, whiteSpace: 'nowrap', tableLayout: 'auto' }}>
            <thead style={{ textAlign: 'left' }}>
              <tr>
                {COLUMNS.map(col => (
                  <th key={col} style={th}>
                    {col.includes(' ') ? (
                      <>{col.split(' ')[0]}<br />{col.split(' ').slice(1).join(' ')}</>
                    ) : col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row, i) => (
                <tr key={i}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={td}>{row.time}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-color-kumo-subtle)' }}>{row.id}</td>
                  <td style={td}>{row.model}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.inputTokens.toLocaleString()}</td>
                  <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>{row.outputTokens.toLocaleString()}</td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 7px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)' }}>
                      {row.type}
                    </span>
                  </td>
                  <td style={td}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 7px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: row.serviceTier === 'priority' ? 'rgba(66,144,240,0.12)' : 'var(--color-kumo-tint)', color: row.serviceTier === 'priority' ? 'rgb(66,144,240)' : 'var(--text-color-kumo-subtle)' }}>
                      {row.serviceTier}
                    </span>
                  </td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: 12, color: 'var(--text-color-kumo-subtle)' }}>{row.request}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingTop: 16, paddingBottom: 8, fontSize: 13 }}>

          {/* Prev / Next */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button type="button" disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ ...navBtn, opacity: page <= 1 ? 0.4 : 1 }} aria-label="Previous page">
              <CaretLeft size={16} />
            </button>
            <span style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', minWidth: 80, textAlign: 'center' }}>
              {page} / {totalPages}
            </span>
            <button type="button" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ ...navBtn, opacity: page >= totalPages ? 0.4 : 1 }} aria-label="Next page">
              <CaretRight size={16} />
            </button>
          </div>

          {/* Lines per page */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-color-kumo-subtle)' }}>
              Lines per page
            </span>
            <div style={{ position: 'relative' }}>
              <button type="button" onClick={() => setPageSizeOpen(o => !o)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)', fontSize: 13, color: 'var(--text-color-kumo-default)' }}>
                {pageSize}
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.6 }}>
                  <path d="M0 0l5 6 5-6z" />
                </svg>
              </button>
              {pageSizeOpen && (
                <div style={{ position: 'absolute', bottom: '100%', right: 0, marginBottom: 4, background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line), 0 8px 24px rgba(0,0,0,0.12)', borderRadius: 8, overflow: 'hidden', zIndex: 20, minWidth: 80 }}>
                  {PAGE_SIZES.map(s => (
                    <button key={s} type="button"
                      onClick={() => { setPageSize(s); setPageSizeOpen(false) }}
                      style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', cursor: 'pointer', fontSize: 13, background: s === pageSize ? 'var(--color-kumo-tint)' : 'transparent', color: 'var(--text-color-kumo-default)', fontWeight: s === pageSize ? 600 : 400 }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

export default function LogsPage() {
  return (
    <Suspense>
      <LogsContent />
    </Suspense>
  )
}

const th: React.CSSProperties = {
  height: 36, padding: '0 12px', fontSize: 12, fontWeight: 500,
  color: 'var(--text-color-kumo-subtle)', textAlign: 'left', whiteSpace: 'nowrap',
  borderBottom: '1px solid var(--color-kumo-line)',
}
const td: React.CSSProperties = {
  padding: '10px 12px', borderBottom: '1px solid var(--color-kumo-line)',
  color: 'var(--text-color-kumo-default)', fontSize: 13,
}
const navBtn: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer',
  background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)',
  color: 'var(--text-color-kumo-default)',
}
