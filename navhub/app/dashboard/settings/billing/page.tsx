'use client'

import React, { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

const BALANCE = '₹1,668,750.82'
const TOTAL_ADDED = '₹5,01,200'
const TOTAL_SPENT = '₹1,095.9'

export default function BillingPage() {
  const [showRefer, setShowRefer] = useState(false)
  const [copied, setCopied] = useState(false)
  const [filter, setFilter] = useState<'All' | 'In' | 'Out'>('All')
  const [showAddFunds, setShowAddFunds] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(100)
  const [customAmount, setCustomAmount] = useState('')
  const payAmount = customAmount ? Number(customAmount) : selectedAmount
  const [filterProduct, setFilterProduct] = useState('all')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const referLink = 'https://app.navchetna.tech/signup?ref=2e1fa7a6-9ba2-432f-9542-047be7dbaec3'

  function copyRef() {
    navigator.clipboard.writeText(referLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <DashboardLayout>
      <style>{`
        .w-shell {
          display: grid;
          grid-template-columns: 300px 1fr;
          min-height: calc(100vh - 8rem);
        }
        .w-left {
          background: var(--color-kumo-base);
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }
        .w-right {
          display: flex;
          flex-direction: column;
          background: var(--color-kumo-canvas);
          overflow: hidden;
        }
        .refer-gradient {
          background: linear-gradient(135deg, #c4956a 0%, #7a9ac4 100%);
        }
        @media (max-width: 900px) {
          .w-shell { grid-template-columns: 1fr; }
          .w-left { border-right: none; border-bottom: 1px solid var(--color-kumo-line); }
        }
      `}</style>

      <div style={{ position: 'relative' }}>
        <div className="w-shell">

          {/* LEFT PANEL */}
          <div className="w-left">

            {/* Balance */}
            <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid var(--color-kumo-line)' }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-color-kumo-subtle)', marginBottom: '0.6rem', fontFamily: 'Inter, var(--font-sans)' }}>
                NavHub Wallet
              </p>
              <p style={{ fontSize: '2.25rem', fontWeight: 200, color: 'var(--text-color-kumo-default)', letterSpacing: '-0.04em', lineHeight: 1, marginBottom: '0.15rem', fontFamily: 'Inter, var(--font-sans)' }}>
                {BALANCE}
              </p>
              <p style={{ fontSize: 10, color: 'var(--text-color-kumo-subtle)', marginBottom: '1.1rem', fontFamily: 'Inter, var(--font-sans)' }}>
                Available balance
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                <button onClick={() => setShowAddFunds(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0.6rem', borderRadius: 10, background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)', fontSize: '0.7rem', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z" />
                  </svg>
                  Add Money
                </button>
                <button onClick={() => setShowRefer(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0.6rem', borderRadius: 10, background: 'transparent', border: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-subtle)', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z" />
                  </svg>
                  Refer
                </button>
              </div>
            </div>

            {/* Total Added / Spent */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: '1px solid var(--color-kumo-line)' }}>
              <div style={{ padding: '0.8rem 1.1rem', borderRight: '1px solid var(--color-kumo-line)' }}>
                <p style={{ fontSize: 9, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>Total Added</p>
                <p style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--text-color-kumo-default)', marginTop: 2, fontFamily: 'Inter, var(--font-sans)' }}>{TOTAL_ADDED}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 8, fontWeight: 600, padding: '1px 5px', borderRadius: 10, background: 'rgba(76,175,80,0.06)', color: 'rgb(76,175,80)', marginTop: 3 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" />
                  </svg>
                  Inflow
                </span>
              </div>
              <div style={{ padding: '0.8rem 1.1rem' }}>
                <p style={{ fontSize: 9, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>Total Spent</p>
                <p style={{ fontSize: '1rem', fontWeight: 300, color: 'var(--text-color-kumo-default)', marginTop: 2, fontFamily: 'Inter, var(--font-sans)' }}>{TOTAL_SPENT}</p>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 8, fontWeight: 600, padding: '1px 5px', borderRadius: 10, background: 'rgba(233,30,99,0.05)', color: 'rgb(233,30,99)', marginTop: 3 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="7" height="7" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                  </svg>
                  Outflow
                </span>
              </div>
            </div>

            {/* Spending Trend */}
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--color-kumo-line)' }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-color-kumo-subtle)', marginBottom: '0.6rem', fontFamily: 'Inter, var(--font-sans)' }}>Spending Trend</p>
              <div style={{ height: 80, width: '100%' }}>
                <svg viewBox="0 0 259 80" width="100%" height="80" style={{ display: 'block', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="spGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4a9eff" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#4a9eff" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#spGrad)" fillOpacity={0.6} stroke="none"
                    d="M4,78.29C11.6,75.87,19.2,73.45,26.8,73.45C34.4,73.45,42,78.67,49.6,78.67C57.2,78.67,64.8,78.04,72.5,76.77C80.1,75.5,87.7,18.21,95.3,18.21C102.9,18.21,110.5,59.58,118.1,66.61C125.7,73.64,133.3,77.15,140.9,77.15C148.5,77.15,156.1,76.72,163.7,76.72C171.3,76.72,178.9,77.44,186.5,77.44C194.2,77.44,201.8,75.01,209.4,75.01C217,75.01,224.6,77.63,232.2,78.29C239.8,78.96,247.4,79.12,255,79.29L255,80L4,80Z"
                  />
                  <path
                    fill="none" stroke="#4a9eff" strokeWidth={1.5}
                    d="M4,78.29C11.6,75.87,19.2,73.45,26.8,73.45C34.4,73.45,42,78.67,49.6,78.67C57.2,78.67,64.8,78.04,72.5,76.77C80.1,75.5,87.7,18.21,95.3,18.21C102.9,18.21,110.5,59.58,118.1,66.61C125.7,73.64,133.3,77.15,140.9,77.15C148.5,77.15,156.1,76.72,163.7,76.72C171.3,76.72,178.9,77.44,186.5,77.44C194.2,77.44,201.8,75.01,209.4,75.01C217,75.01,224.6,77.63,232.2,78.29C239.8,78.96,247.4,79.12,255,79.29"
                  />
                  <circle cx="255" cy="79.29" r="3.5" fill="#4a9eff" stroke="#fff" strokeWidth={1.5} />
                </svg>
              </div>
            </div>

            {/* Transaction counts */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--color-kumo-line)' }}>
              {[{ label: 'Total', value: '100' }, { label: 'Sent', value: '96' }, { label: 'Received', value: '4' }].map((s, i) => (
                <div key={s.label} style={{ padding: '0.7rem', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                  <p style={{ fontSize: '1.1rem', fontWeight: 300, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{s.value}</p>
                  <p style={{ fontSize: 9, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Refer & Earn */}
            <div style={{ margin: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="refer-gradient" onClick={() => setShowRefer(true)} style={{ padding: '0.8rem 0.9rem', borderRadius: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" style={{ color: '#fff', flexShrink: 0 }}>
                  <path d="M234.29,114.85l-45,38.83L203,211.75a16.4,16.4,0,0,1-24.5,17.82L128,198.49,77.47,229.57A16.4,16.4,0,0,1,53,211.75l13.76-58.07-45-38.83A16.46,16.46,0,0,1,31.08,86l59-4.76,22.76-55.08a16.36,16.36,0,0,1,30.27,0l22.75,55.08,59,4.76a16.46,16.46,0,0,1,9.37,28.86Z" />
                </svg>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 600, color: '#fff', fontFamily: 'Inter, var(--font-sans)' }}>Refer &amp; Earn up to ₹100</p>
                  <p style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.7)', marginTop: 1, fontFamily: 'Inter, var(--font-sans)' }}>0 friends · ₹0 earned</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'rgba(255,255,255,0.6)', flexShrink: 0 }}>
                  <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z" />
                </svg>
              </div>
              <p style={{ fontSize: '9.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-color-kumo-subtle)', marginBottom: '0.4rem', fontFamily: 'Inter, var(--font-sans)' }}>My Referrals</p>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem 0.5rem', borderRadius: 10, border: '1px dashed var(--color-kumo-line)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'var(--text-color-kumo-subtle)', marginBottom: '0.4rem' }}>
                  <path d="M235.36,98.49A12.21,12.21,0,0,0,224.59,90l-61.47-5L139.44,27.67a12.37,12.37,0,0,0-22.88,0L92.88,85,31.41,90a12.45,12.45,0,0,0-7.07,21.84l46.85,40.41L56.87,212.64a12.35,12.35,0,0,0,18.51,13.49L128,193.77l52.62,32.36a12.12,12.12,0,0,0,13.69-.51,12.28,12.28,0,0,0,4.82-13l-14.32-60.42,46.85-40.41A12.29,12.29,0,0,0,235.36,98.49Z" />
                </svg>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-color-kumo-subtle)', textAlign: 'center', fontFamily: 'Inter, var(--font-sans)' }}>No referrals yet</p>
                <p style={{ fontSize: 9, color: 'var(--text-color-kumo-subtle)', textAlign: 'center', marginTop: 2, fontFamily: 'Inter, var(--font-sans)' }}>Share your link to start earning</p>
              </div>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="w-right">

            {/* Transactions header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.1rem 1.25rem 0.6rem' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>Transactions</p>
              <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
                {(['All', 'In', 'Out'] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.25rem 0.6rem', borderRadius: 20, fontSize: '0.67rem', fontWeight: 600, border: filter === f ? 'none' : '1px solid var(--color-kumo-line)', background: filter === f ? 'var(--text-color-kumo-default)' : 'transparent', color: filter === f ? 'var(--color-kumo-canvas)' : 'var(--text-color-kumo-subtle)', cursor: 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>
                    {f}
                  </button>
                ))}
                <button onClick={() => setShowFilter(v => !v)} style={{ width: 28, height: 28, borderRadius: 8, border: showFilter ? 'none' : '1px solid var(--color-kumo-line)', background: showFilter ? 'var(--text-color-kumo-default)' : 'transparent', color: showFilter ? 'var(--color-kumo-canvas)' : 'var(--text-color-kumo-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                    <path d="M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53Z" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filter row */}
            {showFilter && (
              <div style={{ padding: '0.6rem 1.25rem', borderBottom: '1px solid var(--color-kumo-line)', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} style={{ padding: '0.3rem 0.5rem', borderRadius: 8, border: '1px solid var(--color-kumo-line)', background: 'var(--color-kumo-base)', fontSize: '0.68rem', color: 'var(--text-color-kumo-default)', outline: 'none', fontFamily: 'Inter, var(--font-sans)' }}>
                  <option value="all">All Products</option>
                  <option value="lmlens">LMLens</option>
                  <option value="osmium">Osmium AI</option>
                  <option value="aegis">Aegis Auth</option>
                  <option value="natraj">Natraj</option>
                  <option value="oneonone">OneOnOne</option>
                  <option value="nsl">NSL</option>
                  <option value="rux">RUX</option>
                  <option value="vajra">Vajra</option>
                  <option value="kriya">Kriya</option>
                  <option value="leadcontrol">LeadControl</option>
                </select>
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'var(--text-color-kumo-subtle)', flexShrink: 0 }}>
                  <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z" />
                </svg>
                <input type="date" value={filterFrom} onChange={e => setFilterFrom(e.target.value)} style={{ padding: '0.28rem 0.4rem', borderRadius: 8, border: '1px solid var(--color-kumo-line)', background: 'var(--color-kumo-base)', fontSize: '0.68rem', color: 'var(--text-color-kumo-default)', outline: 'none', fontFamily: 'Inter, var(--font-sans)' }} />
                <span style={{ fontSize: '0.68rem', color: 'var(--text-color-kumo-subtle)' }}>→</span>
                <input type="date" value={filterTo} onChange={e => setFilterTo(e.target.value)} style={{ padding: '0.28rem 0.4rem', borderRadius: 8, border: '1px solid var(--color-kumo-line)', background: 'var(--color-kumo-base)', fontSize: '0.68rem', color: 'var(--text-color-kumo-default)', outline: 'none', fontFamily: 'Inter, var(--font-sans)' }} />
              </div>
            )}

            {/* Search */}
            <div style={{ padding: '0.6rem 1.25rem', borderBottom: '1px solid var(--color-kumo-line)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '0.4rem 0.7rem', borderRadius: 10, border: '1px solid var(--color-kumo-line)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'var(--text-color-kumo-subtle)' }}>
                  <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
                </svg>
                <input placeholder="Search transactions..." type="text" value={search} onChange={e => setSearch(e.target.value)} style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: '0.76rem', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }} />
              </div>
            </div>

            {/* Transaction list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 1.25rem 1.25rem' }}>
              <TransactionList filter={filter} search={search} page={page} />
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--color-kumo-line)', flexShrink: 0 }}>
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid var(--color-kumo-line)', background: 'transparent', fontSize: '0.7rem', fontWeight: 600, color: page === 1 ? 'var(--text-color-kumo-subtle)' : 'var(--text-color-kumo-default)', cursor: page === 1 ? 'default' : 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>Prev</button>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>Page {page} of 10</span>
              <button disabled={page === 10} onClick={() => setPage(p => p + 1)} style={{ padding: '0.3rem 0.7rem', borderRadius: 8, border: '1px solid var(--color-kumo-line)', background: 'transparent', fontSize: '0.7rem', fontWeight: 600, color: page === 10 ? 'var(--text-color-kumo-subtle)' : 'var(--text-color-kumo-default)', cursor: page === 10 ? 'default' : 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>Next</button>
            </div>

          </div>
        </div>
      </div>
      {/* Add Funds Modal */}
      {showAddFunds && (
        <div onClick={() => setShowAddFunds(false)} style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 16, width: 360, boxShadow: '0 16px 48px rgba(0,0,0,0.18)', fontFamily: 'Inter, var(--font-sans)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 1.5rem 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'var(--text-color-kumo-default)' }}>
                  <path d="M212,80a12,12,0,0,1-12,12H172a64.07,64.07,0,0,1-64,64h-5l65,59.12a12,12,0,1,1-16.14,17.76l-88-80A12,12,0,0,1,72,132h36a40,40,0,0,0,40-40H72a12,12,0,0,1,0-24h68a40,40,0,0,0-32-16H72a12,12,0,0,1,0-24H200a12,12,0,0,1,0,24H157.91a64,64,0,0,1,9.4,16H200A12,12,0,0,1,212,80Z" />
                </svg>
                <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-color-kumo-default)', margin: 0 }}>Add Funds</h2>
              </div>
              <button onClick={() => setShowAddFunds(false)} style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--color-kumo-tint)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-color-kumo-subtle)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            </div>
            <div style={{ padding: '1.25rem 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                {[50, 100, 250, 500, 1000].map(amt => (
                  <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount('') }} style={{ padding: '0.5rem 0.85rem', borderRadius: 9, background: selectedAmount === amt && !customAmount ? 'var(--text-color-kumo-default)' : 'var(--color-kumo-tint)', color: selectedAmount === amt && !customAmount ? 'var(--color-kumo-canvas)' : 'var(--text-color-kumo-subtle)', fontSize: '0.78rem', fontWeight: 600, border: '1px solid var(--color-kumo-line)', cursor: 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>₹{amt}</button>
                ))}
              </div>
              <div style={{ marginBottom: '1.25rem' }}>
                <label style={{ fontSize: '9.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-color-kumo-subtle)', marginBottom: 5, display: 'block', fontFamily: 'Inter, var(--font-sans)' }}>Custom Amount</label>
                <input min={10} max={500000} placeholder="Enter amount" type="number" value={customAmount} onChange={e => setCustomAmount(e.target.value)} style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: 11, background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)', fontSize: '0.85rem', color: 'var(--text-color-kumo-default)', outline: 'none', boxSizing: 'border-box', fontFamily: 'Inter, var(--font-sans)' }} />
              </div>
              <button style={{ width: '100%', padding: '0.7rem', borderRadius: 11, background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)', fontSize: '0.82rem', fontWeight: 600, border: 'none', cursor: 'pointer', fontFamily: 'Inter, var(--font-sans)' }}>Pay ₹{payAmount || '—'}</button>
              <p style={{ fontSize: 10, color: 'var(--text-color-kumo-subtle)', textAlign: 'center', marginTop: '0.75rem', fontFamily: 'Inter, var(--font-sans)' }}>Powered by Razorpay • Instant credit</p>
            </div>
          </div>
        </div>
      )}

      {/* Refer Modal */}
      {showRefer && (
        <div onClick={() => setShowRefer(false)} style={{ position: 'absolute', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 14 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 16, padding: '1.5rem', width: 360, boxShadow: '0 16px 48px rgba(0,0,0,0.18)', fontFamily: 'Inter, var(--font-sans)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-color-kumo-default)', margin: 0 }}>Refer &amp; Earn</h2>
              <button onClick={() => setShowRefer(false)} style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--color-kumo-tint)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-color-kumo-subtle)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
                </svg>
              </button>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-color-kumo-subtle)', lineHeight: 1.55, marginBottom: '1.25rem' }}>Earn up to ₹100 for every friend who signs up and makes their first purchase.</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1.25rem' }}>
              <code style={{ flex: 1, fontSize: 11, padding: '0.6rem 0.75rem', borderRadius: 10, background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-subtle)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>{referLink}</code>
              <button onClick={copyRef} style={{ padding: '0.6rem 1rem', borderRadius: 10, background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <div style={{ display: 'flex', padding: '0.85rem', borderRadius: 12, background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)' }}>
              {[{ label: 'Friends', value: '0', color: 'var(--text-color-kumo-default)' }, { label: 'Earned', value: '₹0', color: 'rgb(76,175,80)' }, { label: 'Pending', value: '₹0', color: 'var(--text-color-kumo-default)' }].map((s, i) => (
                <React.Fragment key={s.label}>
                  {i > 0 && <div style={{ width: 1, background: 'var(--color-kumo-line)' }} />}
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ fontSize: '1.15rem', fontWeight: 600, color: s.color, fontFamily: 'Inter, var(--font-sans)' }}>{s.value}</p>
                    <p style={{ fontSize: '9.5px', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>{s.label}</p>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

const TRANSACTIONS = [
  { id: 1, date: '5 Aug 2026',  label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '01:12 pm', type: 'Out' },
  { id: 2, date: '27 Jul 2026', label: 'Pdf extraction',   product: 'LMLens', detail: 'enhanced · 7p',  amount: '−₹6',    time: '10:26 pm', type: 'Out' },
  { id: 3, date: '27 Jul 2026', label: 'Pdf extraction',   product: 'LMLens', detail: 'enhanced · 7p',  amount: '−₹6',    time: '10:26 pm', type: 'Out' },
  { id: 4, date: '27 Jul 2026', label: 'Pdf extraction',   product: 'LMLens', detail: 'enhanced · 7p',  amount: '−₹6',    time: '10:25 pm', type: 'Out' },
  { id: 5, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '12:24 pm', type: 'Out' },
  { id: 6, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '12:24 pm', type: 'Out' },
  { id: 7, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '12:23 pm', type: 'Out' },
  { id: 8, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '12:23 pm', type: 'Out' },
  { id: 9, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p',  amount: '−₹7.5',  time: '12:23 pm', type: 'Out' },
  { id: 10, date: '26 Jul 2026', label: 'Image extraction', product: 'LMLens', detail: 'enhanced · 1p', amount: '−₹7.5',  time: '12:22 pm', type: 'Out' },
  { id: 11, date: '20 Jul 2026', label: 'Wallet top-up',   product: 'NavHub', detail: 'UPI · ref#8821', amount: '+₹5000', time: '09:10 am', type: 'In'  },
]

function TransactionList({ filter, search, page }: { filter: string; search: string; page: number }) {
  const filtered = TRANSACTIONS.filter(t =>
    (filter === 'All' || t.type === filter) &&
    (t.label.toLowerCase().includes(search.toLowerCase()) || t.product.toLowerCase().includes(search.toLowerCase()))
  )

  // Group by date
  const groups: Record<string, typeof TRANSACTIONS> = {}
  filtered.forEach(t => { groups[t.date] = [...(groups[t.date] || []), t] })

  if (filtered.length === 0) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', fontSize: 13 }}>
      No transactions found.
    </div>
  )

  return (
    <>
      {Object.entries(groups).map(([date, txns]) => (
        <div key={date}>
          <p style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-color-kumo-subtle)', letterSpacing: '0.06em', textTransform: 'uppercase', padding: '0.6rem 0 0.3rem', fontFamily: 'Inter, var(--font-sans)' }}>{date}</p>
          <div style={{ borderRadius: 14, border: '1px solid var(--color-kumo-line)', overflow: 'hidden', marginBottom: '0.65rem' }}>
            {txns.map((t, i) => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.7rem 0.85rem', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: t.type === 'In' ? 'rgba(76,175,80,0.06)' : 'rgba(233,30,99,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" style={{ color: t.type === 'In' ? 'rgb(76,175,80)' : 'rgb(233,30,99)' }}>
                    {t.type === 'In'
                      ? <path d="M208.49,152.49l-72,72a12,12,0,0,1-17,0l-72-72a12,12,0,0,1,17-17L116,187V40a12,12,0,0,1,24,0V187l51.51-51.52a12,12,0,0,1,17,17Z" />
                      : <path d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
                    }
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '0.76rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{t.label}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <span style={{ fontSize: '8.5px', fontWeight: 600, padding: '1px 5px', borderRadius: 4, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>{t.product}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>{t.detail}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{t.amount}</p>
                  <p style={{ fontSize: 9, color: 'var(--text-color-kumo-subtle)', marginTop: 2, fontFamily: 'Inter, var(--font-sans)' }}>{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
