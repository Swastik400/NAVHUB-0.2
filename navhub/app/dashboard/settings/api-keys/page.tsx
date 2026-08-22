'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPortal } from 'react-dom'

const responsiveStyles = `
  .apk-wrap { padding: 2rem 1.5rem !important; }
  .apk-stats { grid-template-columns: repeat(4, 1fr) !important; }
  .apk-usage { grid-template-columns: repeat(4, 1fr) !important; }
  .apk-search-row { flex-wrap: nowrap !important; }
  .apk-banner-btns { flex-direction: row !important; }
  .apk-table-scroll { overflow-x: visible; }
  @media (max-width: 640px) {
    .apk-wrap { padding: 1rem !important; }
    .apk-stats { grid-template-columns: repeat(2, 1fr) !important; }
    .apk-usage { grid-template-columns: repeat(2, 1fr) !important; }
    .apk-usage-cell-2 { border-top: 1px solid var(--color-kumo-line) !important; border-left: none !important; }
    .apk-usage-cell-3 { border-top: 1px solid var(--color-kumo-line) !important; border-left: none !important; }
    .apk-usage-cell-4 { border-top: 1px solid var(--color-kumo-line) !important; }
    .apk-table-scroll { overflow-x: auto !important; -webkit-overflow-scrolling: touch; }
    .apk-table-inner { min-width: 560px; }
    .apk-search-row { flex-wrap: wrap !important; }
    .apk-filter-btns { display: flex; gap: 6px; width: 100%; }
    .apk-filter-btn { flex: 1; justify-content: center; }
    .apk-banner-btns { flex-direction: column !important; align-items: stretch !important; }
    .apk-banner-btns button { width: 100% !important; height: 34px !important; justify-content: center !important; }
  }
`

type Permission = 'Read' | 'Write' | 'Admin'
type Status = 'Active' | 'Revoked'

const ALL_PRODUCTS = ['Osmium AI', 'Aegis Auth', 'LM Lens', 'Natraj', 'RUX', 'Vajra', 'Kriya', 'OneOnOne']

interface ApiKey {
  id: number
  name: string
  prefix: string
  product: string
  permission: Permission
  status: Status
  created: string
  lastUsed: string | null
  requests: string | null
}

const PERMISSION_COLORS: Record<Permission, { bg: string; color: string }> = {
  Read:  { bg: 'rgba(34,197,94,0.12)',  color: '#16a34a' },
  Write: { bg: 'rgba(59,130,246,0.12)', color: '#3b82f6' },
  Admin: { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444' },
}

const PRODUCT_EVENTS: Record<string, string[]> = {
  'Osmium AI':  ['mock_test.created', 'mock_test.completed', 'career_analysis.generated', 'deep_research.finished', 'chat.completed'],
  'Aegis Auth': ['user.created', 'user.deleted', 'user.login', 'user.logout', 'api_key.created'],
  'LM Lens':    ['document.uploaded', 'document.indexed', 'collection.created', 'ocr.completed'],
}

const INITIAL_KEYS: ApiKey[] = [
  { id: 1, name: 'Production Key', prefix: 'nhk_prod_a1b2c3', product: 'Osmium AI',  permission: 'Admin', status: 'Active',  created: 'Aug 10, 2025', lastUsed: '2 min ago',  requests: '48.2K' },
  { id: 2, name: 'Dev Key',        prefix: 'nhk_dev_d4e5f6',  product: 'LM Lens',    permission: 'Write', status: 'Active',  created: 'Aug 12, 2025', lastUsed: '1 hr ago',   requests: '3.1K'  },
  { id: 3, name: 'Testing Key',    prefix: 'nhk_test_g7h8i9', product: 'Aegis Auth', permission: 'Read',  status: 'Revoked', created: 'Aug 8, 2025',  lastUsed: '5 days ago', requests: '890'   },
]

function PermissionBadge({ permission }: { permission: Permission }) {
  const { bg, color } = PERMISSION_COLORS[permission]
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, var(--font-sans)', background: bg, color, flexShrink: 0 }}>
      {permission}
    </span>
  )
}

