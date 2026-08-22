'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'
import Link from 'next/link'


/* ── Product illustrations ────────────────────────────────── */

function IllustrationOsmium() {
  return (
    <img src="/osmium1.avif" alt="Osmium AI" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
  )
}

function IllustrationAegis() {
  return (
    <img src="/aegis-auth.avif" alt="Aegis Auth" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
  )
}

function IllustrationLMLens() {
  return (
    <img src="/lmlens.avif" alt="LM Lens" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
  )
}

function IllustrationNatraj() {
  return (
    <img src="/nataraj.png" alt="Natraj" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
  )
}

function IllustrationRUX() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" fill="none">
      <rect width="240" height="160" fill="#181e28" />
      <rect x="52" y="36" width="136" height="88" rx="6" fill="#1e2535" stroke="#6b7fa3" strokeWidth="1" />
      <rect x="52" y="36" width="136" height="20" rx="6" fill="#252e42" />
      <circle cx="66" cy="46" r="3" fill="#6b7fa3" opacity="0.4" />
      <circle cx="76" cy="46" r="3" fill="#6b7fa3" opacity="0.4" />
      <circle cx="86" cy="46" r="3" fill="#6b7fa3" opacity="0.4" />
      <rect x="66" y="68" width="30" height="4" rx="2" fill="#6b7fa3" opacity="0.6" />
      <rect x="66" y="78" width="50" height="4" rx="2" fill="#6b7fa3" opacity="0.35" />
      <rect x="66" y="88" width="40" height="4" rx="2" fill="#6b7fa3" opacity="0.35" />
      <rect x="66" y="98" width="20" height="4" rx="2" fill="#FD6A2B" opacity="0.6" />
      <rect x="120" y="68" width="55" height="4" rx="2" fill="#6b7fa3" opacity="0.2" />
      <rect x="120" y="78" width="35" height="4" rx="2" fill="#FD6A2B" opacity="0.3" />
      <text x="120" y="138" textAnchor="middle" fill="#6b7fa3" opacity="0.35" fontSize="9" fontFamily="Inter,sans-serif">RUX</text>
    </svg>
  )
}

function IllustrationVajra() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" fill="none">
      <rect width="240" height="160" fill="#1e1828" />
      <rect x="72" y="50" width="96" height="60" rx="5" fill="#251e35" stroke="#8b6fa3" strokeWidth="1" />
      <rect x="72" y="50" width="96" height="16" rx="5" fill="#2e2540" />
      <rect x="80" y="57" width="40" height="3" rx="1.5" fill="#8b6fa3" opacity="0.5" />
      <rect x="84" y="76" width="12" height="20" rx="2" fill="#8b6fa3" opacity="0.5" />
      <rect x="102" y="70" width="12" height="26" rx="2" fill="#8b6fa3" opacity="0.6" />
      <rect x="120" y="64" width="12" height="32" rx="2" fill="#8b6fa3" opacity="0.8" />
      <rect x="138" y="72" width="12" height="24" rx="2" fill="#8b6fa3" opacity="0.5" />
      <path d="M120 38 L124 46 L120 44 L116 46 Z" fill="#8b6fa3" opacity="0.7" />
      <line x1="120" y1="46" x2="120" y2="50" stroke="#8b6fa3" strokeWidth="1" opacity="0.5" />
      <text x="120" y="138" textAnchor="middle" fill="#8b6fa3" opacity="0.35" fontSize="9" fontFamily="Inter,sans-serif">Vajra</text>
    </svg>
  )
}

function IllustrationKriya() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 240 160" preserveAspectRatio="xMidYMid slice" fill="none">
      <rect width="240" height="160" fill="#281e18" />
      <rect x="60" y="44" width="50" height="28" rx="5" fill="#352518" stroke="#a37a6b" strokeWidth="1" />
      <rect x="130" y="44" width="50" height="28" rx="5" fill="#352518" stroke="#a37a6b" strokeWidth="1" />
      <rect x="95" y="88" width="50" height="28" rx="5" fill="#352518" stroke="#a37a6b" strokeWidth="1" />
      <line x1="85" y1="72" x2="120" y2="88" stroke="#a37a6b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      <line x1="155" y1="72" x2="120" y2="88" stroke="#a37a6b" strokeWidth="1" strokeDasharray="3 2" opacity="0.5" />
      <rect x="70" y="53" width="30" height="3" rx="1.5" fill="#a37a6b" opacity="0.5" />
      <rect x="140" y="53" width="30" height="3" rx="1.5" fill="#a37a6b" opacity="0.5" />
      <rect x="105" y="97" width="30" height="3" rx="1.5" fill="#a37a6b" opacity="0.5" />
      <text x="120" y="138" textAnchor="middle" fill="#a37a6b" opacity="0.35" fontSize="9" fontFamily="Inter,sans-serif">Kriya</text>
    </svg>
  )
}

