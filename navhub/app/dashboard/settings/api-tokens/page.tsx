'use client'

import { useState } from 'react'
type Permission = 'Read' | 'Write' | 'Admin'

const ALL_PRODUCTS = ['Osmium AI', 'Aegis Auth', 'LM Lens', 'Natraj', 'RUX', 'Vajra', 'Kriya', 'OneOnOne']

interface Token {
  id: number
  name: string
  prefix: string
  permission: Permission
  scope: string[]  // empty = All Products
  created: string
  requests: string | null  // e.g. '2.3M', '14K', null
  lastUsed: string | null
  expires: string | null
}

const PERMISSION_COLORS: Record<Permission, { bg: string; color: string }> = {
  Read:  { bg: 'rgba(34,197,94,0.12)',   color: '#16a34a' },
  Write: { bg: 'rgba(59,130,246,0.12)',  color: '#3b82f6' },
  Admin: { bg: 'rgba(239,68,68,0.12)',   color: '#ef4444' },
}

const INITIAL_TOKENS: Token[] = [
  { id: 1, name: 'Production API',   prefix: 'nhk_prod_a1b2', permission: 'Admin', scope: [],                        requests: '2.3M', created: 'Jan 12, 2025', lastUsed: '2 hours ago', expires: null },
  { id: 2, name: 'CI/CD Pipeline',   prefix: 'nhk_ci_c3d4',  permission: 'Write', scope: ['Vajra', 'RUX'],           requests: '14K',  created: 'Mar 5, 2025',  lastUsed: '1 day ago',   expires: 'Dec 31, 2025' },
  { id: 3, name: 'Analytics Reader', prefix: 'nhk_rd_e5f6',  permission: 'Read',  scope: ['Osmium AI', 'LM Lens'],   requests: '890',  created: 'May 20, 2025', lastUsed: '5 days ago',  expires: null },
]

function PermissionBadge({ permission }: { permission: Permission }) {
  const { bg, color } = PERMISSION_COLORS[permission]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 7px',
      borderRadius: 4, fontSize: 10, fontWeight: 600, lineHeight: 1,
      fontFamily: 'Inter, var(--font-sans)', background: bg, color, flexShrink: 0,
      whiteSpace: 'nowrap',
    }}>
      {permission}
    </span>
  )
}

function StatusBadge({ expires }: { expires: string | null }) {
  const active = !expires || new Date(expires) > new Date()
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, height: 18, padding: '0 7px',
      borderRadius: 4, fontSize: 10, fontWeight: 600, lineHeight: 1,
      fontFamily: 'Inter, var(--font-sans)', flexShrink: 0, whiteSpace: 'nowrap',
      background: active ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
      color: active ? '#16a34a' : '#ef4444',
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', flexShrink: 0 }} />
      {active ? 'Active' : 'Expired'}
    </span>
  )
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={copy} style={{ ...ghostBtn, display: 'flex', alignItems: 'center', gap: 5 }}>
      {copied ? (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="rgb(34,197,94)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="4" y="4" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
            <path d="M3 8H2a1 1 0 01-1-1V2a1 1 0 011-1h5a1 1 0 011 1v1" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          Copy
        </>
      )}
    </button>
  )
}