function StatusDot({ status }: { status: Status }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 20, padding: '0 8px', borderRadius: 999, fontSize: 11, fontWeight: 600, fontFamily: 'Inter, var(--font-sans)', background: status === 'Active' ? 'rgba(34,197,94,0.1)' : 'rgba(107,114,128,0.1)', color: status === 'Active' ? '#16a34a' : '#6b7280', flexShrink: 0 }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
      {status}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 5 }}>
      {copied ? '✓ Copied' : 'Copy'}
    </button>
  )
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>(INITIAL_KEYS)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newProduct, setNewProduct] = useState(ALL_PRODUCTS[0])
  const [newPermission, setNewPermission] = useState<Permission>('Read')
  const [nameError, setNameError] = useState('')
  const [menuId, setMenuId] = useState<number | null>(null)
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null)
  const [revokeId, setRevokeId] = useState<number | null>(null)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<'All' | Status>('All')

  const filtered = keys.filter(k =>
    (filterStatus === 'All' || k.status === filterStatus) &&
    k.name.toLowerCase().includes(search.toLowerCase())
  )

  const activeCount = keys.filter(k => k.status === 'Active').length
  const revokedCount = keys.filter(k => k.status === 'Revoked').length

  function handleCreate() {
    if (!newName.trim()) { setNameError('Key name is required.'); return }
    if (keys.some(k => k.name === newName.trim())) { setNameError('A key with this name already exists.'); return }
    const raw = 'nhk_' + Math.random().toString(36).slice(2, 18)
    setKeys(prev => [...prev, {
      id: Date.now(), name: newName.trim(), prefix: raw.slice(0, 14) + '…',
      product: newProduct, permission: newPermission, status: 'Active',
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lastUsed: null, requests: null,
    }])
    setCreatedKey(raw)
    setNewName(''); setNewPermission('Read'); setNameError(''); setShowCreate(false)
  }

  function handleRevoke(id: number) {
    setKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'Revoked' } : k))
    setRevokeId(null); setMenuId(null)
  }

  function handleDelete(id: number) {
    setKeys(prev => prev.filter(k => k.id !== id))
    setRevokeId(null); setMenuId(null)
  }

  return (
    <>
    <div className="apk-wrap" style={{ maxWidth: 800, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
        <style dangerouslySetInnerHTML={{ __html: responsiveStyles }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>API Keys</h1>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
              Authenticate API requests across all Navchetna products.
            </p>
          </div>
          <button onClick={() => { setShowCreate(v => !v); setNameError('') }} style={{ ...primaryBtn, flexShrink: 0 }}>
            {showCreate ? 'Cancel' : '+ Create Key'}
          </button>
        </div>

        {/* Stats */}
        <div className="apk-stats" style={{ display: 'grid', gap: 10 }}>
          {[
            { label: 'Total Keys',      value: String(keys.length) },
            { label: 'Active Keys',     value: String(activeCount) },
            { label: 'Revoked Keys',    value: String(revokedCount) },
            { label: 'Requests Today',  value: '48,231' },
          ].map(s => (
            <div key={s.label} style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 11, fontWeight: 500, margin: '0 0 4px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
              <p style={{ fontSize: 20, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Created key banner */}
        {createdKey && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'rgb(22,163,74)', fontFamily: 'Inter, var(--font-sans)' }}>
              Key created — copy it now, it won't be shown again.
            </p>
            <div className="apk-banner-btns" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', background: 'var(--color-kumo-tint)', padding: '6px 10px', borderRadius: 7, color: 'var(--text-color-kumo-default)', wordBreak: 'break-all' }}>
                {createdKey}
              </code>
              <CopyButton text={createdKey} />
              <button onClick={() => setCreatedKey(null)} style={ghostBtn}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Create form */}
        {showCreate && (
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>New API Key</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 2, minWidth: 160 }}>
                <label style={labelStyle}>Key Name</label>
                <input placeholder="e.g. Production Key" value={newName} onChange={e => { setNewName(e.target.value); setNameError('') }} onKeyDown={e => e.key === 'Enter' && handleCreate()} style={{ ...inputStyle, borderColor: nameError ? 'rgb(239,68,68)' : undefined }} />
                {nameError && <p style={{ fontSize: 12, color: 'rgb(239,68,68)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>{nameError}</p>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Product</label>
                <select value={newProduct} onChange={e => setNewProduct(e.target.value)} style={selectStyle}>
                  {ALL_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 120 }}>
                <label style={labelStyle}>Permission</label>
                <select value={newPermission} onChange={e => setNewPermission(e.target.value as Permission)} style={selectStyle}>
                  <option value="Read">Read</option>
                  <option value="Write">Write</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCreate} style={primaryBtn}>Generate Key</button>
              <button onClick={() => { setShowCreate(false); setNameError('') }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        )}

        {/* Search + filter */}
        <div className="apk-search-row" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', borderRadius: 8, background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" /></svg>
            <input type="text" placeholder="Search keys…" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontFamily: 'Inter, var(--font-sans)', color: 'var(--text-color-kumo-default)' }} />
          </div>
          <div className="apk-filter-btns" style={{ display: 'flex', gap: 6 }}>
          {(['All', 'Active', 'Revoked'] as const).map(f => (
            <button key={f} onClick={() => setFilterStatus(f)} className="apk-filter-btn" style={{ ...ghostBtn, background: filterStatus === f ? 'var(--color-kumo-tint)' : 'var(--color-kumo-base)', color: filterStatus === f ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)' }}>{f}</button>
          ))}
          </div>
        </div>

        {/* Keys list */}
        {filtered.length === 0 ? (
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '3rem 2rem', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>No keys found</p>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>Try adjusting your search or filter.</p>
          </div>
        ) : (
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12 }}>
          <div className="apk-table-scroll">
          <div className="apk-table-inner">
            {/* Table header */}
            <div className="apk-table-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto 100px auto 36px', gap: '0 16px', padding: '8px 16px', borderBottom: '1px solid var(--color-kumo-line)', background: 'var(--color-kumo-tint)' }}>
              {['Name', 'Product', 'Permission', 'Last Used', 'Status', ''].map(h => (
                <span key={h} style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</span>
              ))}
            </div>
            {filtered.map((k, i) => (
              <div key={k.id} className="apk-table-row" style={{ display: 'grid', gridTemplateColumns: '1fr auto auto 100px auto 36px', alignItems: 'center', gap: '0 16px', padding: '12px 16px', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none', opacity: k.status === 'Revoked' ? 0.6 : 1 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: '0 0 2px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{k.name}</p>
                  <p style={{ fontSize: 11, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'monospace' }}>{k.prefix}</p>
                </div>
                <span className="apk-key-row-product" style={{ ...scopeTag }}>{k.product}</span>
                <span className="apk-key-row-perm"><PermissionBadge permission={k.permission} /></span>
                <span className="apk-key-row-lastused" style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>{k.lastUsed ?? 'Never'}</span>
                <span className="apk-key-row-status"><StatusDot status={k.status} /></span>
                <div className="apk-key-row-menu" style={{ position: 'relative' }}>
                  <button
                    onClick={e => {
                      if (menuId === k.id) { setMenuId(null); setMenuPos(null); return }
                      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
                      setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right })
                      setMenuId(k.id)
                    }}
                    style={{ ...ghostBtn, width: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 1 }}
                  >···</button>
                </div>
              </div>
            ))}
          </div>
          </div>
          </div>
        )}

        {/* Usage Analytics */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Usage — Last 24 Hours
          </p>
          <div className="apk-usage" style={{ display: 'grid', gap: 0 }}>
            {[
              { label: 'Total Requests', value: '48,231', color: '#3b82f6' },
              { label: 'Success Rate',   value: '99.2%',  color: '#16a34a' },
              { label: 'Error Rate',     value: '0.8%',   color: '#ef4444' },
              { label: 'Rate Limit',     value: '12%',    color: '#f59e0b' },
            ].map((s, i) => (
              <div key={s.label} className={i === 1 ? 'apk-usage-cell-2' : i === 2 ? 'apk-usage-cell-3' : i === 3 ? 'apk-usage-cell-4' : ''} style={{ padding: '14px 16px', borderLeft: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                <p style={{ fontSize: 11, fontWeight: 500, margin: '0 0 4px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</p>
                <p style={{ fontSize: 18, fontWeight: 600, margin: '0 0 8px', color: s.color, fontFamily: 'Inter, var(--font-sans)' }}>{s.value}</p>
                {/* Mini bar */}
                <div style={{ height: 4, borderRadius: 2, background: 'var(--color-kumo-line)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 2, background: s.color, width: s.label === 'Total Requests' ? '80%' : s.label === 'Success Rate' ? '99%' : s.label === 'Error Rate' ? '8%' : '12%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Permission levels */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Permission Levels
          </p>
          {([
            { p: 'Read'  as Permission, desc: 'View resources, analytics, and logs. No modifications.' },
            { p: 'Write' as Permission, desc: 'Read access plus create, update, and delete resources.' },
            { p: 'Admin' as Permission, desc: 'Full access including members, billing, and all settings.' },
          ]).map(({ p, desc }, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 16px', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none', borderLeft: `3px solid ${PERMISSION_COLORS[p].color}` }}>
              <div style={{ flexShrink: 0, width: 52 }}><PermissionBadge permission={p} /></div>
              <p style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', margin: 0, lineHeight: 1.5, fontFamily: 'Inter, var(--font-sans)' }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Portal dropdown */}
      {menuId !== null && menuPos && typeof document !== 'undefined' && createPortal(
        <>
          <div onClick={() => { setMenuId(null); setMenuPos(null) }} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
          <div style={{ position: 'fixed', top: menuPos.top, right: menuPos.right, zIndex: 50, background: 'var(--color-kumo-elevated)', border: '1px solid var(--color-kumo-line)', borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', minWidth: 160, overflow: 'hidden' }}>
            {(() => {
              const k = filtered.find(x => x.id === menuId)!
              if (!k) return null
              return revokeId === k.id ? (
                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)', fontWeight: 500 }}>Revoke this key?</p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => handleRevoke(k.id)} style={{ ...dangerBtn, height: 26, fontSize: 11 }}>Revoke</button>
                    <button onClick={() => setRevokeId(null)} style={{ ...ghostBtn, height: 26, fontSize: 11 }}>Cancel</button>
                  </div>
                </div>
              ) : (
                [
                  ['Copy Key', () => { navigator.clipboard.writeText(k.prefix); setMenuId(null); setMenuPos(null) }],
                  ['View Logs', () => { setMenuId(null); setMenuPos(null); router.push('/dashboard/analytics/logs?key=' + encodeURIComponent(k.name)) }],
                  ['Rotate', () => { setMenuId(null); setMenuPos(null) }],
                  null,
                  k.status === 'Active' ? ['Revoke', () => setRevokeId(k.id)] : null,
                  ['Delete', () => handleDelete(k.id)],
                ].filter(Boolean).map((item, idx) =>
                  item === null ? (
                    <div key={idx} style={{ height: 1, background: 'var(--color-kumo-line)', margin: '2px 0' }} />
                  ) : (
                    <button key={item[0] as string} onClick={item[1] as () => void} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer', fontSize: 12, fontFamily: 'Inter, var(--font-sans)', fontWeight: 500, color: item[0] === 'Delete' || item[0] === 'Revoke' ? 'rgb(239,68,68)' : 'var(--text-color-kumo-default)' }}>
                      {item[0] as string}
                    </button>
                  )
                )
              )
            })()}
          </div>
        </>,
        document.body
      )}
    </>
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
const dangerBtn: React.CSSProperties = {
  height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'rgba(239,68,68,0.08)', color: 'rgb(239,68,68)',
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
  display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px', borderRadius: 999,
  fontSize: 11, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)', border: '1px solid var(--color-kumo-line)',
}
