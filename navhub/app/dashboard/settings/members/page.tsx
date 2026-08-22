'use client'

import { useState } from 'react'
type Role = 'Owner' | 'Admin' | 'Developer' | 'Viewer'

interface Member {
  id: number
  name: string
  email: string
  role: Role
  joined: string
  avatar: string
}

interface Invite {
  id: number
  email: string
  role: Role
  sent: string
}

const ROLE_COLORS: Record<Role, { bg: string; color: string }> = {
  Owner:     { bg: 'rgba(234,179,8,0.12)',   color: '#ca8a04' },
  Admin:     { bg: 'rgba(59,130,246,0.12)',   color: '#3b82f6' },
  Developer: { bg: 'rgba(34,197,94,0.12)',    color: '#16a34a' },
  Viewer:    { bg: 'rgba(148,163,184,0.12)',  color: '#64748b' },
}

const ROLES: Role[] = ['Admin', 'Developer', 'Viewer']

const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: 'Swastik Khatua',  email: 'swastikkhatua4@gmail.com', role: 'Owner',     joined: 'Jan 2025', avatar: 'SK' },
  { id: 2, name: 'Aryan Mehta',     email: 'aryan.mehta@navhub.in',   role: 'Admin',     joined: 'Mar 2025', avatar: 'AM' },
  { id: 3, name: 'Priya Sharma',    email: 'priya.sharma@navhub.in',  role: 'Developer', joined: 'Apr 2025', avatar: 'PS' },
  { id: 4, name: 'Rohan Das',       email: 'rohan.das@navhub.in',     role: 'Viewer',    joined: 'May 2025', avatar: 'RD' },
]

const INITIAL_INVITES: Invite[] = [
  { id: 1, email: 'neha.verma@example.com', role: 'Developer', sent: '2 days ago' },
  { id: 2, email: 'karan.joshi@example.com', role: 'Viewer',   sent: '5 days ago' },
]

function Avatar({ initials, size = 32 }: { initials: string; size?: number }) {
  return (
    <span style={{
      width: size, height: size, minWidth: size, borderRadius: '50%',
      background: 'var(--color-kumo-tint)', border: '1px solid var(--color-kumo-line)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: size * 0.34, fontWeight: 600, color: 'var(--text-color-kumo-subtle)',
      fontFamily: 'Inter, var(--font-sans)', userSelect: 'none',
    }}>
      {initials}
    </span>
  )
}

function RoleBadge({ role }: { role: Role }) {
  const { bg, color } = ROLE_COLORS[role]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 20, padding: '0 8px',
      borderRadius: 999, fontSize: 11, fontWeight: 600,
      fontFamily: 'Inter, var(--font-sans)', background: bg, color,
    }}>
      {role}
    </span>
  )
}

