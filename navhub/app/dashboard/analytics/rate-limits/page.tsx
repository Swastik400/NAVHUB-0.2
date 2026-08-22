'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import { BookOpen, ArrowCounterClockwise, MagnifyingGlass } from '@phosphor-icons/react'

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage' ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'rate-limits'
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

function QuotaRow({ row, indent }: { row: QuotaRow; indent: boolean }) {
  return (
    <tr style={{ cursor: 'pointer' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      <td style={{ ...td, paddingLeft: indent ? 32 : 16, color: 'var(--text-color-kumo-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {row.label}
      </td>
      <td style={td}><Meter pct={row.pct} /></td>
      <td style={{ ...td, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
        {row.used}<span style={{ color: 'var(--text-color-kumo-subtle)' }}> / {row.limit}</span>
      </td>
      <td style={td} />
    </tr>
  )
}

function Meter({ pct }: { pct: number }) {
  const color = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : 'var(--color-kumo-brand)'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--color-kumo-tint)', overflow: 'hidden', boxShadow: 'inset 0 0 0 1px var(--color-kumo-line)' }}>
        {pct > 0 && <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 999 }} />}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', width: 40, textAlign: 'right', flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>{pct}%</span>
    </div>
  )
}

type QuotaRow = { label: string; pct: number; used: string; limit: string }
type ModelGroup = { model: string; aliases: string; rows: QuotaRow[] }

const GROUPS: ModelGroup[] = [
  {
    model: 'Osmium AI', aliases: 'Nexus 5',
    rows: [
      { label: 'Input tokens (excl. cache reads)', pct: 0, used: '0', limit: '100K' },
      { label: 'Output tokens',                    pct: 0, used: '0', limit: '20K'  },
      { label: 'Requests',                         pct: 0, used: '0', limit: '50'   },
    ],
  },
  {
    model: 'Aegis Auth', aliases: 'Apex 5',
    rows: [
      { label: 'Input tokens (excl. cache reads)', pct: 0, used: '0', limit: '500K' },
      { label: 'Output tokens',                    pct: 0, used: '0', limit: '80K'  },
      { label: 'Requests',                         pct: 0, used: '0', limit: '1.0K' },
    ],
  },
  {
    model: 'LM Lens', aliases: 'Core 5',
    rows: [
      { label: 'Input tokens (excl. cache reads)', pct: 0, used: '0', limit: '500K' },
      { label: 'Output tokens',                    pct: 0, used: '0', limit: '80K'  },
      { label: 'Requests',                         pct: 0, used: '0', limit: '1.0K' },
    ],
  },
  {
    model: 'Natraj', aliases: 'Swift 4',
    rows: [
      { label: 'Input tokens (excl. cache reads)', pct: 0, used: '0', limit: '500K' },
      { label: 'Output tokens',                    pct: 0, used: '0', limit: '80K'  },
      { label: 'Requests',                         pct: 0, used: '0', limit: '1.0K' },
    ],
  },
]

export default function RateLimitsPage() {
  const [search, setSearch] = useState('')
  const [grouped, setGrouped] = useState(true)

  const filtered = GROUPS.map(g => ({
    ...g,
    rows: g.rows.filter(r => !search || r.label.toLowerCase().includes(search.toLowerCase()) || g.model.toLowerCase().includes(search.toLowerCase())),
  })).filter(g => g.rows.length > 0)

  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', width: '100%' }}>

        {/* Page header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 8 }}>
          <div>
            <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>Rate limits</h1>
            <p style={{ fontSize: 14, color: 'var(--text-color-kumo-subtle)', marginTop: 6, marginBottom: 0 }}>Your rate limits and usage over the last 24 hours.</p>
          </div>
          <a href="#" aria-label="Rate limit docs" title="Rate limit docs" style={iconBtn}>
            <BookOpen size={20} />
          </a>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0' }} />

        {/* Filter bar */}
        <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--color-kumo-canvas)', paddingBottom: 16 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>

              {/* Search */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 10px', borderRadius: 8, background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)', width: 240 }}>
                <MagnifyingGlass size={15} style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0, opacity: 0.6 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search quotas"
                  aria-label="Search quotas"
                  style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-color-kumo-default)', minWidth: 0 }}
                />
              </div>

              {/* Workspace filter */}
              <div style={filterBox}>
                <span style={{ color: 'var(--text-color-kumo-subtle)', fontSize: 13 }}>Workspace</span>
                <span style={{ fontSize: 13, color: 'var(--text-color-kumo-default)' }}>Default</span>
                <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.6, flexShrink: 0 }}><path d="M0 0l5 6 5-6z" /></svg>
              </div>

              {/* Group toggle */}
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-color-kumo-subtle)', cursor: 'pointer', userSelect: 'none' }}>
                Group
                <button
                  type="button"
                  role="switch"
                  aria-checked={grouped}
                  onClick={() => setGrouped(g => !g)}
                  style={{
                    width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer', padding: 2,
                    background: grouped ? 'var(--color-kumo-line)' : 'var(--color-kumo-tint)',
                    transition: 'background 0.2s', position: 'relative', flexShrink: 0,
                  }}
                >
                  <span style={{
                    display: 'block', width: 16, height: 16, borderRadius: '50%', background: '#fff',
                    transform: grouped ? 'translateX(16px)' : 'translateX(0)',
                    transition: 'transform 0.2s',
                  }} />
                </button>
              </label>

              {/* Reset */}
              <button type="button" onClick={() => setSearch('')} aria-label="Reset" style={iconBtn} title="Reset">
                <ArrowCounterClockwise size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <section>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, fontSize: 13, minWidth: 760, tableLayout: 'fixed' }}>
              <thead>
                <tr>
                  <th style={{ ...th, width: '38%' }}>Quota</th>
                  <th style={{ ...th, width: '34%' }}>Peak utilization</th>
                  <th style={{ ...th, width: '22%', textAlign: 'right' }}>Used / limit</th>
                  <th style={{ ...th, width: 48 }} aria-hidden="true" />
                </tr>
              </thead>

              {grouped ? (
                filtered.map(group => (
                  <tbody key={group.model}>
                    <tr>
                      <th colSpan={4} style={{ padding: '14px 16px', borderTop: '1px solid var(--color-kumo-line)', borderBottom: '1px solid var(--color-kumo-line)', textAlign: 'left', fontWeight: 'normal', background: 'var(--color-kumo-canvas)' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 10 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{group.model}</span>
                          <span style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)' }}>{group.aliases}</span>
                        </div>
                      </th>
                    </tr>
                    {group.rows.map((row, i) => (
                      <QuotaRow key={i} row={row} indent />
                    ))}
                  </tbody>
                ))
              ) : (
                <tbody>
                  {filtered.flatMap(group =>
                    group.rows.map((row, i) => (
                      <QuotaRow key={`${group.model}-${i}`} row={row} indent={false} />
                    ))
                  )}
                </tbody>
              )}
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  )
}

const th: React.CSSProperties = {
  height: 36, padding: '0 16px', fontSize: 12, fontWeight: 500,
  color: 'var(--text-color-kumo-subtle)', textAlign: 'left', whiteSpace: 'nowrap',
}
const td: React.CSSProperties = {
  padding: '10px 16px', borderBottom: '1px solid var(--color-kumo-line)',
  color: 'var(--text-color-kumo-default)', fontSize: 13,
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