function IllustrationOneOnOne() {
  return (
    <img src="/connecttbg.avif" alt="Connectt.live" loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
  )
}

/* ── Workspace overview stats ──────────────────────────────── */
const WORKSPACE_STATS = [
  { label: 'Products',    value: '8'      },
  { label: 'API Keys',    value: '12'     },
  { label: 'Uptime',      value: '99.98%' },
  { label: 'Team',        value: '1 workspace' },
]

/* ── Product status cards data ─────────────────────────────── */
const PRODUCT_STATUS = [
  {
    key: 'osmium', name: 'Osmium AI', href: '/dashboard/products/osmium-ai',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Active Users', value: '2,341' }, { label: 'Accuracy', value: '98.9%' }],
    Illustration: IllustrationOsmium,
  },
  {
    key: 'aegis', name: 'Aegis Auth', href: '/dashboard/security',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Apps Protected', value: '12' }, { label: 'API Keys Active', value: '4' }],
    Illustration: IllustrationAegis,
  },
  {
    key: 'lmlens', name: 'LM Lens', href: '/dashboard/ai',
    status: 'Processing', statusColor: '#f59e0b',
    stats: [{ label: 'Docs Indexed', value: '128' }, { label: 'Collections', value: '4' }],
    Illustration: IllustrationLMLens,
  },
  {
    key: 'natraj', name: 'Natraj', href: '/dashboard/ai',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Sessions', value: '0' }, { label: 'Models', value: '3' }],
    Illustration: IllustrationNatraj,
  },
  {
    key: 'rux', name: 'RUX', href: '/dashboard/compute',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Deployments', value: '0' }, { label: 'Agents', value: '0' }],
    Illustration: IllustrationRUX,
  },
  {
    key: 'vajra', name: 'Vajra', href: '/dashboard/compute',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'GPU Jobs', value: '0' }, { label: 'Avg Latency', value: '—' }],
    Illustration: IllustrationVajra,
  },
  {
    key: 'kriya', name: 'Kriya', href: '/dashboard/compute',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Workflows', value: '0' }, { label: 'Runs Today', value: '0' }],
    Illustration: IllustrationKriya,
  },
  {
    key: 'oneonone', name: 'Connectt.live', href: '/dashboard/ai',
    status: 'Operational', statusColor: '#4caf50',
    stats: [{ label: 'Sessions', value: '0' }, { label: 'Mentors', value: '0' }],
    Illustration: IllustrationOneOnOne,
  },
]