function RoleSelect({ value, onChange, disabled }: { value: Role; onChange: (r: Role) => void; disabled?: boolean }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value as Role)}
      disabled={disabled}
      style={{
        height: 30, padding: '0 8px', borderRadius: 7, fontSize: 12, fontWeight: 500,
        fontFamily: 'Inter, var(--font-sans)', cursor: disabled ? 'default' : 'pointer',
        background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)',
        border: '1px solid var(--color-kumo-line)', outline: 'none',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
    </select>
  )
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [invites, setInvites] = useState<Invite[]>(INITIAL_INVITES)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<Role>('Developer')
  const [inviteError, setInviteError] = useState('')
  const [removeId, setRemoveId] = useState<number | null>(null)

  function handleInvite() {
    const email = inviteEmail.trim()
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setInviteError('Enter a valid email address.')
      return
    }
    if (members.some(m => m.email === email) || invites.some(i => i.email === email)) {
      setInviteError('This email is already a member or has a pending invite.')
      return
    }
    setInvites(prev => [...prev, { id: Date.now(), email, role: inviteRole, sent: 'Just now' }])
    setInviteEmail('')
    setInviteError('')
  }

  function handleRoleChange(id: number, role: Role) {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
  }

  function handleRemove(id: number) {
    setMembers(prev => prev.filter(m => m.id !== id))
    setRemoveId(null)
  }

  function handleRevokeInvite(id: number) {
    setInvites(prev => prev.filter(i => i.id !== id))
  }

  return (
      <div style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(1rem,4vw,2rem) clamp(0.75rem,4vw,1.5rem)', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Header */}
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 4px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Members
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', margin: 0, fontFamily: 'Inter, var(--font-sans)' }}>
            {members.length} member{members.length !== 1 ? 's' : ''} in this account
          </p>
        </div>

        {/* Invite */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Invite a member
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="colleague@example.com"
              value={inviteEmail}
              onChange={e => { setInviteEmail(e.target.value); setInviteError('') }}
              onKeyDown={e => e.key === 'Enter' && handleInvite()}
              style={{
                flex: 1, minWidth: 200, height: 36, padding: '0 12px', borderRadius: 8,
                fontSize: 13, fontFamily: 'Inter, var(--font-sans)',
                background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
                border: inviteError ? '1px solid rgb(239,68,68)' : '1px solid var(--color-kumo-line)',
                outline: 'none',
              }}
            />
            <select
              value={inviteRole}
              onChange={e => setInviteRole(e.target.value as Role)}
              style={{
                height: 36, padding: '0 10px', borderRadius: 8, fontSize: 13,
                fontFamily: 'Inter, var(--font-sans)', cursor: 'pointer',
                background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)',
                border: '1px solid var(--color-kumo-line)', outline: 'none',
              }}
            >
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <button
              onClick={handleInvite}
              style={{
                height: 36, padding: '0 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                fontSize: 13, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
                background: 'var(--text-color-kumo-default)', color: 'var(--color-kumo-canvas)',
              }}
            >
              Send invite
            </button>
          </div>
          {inviteError && (
            <p style={{ fontSize: 12, color: 'rgb(239,68,68)', margin: '8px 0 0', fontFamily: 'Inter, var(--font-sans)' }}>
              {inviteError}
            </p>
          )}
        </div>

        {/* Members list */}
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Current members
          </p>
          <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
            {members.map((m, i) => (
              <div
                key={m.id}
                style={{
                  display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px 12px',
                  padding: '12px 16px',
                  borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none',
                }}
              >
                <Avatar initials={m.avatar} />
                <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.name}
                  </p>
                  <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.email}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 8px', marginLeft: 'auto' }}>
                  <span style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)', whiteSpace: 'nowrap' }}>
                    Joined {m.joined}
                  </span>
                  {m.role === 'Owner' ? (
                    <RoleBadge role="Owner" />
                  ) : (
                    <RoleSelect value={m.role} onChange={r => handleRoleChange(m.id, r)} />
                  )}
                  {m.role !== 'Owner' && (
                    removeId === m.id ? (
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => handleRemove(m.id)} style={{ ...dangerBtn }}>Remove</button>
                        <button onClick={() => setRemoveId(null)} style={{ ...ghostBtn }}>Cancel</button>
                      </div>
                    ) : (
                      <button onClick={() => setRemoveId(m.id)} style={{ ...ghostBtn }}>Remove</button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending invites */}
        {invites.length > 0 && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 10px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
              Pending invites
            </p>
            <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
              {invites.map((inv, i) => (
                <div
                  key={inv.id}
                  style={{
                    display: 'flex', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px 12px',
                    padding: '12px 16px',
                    borderTop: i > 0 ? '1px solid var(--color-kumo-line)' : 'none',
                  }}
                >
                  <Avatar initials={inv.email[0].toUpperCase()} />
                  <div style={{ flex: '1 1 140px', minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {inv.email}
                    </p>
                    <p style={{ fontSize: 12, margin: 0, color: 'var(--text-color-kumo-subtle)', fontFamily: 'Inter, var(--font-sans)' }}>
                      Invited {inv.sent}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px 8px', marginLeft: 'auto' }}>
                    <RoleBadge role={inv.role} />
                    <button onClick={() => handleRevokeInvite(inv.id)} style={{ ...ghostBtn }}>
                      Revoke
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Roles legend */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '1.25rem' }}>
          <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 12px', color: 'var(--text-color-kumo-default)', fontFamily: 'Inter, var(--font-sans)' }}>
            Role permissions
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 10 }}>
            {([
              { role: 'Owner' as Role,     desc: 'Full access. Manage billing, members, and all settings.' },
              { role: 'Admin' as Role,     desc: 'Manage members and most settings. Cannot change billing.' },
              { role: 'Developer' as Role, desc: 'Access products and APIs. Cannot manage members.' },
              { role: 'Viewer' as Role,    desc: 'Read-only access to dashboards and analytics.' },
            ]).map(({ role, desc }) => (
              <div key={role} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ flexShrink: 0, width: 80 }}>
                <RoleBadge role={role} />
              </div>
                <p style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', margin: 0, lineHeight: 1.5, fontFamily: 'Inter, var(--font-sans)' }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
  )
}

const ghostBtn: React.CSSProperties = {
  height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid var(--color-kumo-line)',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-subtle)',
}

const dangerBtn: React.CSSProperties = {
  height: 30, padding: '0 10px', borderRadius: 7, border: '1px solid rgba(239,68,68,0.4)',
  cursor: 'pointer', fontSize: 12, fontWeight: 500, fontFamily: 'Inter, var(--font-sans)',
  background: 'rgba(239,68,68,0.08)', color: 'rgb(239,68,68)',
}