export default function ApiTokensPage() {
  const [tokens, setTokens] = useState<Token[]>(INITIAL_TOKENS)
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newPermission, setNewPermission] = useState<Permission>('Read')
  const [newScope, setNewScope] = useState<string[]>([])
  const [newExpiry, setNewExpiry] = useState('')
  const [nameError, setNameError] = useState('')
  const [menuId, setMenuId] = useState<number | null>(null)
  const [revokeId, setRevokeId] = useState<number | null>(null)
  const [createdToken, setCreatedToken] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const filteredTokens = tokens.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  function handleCreate() {
    if (!newName.trim()) { setNameError('Token name is required.'); return }
    if (tokens.some(t => t.name === newName.trim())) { setNameError('A token with this name already exists.'); return }
    const raw = 'nhk_' + Math.random().toString(36).slice(2, 18)
    const prefix = raw.slice(0, 14) + '…'
    setTokens(prev => [...prev, {
      id: Date.now(),
      name: newName.trim(),
      prefix,
      permission: newPermission,
      scope: newScope,
      created: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      requests: null,
      lastUsed: null,
      expires: newExpiry || null,
    }])
    setCreatedToken(raw)
    setNewName('')
    setNewPermission('Read')
    setNewScope([])
    setNewExpiry('')
    setNameError('')
    setShowCreate(false)
  }

  function handleRevoke(id: number) {
    setTokens(prev => prev.filter(t => t.id !== id))
    setRevokeId(null)
  }

  return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(1rem,4vw,2rem) clamp(0.75rem,4vw,1.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 'clamp(1.1rem,4vw,1.25rem)', fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
              API Tokens
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
              Tokens authenticate API requests. Treat them like passwords.
            </p>
          </div>
          <button onClick={() => { setShowCreate(v => !v); setNameError('') }} style={{ ...primaryBtn, flexShrink: 0 }}>
            {showCreate ? 'Cancel' : '+ Create'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 8 }}>
          {[
            { label: 'Total Tokens',   value: String(tokens.length) },
            { label: 'Active Tokens',  value: String(tokens.filter(t => !t.expires).length + tokens.filter(t => t.expires !== null).length) },
            { label: 'Requests Today', value: '245K' },
            { label: 'Last Created',   value: tokens.length ? tokens[tokens.length - 1].created : '—' },
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)',
              borderRadius: 10, padding: 'clamp(10px,3vw,14px) clamp(12px,3vw,16px)', display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <p style={{ fontSize: 10, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {stat.label}
              </p>
              <p style={{ fontSize: 'clamp(1.1rem,4vw,1.25rem)', fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Newly created token banner */}
        {createdToken && (
          <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 12, padding: '1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'rgb(22,163,74)', fontFamily: 'Inter, var(--font-sans)' }}>
              Token created — copy it now, it won't be shown again.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <code style={{ flex: 1, fontSize: 12, fontFamily: 'monospace', background: 'var(--color-kumo-tint)', padding: '6px 10px', borderRadius: 7, color: 'var(--text-color-kumo-default)', wordBreak: 'break-all' }}>
                {createdToken}
              </code>
              <CopyButton text={createdToken} />
              <button onClick={() => setCreatedToken(null)} style={{ ...ghostBtn }}>Dismiss</button>
            </div>
          </div>
        )}

        {/* Create form */}
        {showCreate && (
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
              New token
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <label style={labelStyle}>Token name</label>
              <input
                placeholder="e.g. Production API"
                value={newName}
                onChange={e => { setNewName(e.target.value); setNameError('') }}
                onKeyDown={e => e.key === 'Enter' && handleCreate()}
                style={{ ...inputStyle, borderColor: nameError ? 'rgb(239,68,68)' : undefined }}
              />
              {nameError && <p style={{ fontSize: 12, color: 'rgb(239,68,68)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>{nameError}</p>}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Permission</label>
                <select value={newPermission} onChange={e => setNewPermission(e.target.value as Permission)} style={selectStyle}>
                  <option value="Read">Read — view only</option>
                  <option value="Write">Write — read & write</option>
                  <option value="Admin">Admin — full access</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, minWidth: 140 }}>
                <label style={labelStyle}>Expiry <span style={{ opacity: 0.5 }}>(optional)</span></label>
                <input type="date" value={newExpiry} onChange={e => setNewExpiry(e.target.value)} style={selectStyle} />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Product scope <span style={{ opacity: 0.5 }}>(leave empty for All Products)</span></label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ALL_PRODUCTS.map(p => {
                  const selected = newScope.includes(p)
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewScope(prev => selected ? prev.filter(x => x !== p) : [...prev, p])}
                      style={{
                        height: 28, padding: '0 10px', borderRadius: 999, fontSize: 12, fontWeight: 500,
                        fontFamily: 'Inter, var(--font-sans)', cursor: 'pointer',
                        border: selected ? '1.5px solid rgb(59,130,246)' : '1px solid var(--color-kumo-line)',
                        background: selected ? 'rgba(59,130,246,0.08)' : 'var(--color-kumo-canvas)',
                        color: selected ? 'rgb(59,130,246)' : 'var(--text-color-kumo-subtle)',
                      }}
                    >
                      {selected ? '✓ ' : ''}{p}
                    </button>
                  )
                })}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleCreate} style={primaryBtn}>Generate token</button>
              <button onClick={() => { setShowCreate(false); setNameError('') }} style={ghostBtn}>Cancel</button>
            </div>
          </div>
        )}

        {/* Token list */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, height: 34, padding: '0 12px', borderRadius: 8, background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search tokens..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 13, fontFamily: 'Inter, var(--font-sans)', color: 'var(--text-color-kumo-default)' }}
              />
              {search && (
                <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', color: 'var(--text-color-kumo-subtle)' }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              )}
            </div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)', flexShrink: 0 }}>
              {filteredTokens.length} token{filteredTokens.length !== 1 ? 's' : ''}
            </p>
          </div>
          {filteredTokens.length === 0 ? (
            <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <rect x="8" y="14" width="32" height="22" rx="4" stroke="var(--color-kumo-line)" strokeWidth="2" fill="var(--color-kumo-tint)" />
                <path d="M16 22h6M16 27h10" stroke="var(--text-color-kumo-subtle)" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
                <circle cx="34" cy="30" r="7" fill="var(--color-kumo-canvas)" stroke="var(--color-kumo-line)" strokeWidth="2" />
                <path d="M31.5 30h5M34 27.5v5" stroke="var(--text-color-kumo-subtle)" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 14, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
                  {search ? 'No tokens match your search' : 'No API tokens yet'}
                </p>
                <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
                  {search ? 'Try a different name.' : 'Create a token to start making authenticated API requests.'}
                </p>
              </div>
              {!search && (
                <button onClick={() => { setShowCreate(true); setNameError('') }} style={primaryBtn}>
                  + Create your first token
                </button>
              )}
            </div>
          ) : (
            <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12 }}>
              {filteredTokens.map((t, i) => (
                <div key={t.id} style={{ borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none', padding: '12px 16px' }}>
                  {/* Row 1: icon + name/prefix/scope + menu */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    {/* Icon */}
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-color-kumo-subtle)' }}>
                        <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                      </svg>
                    </div>
                    {/* Name + prefix + scope + badges */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '4px 8px', marginBottom: 2 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{t.name}</p>
                        <PermissionBadge permission={t.permission} />
                        <StatusBadge expires={t.expires} />
                      </div>
                      <p style={{ fontSize: 11, margin: '0 0 5px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'monospace', letterSpacing: '0.02em' }}>{t.prefix}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {t.scope.length === 0 ? (
                          <span style={scopeTag}>All Products</span>
                        ) : (
                          t.scope.map(p => <span key={p} style={scopeTag}>{p}</span>)
                        )}
                      </div>
                    </div>
                    {/* Menu */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {menuId === t.id && (
                        <div onClick={() => setMenuId(null)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                      )}
                      <button
                        onClick={() => setMenuId(menuId === t.id ? null : t.id)}
                        style={{ ...ghostBtn, width: 30, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', letterSpacing: 1 }}
                      >···</button>
                      {menuId === t.id && (
                        <div style={{
                          position: 'absolute', right: 0, top: 'calc(100% + 4px)', zIndex: 50,
                          background: 'var(--color-kumo-elevated)', border: '1px solid var(--color-kumo-line)',
                          borderRadius: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', minWidth: 160, overflow: 'hidden',
                        }}>
                          {revokeId === t.id ? (
                            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                              <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)', fontWeight: 500 }}>Revoke this token?</p>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button onClick={() => { handleRevoke(t.id); setMenuId(null) }} style={{ ...dangerBtn, height: 26, fontSize: 11 }}>Revoke</button>
                                <button onClick={() => setRevokeId(null)} style={{ ...ghostBtn, height: 26, fontSize: 11 }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            [['Copy Key', () => { navigator.clipboard.writeText(t.prefix); setMenuId(null) }],
                             ['Regenerate', () => setMenuId(null)],
                             ['Disable', () => setMenuId(null)],
                             null,
                             ['Delete', () => { setRevokeId(t.id) }],
                            ].map((item, idx) =>
                              item === null ? (
                                <div key={idx} style={{ height: 1, background: 'var(--color-kumo-line)', margin: '2px 0' }} />
                              ) : (
                                <button
                                  key={item[0] as string}
                                  onClick={item[1] as () => void}
                                  style={{
                                    display: 'block', width: '100%', textAlign: 'left',
                                    padding: '8px 14px', border: 'none', background: 'none', cursor: 'pointer',
                                    fontSize: 12, fontFamily: 'Inter, var(--font-sans)', fontWeight: 500,
                                    color: item[0] === 'Delete' ? 'rgb(239,68,68)' : 'var(--text-color-kumo-default)',
                                  }}
                                >{item[0] as string}</button>
                              )
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  {/* Row 2: meta info — created · last used · expires */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 12px', marginTop: 6, paddingLeft: 44 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', whiteSpace: 'nowrap' }}>
                      Created {t.created}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', whiteSpace: 'nowrap' }}>
                      {t.lastUsed ? `Last used ${t.lastUsed}` : 'Never used'}
                      {t.requests && <span style={{ marginLeft: 4, opacity: 0.6 }}>· {t.requests} req</span>}
                    </span>
                    {t.expires && (
                      <span style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', whiteSpace: 'nowrap' }}>
                        Expires {t.expires}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info box */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Permission levels
          </p>
          {([
            { p: 'Read'  as Permission, desc: 'View resources, analytics, and logs. No modifications.' },
            { p: 'Write' as Permission, desc: 'Read access plus create, update, and delete resources.' },
            { p: 'Admin' as Permission, desc: 'Full access including members, billing, and all settings.' },
          ]).map(({ p, desc }, i) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '11px 16px', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none', borderLeft: `3px solid ${PERMISSION_COLORS[p].color}` }}>
              <div style={{ flexShrink: 0 }}><PermissionBadge permission={p} /></div>
              <p style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', margin: 0, lineHeight: 1.5, fontFamily: 'Inter, var(--font-sans)' }}>{desc}</p>
            </div>
          ))}
        </div>

      </div>
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
  fontSize: 12, fontWeight: 500, color: 'var(--text-color-kumo-subtle)',
  fontFamily: 'Inter, var(--font-sans)',
}

const inputStyle: React.CSSProperties = {
  height: 36, padding: '0 12px', borderRadius: 8, fontSize: 13,
  fontFamily: 'Inter, var(--font-sans)', outline: 'none', width: '100%',
  background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
  border: '1px solid var(--color-kumo-line)', boxSizing: 'border-box',
}

const scopeTag: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', height: 18, padding: '0 7px',
  borderRadius: 4, fontSize: 10, fontWeight: 500, lineHeight: 1,
  fontFamily: 'Inter, var(--font-sans)', whiteSpace: 'nowrap',
  background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)',
  border: '1px solid var(--color-kumo-line)',
}
const selectStyle: React.CSSProperties = {
  height: 36, padding: '0 10px', borderRadius: 8, fontSize: 13,
  fontFamily: 'Inter, var(--font-sans)', cursor: 'pointer', outline: 'none', width: '100%',
  background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
  border: '1px solid var(--color-kumo-line)', boxSizing: 'border-box',
}