/* ── Page ──────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [showAll, setShowAll] = useState(false)
  const visibleProducts = showAll ? PRODUCT_STATUS : PRODUCT_STATUS.slice(0, 3)
  return (
    <DashboardLayout>
      <style>{`
        .db-cards    { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; }
        .db-ws-stats { display:grid; grid-template-columns:repeat(4,1fr); gap:0; }
        @media(max-width:768px){ .db-cards { grid-template-columns:repeat(2,1fr); } .db-ws-stats { grid-template-columns:repeat(2,1fr); } }
        @media(max-width:480px){ .db-cards { grid-template-columns:1fr; } }
        .product-status-card:hover { box-shadow: 0 0 0 1.5px var(--color-kumo-brand), 0 4px 16px rgba(0,0,0,0.08); }
        .product-status-card { transition: box-shadow 0.15s; }
      `}</style>

      <div style={{ display:'flex', flexDirection:'column', flexGrow:1, background:'var(--color-kumo-canvas)' }}>
        <div style={{ margin:'0 auto', width:'100%', maxWidth:1000, padding:'2rem 1rem 3rem', display:'flex', flexDirection:'column', gap:'2rem' }}>

          {/* ── Hero ── */}
          <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
            <div>
              <p style={{ fontSize:12, fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--text-color-kumo-subtle)', margin:'0 0 0.35rem', fontFamily:'Inter,var(--font-sans)', opacity:0.6 }}>NavHub Command Center</p>
              <h1 style={{ fontSize:'1.6rem', fontWeight:600, color:'var(--text-color-kumo-default)', margin:'0 0 0.3rem', fontFamily:'Inter,var(--font-sans)', letterSpacing:'-0.02em', lineHeight:1.2 }}>
                Welcome back, Swastik
              </h1>
              <p style={{ fontSize:13, color:'var(--text-color-kumo-subtle)', margin:0, fontFamily:'Inter,var(--font-sans)' }}>
                Manage AI, Security, and Research products from one unified workspace.
              </p>
            </div>

            {/* Search bar */}
            <div style={{ width:'100%', maxWidth:560, background:'var(--color-kumo-elevated)', borderRadius:16, boxShadow:'0 0 0 1px var(--color-kumo-line)' }}>
              <div style={{ padding:6 }}>
                <label style={{ display:'flex', alignItems:'center', background:'var(--color-kumo-base)', borderRadius:10, boxShadow:'0 0 0 1px var(--color-kumo-line), 0 2px 6px rgba(0,0,0,0.2)', height:40, overflow:'hidden', cursor:'text' }}>
                  <span style={{ display:'flex', alignItems:'center', paddingLeft:10, color:'var(--text-color-kumo-subtle)', flexShrink:0 }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                    </svg>
                  </span>
                  <input
                    placeholder="Search products, docs, APIs, teams..."
                    readOnly
                    style={{ flex:1, border:'none', background:'transparent', outline:'none', fontSize:13, color:'var(--text-color-kumo-default)', padding:'0 12px', fontFamily:'Inter,var(--font-sans)' }}
                  />
                  <span style={{ display:'flex', alignItems:'center', gap:4, paddingRight:10, flexShrink:0 }}>
                    <kbd style={kbd}>Ctrl</kbd>
                    <kbd style={kbd}>K</kbd>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* ── Workspace Overview ── */}
          <section>
            <h2 style={{ ...sectionTitle, marginBottom:'0.6rem' }}>Workspace Overview</h2>
            <div className="db-ws-stats" style={{ borderRadius:12, border:'1px solid var(--color-kumo-line)', overflow:'hidden', background:'var(--color-kumo-base)' }}>
              {WORKSPACE_STATS.map((s, i) => (
                <div key={s.label} style={{ padding:'1rem 1.25rem', borderRight: i < WORKSPACE_STATS.length - 1 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                  <p style={{ fontSize:11, color:'var(--text-color-kumo-subtle)', margin:'0 0 4px', fontFamily:'Inter,var(--font-sans)', textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:600 }}>{s.label}</p>
                  <p style={{ fontSize:'1.35rem', fontWeight:600, color:'var(--text-color-kumo-default)', margin:0, fontFamily:'Inter,var(--font-sans)', letterSpacing:'-0.02em' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Products ── */}
          <section>
            <div style={{ marginBottom:'0.75rem' }}>
              <h2 style={sectionTitle}>Products</h2>
              <p style={{ fontSize:13, color:'var(--text-color-kumo-subtle)', margin:'0.25rem 0 0', fontFamily:'Inter,var(--font-sans)' }}>
                Live status across all Navchetna platforms.
              </p>
            </div>
            <div className="db-cards">
              {visibleProducts.map(p => (
                <div key={p.key} className="product-status-card" style={recCard}>
                  <div style={{ aspectRatio:'16/9', width:'100%', borderRadius:8, overflow:'hidden', border:'1px solid var(--color-kumo-line)', flexShrink:0 }}>
                    <p.Illustration />
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, padding:'0.25rem' }}>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <p style={{ fontSize:14, fontWeight:600, color:'var(--text-color-kumo-default)', margin:0, fontFamily:'Inter,var(--font-sans)' }}>{p.name}</p>
                      <span style={{ display:'inline-flex', alignItems:'center', gap:4, fontSize:11, fontWeight:600, color: p.statusColor, fontFamily:'Inter,var(--font-sans)' }}>
                        <span style={{ width:6, height:6, borderRadius:'50%', background: p.statusColor, display:'inline-block', boxShadow:`0 0 6px ${p.statusColor}` }} />
                        {p.status}
                      </span>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                      {p.stats.map(s => (
                        <div key={s.label} style={{ background:'var(--color-kumo-tint)', borderRadius:8, padding:'0.45rem 0.6rem' }}>
                          <p style={{ fontSize:10, color:'var(--text-color-kumo-subtle)', margin:'0 0 2px', fontFamily:'Inter,var(--font-sans)', textTransform:'uppercase', letterSpacing:'0.05em', fontWeight:600 }}>{s.label}</p>
                          <p style={{ fontSize:14, fontWeight:600, color:'var(--text-color-kumo-default)', margin:0, fontFamily:'Inter,var(--font-sans)' }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                    <Link href={p.href} style={recBtn}>Open →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop:'0.75rem', display:'flex', justifyContent:'center' }}>
              <button
                onClick={() => setShowAll(v => !v)}
                style={{ display:'inline-flex', alignItems:'center', gap:6, height:34, padding:'0 14px', borderRadius:8, border:'none', cursor:'pointer', fontSize:13, fontWeight:500, fontFamily:'Inter,var(--font-sans)', background:'var(--color-kumo-base)', color:'var(--text-color-kumo-subtle)', boxShadow:'0 0 0 1px var(--color-kumo-line)' }}
              >
                {showAll ? 'Show less' : `Show all ${PRODUCT_STATUS.length} products`}
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ transform: showAll ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </section>

          {/* ── Footer status bar ── */}
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0.75rem 1rem', borderRadius:10, border:'1px solid var(--color-kumo-line)', background:'var(--color-kumo-base)' }}>
            <span style={{ display:'inline-flex', alignItems:'center', gap:6, fontSize:12, fontWeight:500, color:'var(--text-color-kumo-subtle)', fontFamily:'Inter,var(--font-sans)' }}>
              <span style={{ width:7, height:7, borderRadius:'50%', background:'#4caf50', display:'inline-block', boxShadow:'0 0 6px #4caf50' }} />
              System Status — All systems operational
            </span>
            <div style={{ display:'flex', gap:'1.5rem' }}>
              {[{ label:'Last Updated', value:'2 min ago' }, { label:'Version', value:'2.1.0' }].map(s => (
                <span key={s.label} style={{ fontSize:12, color:'var(--text-color-kumo-subtle)', fontFamily:'Inter,var(--font-sans)' }}>
                  <span style={{ fontWeight:600, color:'var(--text-color-kumo-default)' }}>{s.label}</span> &nbsp;{s.value}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

/* ── Styles ────────────────────────────────────────────────── */

const kbd: React.CSSProperties = {
  display:'inline-flex', alignItems:'center', justifyContent:'center',
  height:20, minWidth:20, padding:'0 4px', borderRadius:4,
  fontSize:11, fontWeight:500, fontFamily:'Inter,var(--font-sans)',
  background:'var(--color-kumo-tint)', color:'var(--text-color-kumo-subtle)',
  border:'1px solid var(--color-kumo-line)',
}

const recCard: React.CSSProperties = {
  display:'flex', flexDirection:'column', gap:8,
  background:'var(--color-kumo-base)', borderRadius:12,
  boxShadow:'0 0 0 1px var(--color-kumo-line)',
  padding:8, overflow:'hidden',
}

const recBtn: React.CSSProperties = {
  display:'inline-flex', alignItems:'center', height:28, padding:'0 10px',
  borderRadius:7, border:'none', cursor:'pointer',
  fontSize:11, fontWeight:500, fontFamily:'Inter,var(--font-sans)',
  background:'var(--color-kumo-base)', color:'var(--text-color-kumo-default)',
  boxShadow:'0 0 0 1px var(--color-kumo-line)', textDecoration:'none',
  alignSelf:'flex-start',
}

const sectionTitle: React.CSSProperties = {
  fontSize:15, fontWeight:600, color:'var(--text-color-kumo-default)',
  margin:0, fontFamily:'Inter,var(--font-sans)',
}


