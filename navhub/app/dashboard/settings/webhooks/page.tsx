'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

const responsiveStyles = `
  .wh-wrap { padding: 2rem 1.5rem !important; }
  .wh-stats { grid-template-columns: repeat(4, 1fr) !important; }
  .wh-events-grid { grid-template-columns: repeat(3, 1fr) !important; }
  .wh-log-row { flex-wrap: nowrap !important; }
  .wh-log-event { display: inline-flex !important; }
  @media (max-width: 640px) {
    .wh-wrap { padding: 1rem !important; }
    .wh-stats { grid-template-columns: repeat(2, 1fr) !important; }
    .wh-events-grid { grid-template-columns: 1fr !important; }
    .wh-events-cell { border-left: none !important; border-top: 1px solid var(--color-kumo-line) !important; }
    .wh-events-cell:first-child { border-top: none !important; }
    .wh-log-row { flex-wrap: wrap !important; gap: 6px !important; padding: 10px 12px !important; }
    .wh-log-event { display: none !important; }
    .wh-log-time { margin-left: 0 !important; }
  }
`

type WHStatus = 'Active' | 'Disabled'

interface Webhook {
  id: number
  endpoint: string
  product: string
  events: string[]
  status: WHStatus
  created: string
  successRate: string
}

interface DeliveryLog {
  id: number
  status: number
  method: string
  path: string
  time: string
  event: string
  payload: object
}

const ALL_PRODUCTS = ['Osmium AI', 'Aegis Auth', 'LM Lens']

const PRODUCT_EVENTS: Record<string, string[]> = {
  'Osmium AI':  ['mock_test.created', 'mock_test.completed', 'career_analysis.generated', 'deep_research.finished', 'chat.completed'],
  'Aegis Auth': ['user.created', 'user.deleted', 'user.login', 'user.logout', 'api_key.created'],
  'LM Lens':    ['document.uploaded', 'document.indexed', 'collection.created', 'ocr.completed'],
}

const INITIAL_WEBHOOKS: Webhook[] = [
  { id: 1, endpoint: 'https://api.xyz.com/webhook',  product: 'Osmium AI',  events: ['mock_test.completed', 'chat.completed'], status: 'Active',   created: 'Aug 10, 2025', successRate: '99.8%' },
  { id: 2, endpoint: 'https://app.xyz.com/hooks',    product: 'Aegis Auth', events: ['user.created', 'user.deleted'],          status: 'Active',   created: 'Aug 12, 2025', successRate: '100%'  },
  { id: 3, endpoint: 'https://dev.xyz.com/lm-hooks', product: 'LM Lens',   events: ['document.indexed', 'ocr.completed'],     status: 'Disabled', created: 'Aug 5, 2025',  successRate: '97.2%' },
]

const INITIAL_LOGS: DeliveryLog[] = [
  { id: 1, status: 200, method: 'POST', path: '/webhook', time: '2 mins ago',  event: 'mock_test.completed', payload: { event: 'mock_test.completed', timestamp: '2026-08-21T10:00:00Z', data: { testId: 'tst_abc123', score: 87 } } },
  { id: 2, status: 200, method: 'POST', path: '/webhook', time: '5 mins ago',  event: 'user.created',        payload: { event: 'user.created',        timestamp: '2026-08-21T09:57:00Z', data: { userId: 'usr_xyz789' } } },
  { id: 3, status: 500, method: 'POST', path: '/webhook', time: '12 mins ago', event: 'document.indexed',    payload: { event: 'document.indexed',    timestamp: '2026-08-21T09:50:00Z', data: { docId: 'doc_def456', error: 'Internal Server Error' } } },
  { id: 4, status: 200, method: 'POST', path: '/webhook', time: '18 mins ago', event: 'chat.completed',      payload: { event: 'chat.completed',      timestamp: '2026-08-21T09:44:00Z', data: { sessionId: 'ses_ghi012' } } },
]

