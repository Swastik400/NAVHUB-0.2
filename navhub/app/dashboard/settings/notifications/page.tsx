'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard-layout'

interface Toggle {
  email: boolean
  push: boolean
  slack: boolean
}

interface NotifRow {
  id: string
  label: string
  desc: string
  toggle: Toggle
}

interface Section {
  label: string
  rows: NotifRow[]
}

const DEFAULT_TOGGLE: Toggle = { email: true, push: false, slack: false }

const INITIAL_SECTIONS: Section[] = [
  {
    label: 'Security',
    rows: [
      { id: 'new-login',       label: 'New sign-in',             desc: 'When your account is accessed from a new device or location.', toggle: { email: true,  push: true,  slack: false } },
      { id: 'password-change', label: 'Password changed',        desc: 'When your account password is updated.',                       toggle: { email: true,  push: true,  slack: false } },
      { id: 'token-created',   label: 'API token created',       desc: 'When a new API token is generated for your account.',          toggle: { email: true,  push: false, slack: false } },
      { id: 'token-revoked',   label: 'API token revoked',       desc: 'When an existing API token is revoked.',                       toggle: { email: true,  push: false, slack: false } },
    ],
  },
  {
    label: 'Billing',
    rows: [
      { id: 'invoice',         label: 'Invoice available',       desc: 'When a new invoice is generated for your account.',            toggle: { email: true,  push: false, slack: false } },
      { id: 'payment-failed',  label: 'Payment failed',          desc: 'When a payment attempt is unsuccessful.',                      toggle: { email: true,  push: true,  slack: true  } },
      { id: 'plan-changed',    label: 'Plan changed',            desc: 'When your subscription plan is upgraded or downgraded.',       toggle: { email: true,  push: false, slack: false } },
      { id: 'usage-limit',     label: 'Usage limit warning',     desc: 'When you reach 80% or 100% of your plan limits.',              toggle: { email: true,  push: true,  slack: true  } },
    ],
  },
  {
    label: 'Team & Members',
    rows: [
      { id: 'member-invited',  label: 'Member invited',          desc: 'When a new member is invited to your account.',                toggle: { email: true,  push: false, slack: false } },
      { id: 'member-joined',   label: 'Member joined',           desc: 'When an invited member accepts and joins.',                    toggle: { email: true,  push: false, slack: true  } },
      { id: 'member-removed',  label: 'Member removed',          desc: 'When a member is removed from your account.',                  toggle: { email: true,  push: false, slack: false } },
      { id: 'role-changed',    label: 'Role changed',            desc: 'When a member\'s role is updated.',                            toggle: { email: false, push: false, slack: false } },
    ],
  },
  {
    label: 'Products & Activity',
    rows: [
      { id: 'product-update',  label: 'Product updates',         desc: 'New features, improvements, and releases across NavHub.',      toggle: { email: true,  push: false, slack: false } },
      { id: 'incident',        label: 'Incident alerts',         desc: 'When a service incident or outage is detected.',               toggle: { email: true,  push: true,  slack: true  } },
      { id: 'changelog',       label: 'Changelog digest',        desc: 'Weekly summary of what\'s new across NavHub products.',        toggle: { email: true,  push: false, slack: false } },
    ],
  },
]

const CHANNELS: { key: keyof Toggle; label: string; icon: React.ReactNode }[] = [
  {
    key: 'email',
    label: 'Email',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    key: 'push',
    label: 'Push',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    ),
  },
  {
    key: 'slack',
    label: 'Slack',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="13" y="2" width="3" height="8" rx="1.5" /><path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
        <rect x="8" y="14" width="3" height="8" rx="1.5" /><path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
        <rect x="14" y="13" width="8" height="3" rx="1.5" /><path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
        <rect x="2" y="8" width="8" height="3" rx="1.5" /><path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
      </svg>
    ),
  },
]

function Switch({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      style={{
        width: 36, height: 20, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: on ? 'rgb(34,197,94)' : 'var(--color-kumo-tint)',
        position: 'relative', flexShrink: 0, transition: 'background 0.2s',
        boxShadow: '0 0 0 1px var(--color-kumo-line)',
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 19 : 3,
        width: 14, height: 14, borderRadius: '50%',
        background: on ? '#fff' : 'var(--text-color-kumo-subtle)',
        transition: 'left 0.2s',
        opacity: on ? 1 : 0.5,
      }} />
    </button>
  )
}

export default function NotificationsPage() {
  const [sections, setSections] = useState<Section[]>(INITIAL_SECTIONS)
  const [globalEmail, setGlobalEmail] = useState(true)
  const [globalPush, setGlobalPush]   = useState(true)
  const [globalSlack, setGlobalSlack] = useState(false)

  function updateToggle(sectionLabel: string, rowId: string, channel: keyof Toggle, val: boolean) {
    setSections(prev => prev.map(s =>
      s.label !== sectionLabel ? s : {
        ...s,
        rows: s.rows.map(r => r.id !== rowId ? r : { ...r, toggle: { ...r.toggle, [channel]: val } }),
      }
    ))
  }

  function toggleAll(channel: keyof Toggle, val: boolean) {
    setSections(prev => prev.map(s => ({
      ...s,
      rows: s.rows.map(r => ({ ...r, toggle: { ...r.toggle, [channel]: val } })),
    })))
    if (channel === 'email') setGlobalEmail(val)
    if (channel === 'push')  setGlobalPush(val)
    if (channel === 'slack') setGlobalSlack(val)
  }

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Notifications
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
            Choose how and when NavHub notifies you.
          </p>
        </div>

        {/* Global channel toggles */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: 0, padding: '14px 16px 12px', borderBottom: '1px solid var(--color-kumo-line)', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Channels
          </p>
          {CHANNELS.map((ch, i) => {
            const globalVal = ch.key === 'email' ? globalEmail : ch.key === 'push' ? globalPush : globalSlack
            return (
              <div key={ch.key} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                <span style={{ color: 'var(--text-color-kumo-subtle)', display: 'flex', alignItems: 'center' }}>{ch.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{ch.label}</p>
                  <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>
                    {ch.key === 'email' ? 'swastikkhatua4@gmail.com' : ch.key === 'push' ? 'Browser & mobile push notifications' : 'Connect a Slack workspace to enable'}
                  </p>
                </div>
                {ch.key === 'slack' && !globalSlack
                  ? <button style={ghostBtn}>Connect Slack</button>
                  : null
                }
                <Switch on={globalVal} onChange={v => toggleAll(ch.key, v)} />
              </div>
            )
          })}
        </div>

        {/* Per-category rows */}
        {sections.map(section => (
          <div key={section.label}>
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
              {section.label}
            </p>
            <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Column headers */}
              <div style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderBottom: '1px solid var(--color-kumo-line)', gap: 12 }}>
                <div style={{ flex: 1 }} />
                {CHANNELS.map(ch => (
                  <span key={ch.key} style={{ width: 48, textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', flexShrink: 0 }}>
                    {ch.label}
                  </span>
                ))}
              </div>
              {section.rows.map((row, i) => (
                <div key={row.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>{row.label}</p>
                    <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', lineHeight: 1.4 }}>{row.desc}</p>
                  </div>
                  {CHANNELS.map(ch => (
                    <div key={ch.key} style={{ width: 48, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                      <Switch
                        on={row.toggle[ch.key]}
                        onChange={v => updateToggle(section.label, row.id, ch.key, v)}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}

      </div>
    </DashboardLayout>
  )
}

const ghostBtn: React.CSSProperties = {
  height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--color-kumo-line)',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-subtle)',
}