function StatusDot({ status }: { status: WHStatus }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, var(--font-sans)', background: status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', color: status === 'Active' ? '#16a34a' : '#6b7280', flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
      {status}
    </span>
  )
}

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState<Webhook[]>(INITIAL_WEBHOOKS)
  const [logs] = useState<DeliveryLog[]>(INITIAL_LOGS)
  const [showCreate, setShowCreate] = useState(false)
  const [newEndpoint, setNewEndpoint] = useState('')
  const [newProduct, setNewProduct] = useState(ALL_PRODUCTS[0])
  const [newEvents, setNewEvents] = useState<string[]>([])
  const [endpointError, setEndpointError] = useState('')
  const [menuId, setMenuId] = useState<number | null>(null)
  const [expandedLog, setExpandedLog] = useState<number | null>(null)

  const activeCount = webhooks.filter(w => w.status === 'Active').length
  const availableEvents = PRODUCT_EVENTS[newProduct] ?? []

  function toggleEvent(e: string) {
    setNewEvents(prev => prev.includes(e) ? prev.filter(x => x !== e) : [...prev, e])
  }

  function handleCreate() {
    if (!newEndpoint.trim() || !newEndpoint.startsWith('http')) { setEndpointError('Enter a valid URL starting with https://'); return }
    if (newEvents.length === 0) { setEndpointError('Select at least one event.'); return }
    setWebhooks(prev => [...prev, {
      id: Date.now(), endpoint: newEndpoint.trim(), product: newProduct,
      events: newEvents, status: 'Active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      successRate: '—',
    }])
    setNewEndpoint(''); setNewEvents([]); setEndpointError(''); setShowCreate(false)
  }

  function handleDelete(id: number) { setWebhooks(prev => prev.filter(w => w.id !== id)); setMenuId(null) }
  function handleToggle(id: number) {
    setWebhooks(prev => prev.map(w => w.id === id ? { ...w, status: w.status === 'Active' ? 'Disabled' : 'Active' } : w))
    setMenuId(null)
  }

  return (
    <DashboardLayout>
      <div className="wh-wrap" style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>Webhooks</h1>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
              Receive real-time events from Osmium AI, Aegis Auth, and LM Lens.
            </p>
          </div>
          <button onClick={() => { setShowCreate(v => !v); setEndpointError('') }} style={{ ...primaryBtn, flexShrink: 0 }}>
            {showCreate ? 'Cancel' : '+ Add Webhook'}
          </button>
        </div>

        {/* Stats */}
        <div className="wh-stats" style={{ display: 'grid', gap: 10 }}>
          {[
            { label: 'Total Webhooks',    value: String(webhooks.length) },
            { label: 'Active',            value: String(activeCount) },
            { label: 'Delivered Today',   value: '12,431' },
            { label: 'Success Rate',      value: '99.8%' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, margin: '0 0 4px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showCreate && (
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>New Webhook</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 2, minWidth: 200 }}>
                <label style={labelStyle}>Endpoint URL</label>
                <input placeholder="https://your-server.com/webhook" value={newEndpoint} onChange={e => { setNewEndpoint(e.target.value); setEndpointError('') }} style={{ ...inputStyle, borderColor: endpointError ? 'rgb(239,68,68)' : undefined }} />
                {endpointError && <p style={{ fontSize: 12, color: 'rgb(239,68,68)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>{endpointError}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Product</label>
                <select value={newProduct} onChange={e => { setNewProduct(e.target.value); setNewEvents([]) }} style={selectStyle}>
                  {ALL_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Events</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {availableEvents.map(ev => {
                  const sel = newEvents.includes(ev)
                  return (
                    <button key={ev} type="button" onClick={() => toggleEvent(ev)} style={{ height: 26, padding: '0 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, fontFamily: 'monospace', cursor: 'pointer', border: sel ? '1.5px solid rgb(59,130,246)' : '1px solid var(--color-kumo-line)', background: sel ? 'rgba(59,130,246,0.08)' : 'var(--color-kumo-canvas)', color: sel ? 'rgb(59,130,246)' : 'var(--text-color-kumo-subtle)' }}>
                      {sel ? '✓ ' : ''}{ev}
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCreate} style={primaryBtn}>Create Webhook</button>
              <button onClick={() => { setShowCreate(false); setEndpointError('') }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        )}

        {/* Webhook list */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Endpoints
          </p>
          {webhooks.length === 0 ? (
            <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>No webhooks yet</p>
              <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>Add a webhook to start receiving events.</p>
            </div>
          ) : (
            webhooks.map((w, i) => (
              <div key={w.id} style={{ borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none', padding: '12px 16px', display: 'flex', alignItems: 'flex-start', gap: 12, opacity: w.status === 'Disabled' ? 0.6 : 1 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 4 }}>
                    <code style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-color-kumo-default)', wordBreak: 'break-all' }}>{w.endpoint}</code>
                    <StatusDot status={w.status} />
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
                    <span style={{ ...scopeTag, background: 'rgba(59,130,246,0.08)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.2)' }}>{w.product}</span>
                    {w.events.map(ev => <span key={ev} style={scopeTag}>{ev}</span>)}
                  </div>
                  <p style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
                    Created {w.created} · Success rate {w.successRate}
                  </p>
                </div>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {menuId === w.id && <div onClick={() => setMenuId(null)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />}
                  <button onClick={() => setMenuId(menuId === w.id ? null : w.id)} style={{ ...ghostBtn, width: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 1 }}>···</button>
                  {menuId === w.id && (
                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 50, background: 'var(--color-kumo-elevated)', border: '1px solid var(--color-kumo-line)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden' }}>
                      {[
                        ['View Logs', () => setMenuId(null)],
                        [w.status === 'Active' ? 'Disable' : 'Enable', () => handleToggle(w.id)],
                        null,
                        ['Delete', () => handleDelete(w.id)],
                      ].map((item, idx) =>
                        item === null ? (
                          <div key={idx} style={{ height: 1, background: 'var(--color-kumo-line)', margin: '2px 0' }} />
                        ) : (
                          <button key={item[0] as string} onClick={item[1] as () => void} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, var(--font-sans)', fontWeight: 500, color: item[0] === 'Delete' ? 'rgb(239,68,68)' : 'var(--text-color-kumo-default)' }}>
                            {item[0] as string}
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Delivery Logs */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Delivery Logs
          </p>
          {logs.map((log, i) => (
            <div key={log.id} style={{ borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
              <button
                onClick={() => setExpandedLog(expandedLog === log.id ? null : log.id)}
                className="wh-log-row"
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 20, padding: '0 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, var(--font-sans)', background: log.status === 200 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: log.status === 200 ? '#16a34a' : '#ef4444', flexShrink: 0 }}>
                  {log.status === 200 ? '✓' : '✗'} {log.status}
                </span>
                <span style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--text-color-kumo-subtle)' }}>{log.method} {log.path}</span>
                <span className="wh-log-event" style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-color-kumo-subtle)', background: 'var(--color-kumo-tint)', padding: '1px 6px', borderRadius: 4, border: '1px solid var(--color-kumo-line)' }}>{log.event}</span>
                <span className="wh-log-time" style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', marginLeft: 'auto', flexShrink: 0 }}>{log.time}</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: expandedLog === log.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s', color: 'var(--text-color-kumo-subtle)' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {expandedLog === log.id && (
                <div style={{ padding: '0 16px 14px', borderTop: '1px solid var(--color-kumo-line)' }}>
                  <pre style={{ margin: '12px 0 0', padding: '12px', borderRadius: 8, background: 'var(--color-kumo-canvas)', border: '1px solid var(--color-kumo-line)', fontSize: 12, fontFamily: 'monospace', color: 'var(--text-color-kumo-default)', overflowX: 'auto', lineHeight: 1.6 }}>
                    {JSON.stringify(log.payload, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Product event reference */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Available Events
          </p>
          <div className="wh-events-grid" style={{ display: 'grid', gap: 0 }}>
            {ALL_PRODUCTS.map((product, i) => (
              <div key={product} className="wh-events-cell" style={{ padding: '14px 16px', borderLeft: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                <p style={{ fontSize: 12, fontWeight: 600, margin: '0 0 8px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{product}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {PRODUCT_EVENTS[product].map(ev => (
                    <code key={ev} style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--text-color-kumo-subtle)', background: 'var(--color-kumo-tint)', padding: '2px 6px', borderRadius: 4, border: '1px solid var(--color-kumo-line)', display: 'inline-block' }}>{ev}</code>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}

const ghostBtn: React.CSSProperties = {
  height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--color-kumo-line)',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-subtle)',
}
const primaryBtn: React.CSSProperties = {
  height: 30, padding: '0 12px', borderRadius: 7, border: 'none',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)',
}
const labelStyle: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)',
}
const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 12px', borderRadius: 8, fontSize: 13, fontFamily: 'Inter, var(--font-sans)',
  outline: 'none', width: '100%', background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
  border: '1px solid var(--color-kumo-line)', boxSizing: 'border-box',
}
const selectStyle: React.CSSProperties = {
  height: 36, padding: '0 32px 0 10px', borderRadius: 8, fontSize: 13, fontFamily: 'Inter, var(--font-sans)',
  cursor: 'pointer', outline: 'none', width: '100%', background: 'var(--color-kumo-canvas)',
  color: 'var(--text-color-kumo-default)', border: '1px solid var(--color-kumo-line)', boxSizing: 'border-box',
  appearance: 'none', WebkitAppearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236b7280' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round' fill='none'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
}
const scopeTag: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 7px', borderRadius: 999,
  fontSize: 10, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)', border: '1px solid var(--color-kumo-line)',
}
