'use client'

import { useState } from 'react'
import { Bell, CheckCircle, Warning, Info, X, Check, Funnel } from '@phosphor-icons/react'

type NotifType = 'alert' | 'info' | 'success' | 'warning'
type NotifFilter = 'all' | 'unread' | NotifType

interface Notification {
  id: number
  type: NotifType
  title: string
  body: string
  time: string
  read: boolean
  product: string
}

const INITIAL: Notification[] = [
  { id: 1,  type: 'alert',   title: 'Rate limit exceeded',         body: 'Osmium AI — Nexus 5 model hit 100% of your hourly quota. Requests are being throttled.',                    time: '2 min ago',   read: false, product: 'Osmium AI'   },
  { id: 2,  type: 'success', title: 'Deployment successful',       body: 'Natraj v2.4.1 was deployed to production successfully with zero downtime.',                                  time: '18 min ago',  read: false, product: 'Natraj'      },
  { id: 3,  type: 'warning', title: 'High error rate detected',    body: 'LM Lens is returning 5xx errors on 12% of requests over the last 15 minutes. Investigate logs.',            time: '34 min ago',  read: false, product: 'LM Lens'     },
  { id: 4,  type: 'info',    title: 'New API key created',         body: 'A new API key "prod-key-3" was created by Swastik Khatua from IP 103.21.244.0.',                            time: '1 hr ago',    read: false, product: 'Aegis Auth'  },
  { id: 5,  type: 'success', title: 'SSL certificate renewed',     body: 'TLS certificate for navhub.in was automatically renewed. Valid until March 2027.',                           time: '3 hr ago',    read: true,  product: 'Aegis Auth'  },
  { id: 6,  type: 'alert',   title: 'Storage quota at 90%',        body: 'Your R2 object storage is at 90% capacity (45 GB / 50 GB). Consider upgrading your plan.',                  time: '5 hr ago',    read: true,  product: 'Osmium AI'   },
  { id: 7,  type: 'info',    title: 'Monthly usage report ready',  body: 'Your June 2025 usage report is available. Total tokens used: 2.4M across all models.',                      time: '8 hr ago',    read: true,  product: 'Osmium AI'   },
  { id: 8,  type: 'warning', title: 'Unusual login attempt',       body: 'A login attempt from a new location (Mumbai, IN) was detected. Verify if this was you.',                    time: '12 hr ago',   read: true,  product: 'Aegis Auth'  },
  { id: 9,  type: 'success', title: 'Billing payment processed',   body: 'Payment of ₹4,200 for the Pro plan was successfully processed. Receipt sent to your email.',                time: '1 day ago',   read: true,  product: 'Natraj'      },
  { id: 10, type: 'info',    title: 'New team member added',       body: 'Priya Sharma (priya@navhub.in) was added to your workspace with Developer role.',                           time: '1 day ago',   read: true,  product: 'Aegis Auth'  },
  { id: 11, type: 'alert',   title: 'Webhook delivery failed',     body: 'Webhook to https://api.example.com/hook failed 3 consecutive times. Auto-disabled after 5 failures.',       time: '2 days ago',  read: true,  product: 'LM Lens'     },
  { id: 12, type: 'info',    title: 'Model update available',      body: 'Nexus 5.1 is now available with 20% lower latency and improved reasoning. Upgrade from your AI settings.',  time: '3 days ago',  read: true,  product: 'Osmium AI'   },
]

const TYPE_META: Record<NotifType, { icon: React.FC<{ size?: number; color?: string }>, color: string, bg: string }> = {
  alert:   { icon: Warning,      color: '#ef4444', bg: 'rgba(239,68,68,0.1)'   },
  warning: { icon: Warning,      color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'  },
  success: { icon: CheckCircle,  color: '#22c55e', bg: 'rgba(34,197,94,0.1)'   },
  info:    { icon: Info,         color: '#3b82f6', bg: 'rgba(59,130,246,0.1)'  },
}

const FILTERS: { value: NotifFilter; label: string }[] = [
  { value: 'all',     label: 'All'      },
  { value: 'unread',  label: 'Unread'   },
  { value: 'alert',   label: 'Alerts'   },
  { value: 'warning', label: 'Warnings' },
  { value: 'success', label: 'Success'  },
  { value: 'info',    label: 'Info'     },
]

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>(INITIAL)
  const [filter, setFilter] = useState<NotifFilter>('all')

  const unreadCount = items.filter(n => !n.read).length

  const visible = items.filter(n => {
    if (filter === 'unread') return !n.read
    if (filter === 'all') return true
    return n.type === filter
  })

  function markRead(id: number) {
    setItems(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function dismiss(id: number) {
    setItems(prev => prev.filter(n => n.id !== id))
  }

  function markAllRead() {
    setItems(prev => prev.map(n => ({ ...n, read: true })))
  }

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Bell size={20} style={{ color: 'var(--text-color-kumo-default)' }} />
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span style={{
                background: 'var(--color-kumo-line)',
                color: 'var(--text-color-kumo-default)',
                fontSize: 11,
                fontWeight: 700,
                borderRadius: 99,
                padding: '1px 7px',
                lineHeight: '18px',
              }}>
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllRead}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'transparent', border: '1px solid var(--color-kumo-line)',
                borderRadius: 8, padding: '6px 12px', cursor: 'pointer',
                fontSize: 13, color: 'var(--text-color-kumo-subtle)',
                transition: 'background 150ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <Check size={14} />
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
          <Funnel size={14} style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.5, marginRight: 2 }} />
          {FILTERS.map(f => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              style={{
                padding: '4px 12px',
                borderRadius: 99,
                border: '1px solid',
                borderColor: filter === f.value ? 'var(--text-color-kumo-default)' : 'var(--color-kumo-line)',
                background: filter === f.value ? 'var(--color-kumo-elevated)' : 'transparent',
                color: filter === f.value ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 150ms',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <Bell size={40} style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.2, marginBottom: 12 }} />
            <p style={{ margin: 0, color: 'var(--text-color-kumo-subtle)', fontSize: 14 }}>No notifications here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {visible.map(n => {
              const meta = TYPE_META[n.type]
              const Icon = meta.icon
              return (
                <div
                  key={n.id}
                  onClick={() => markRead(n.id)}
                  style={{
                    display: 'flex', alignItems: 'flex-start', gap: 14,
                    padding: '14px 16px',
                    borderRadius: 12,
                    border: '1px solid',
                    borderColor: n.read ? 'var(--color-kumo-line)' : 'var(--text-color-kumo-default)',
                    background: 'var(--color-kumo-elevated)',
                    cursor: n.read ? 'default' : 'pointer',
                    transition: 'border-color 150ms, background 150ms',
                    position: 'relative',
                  }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 34, height: 34, borderRadius: 8, flexShrink: 0,
                    background: meta.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={17} color={meta.color} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                      <span style={{
                        fontSize: 13, fontWeight: n.read ? 500 : 600,
                        color: 'var(--text-color-kumo-default)',
                      }}>
                        {n.title}
                      </span>
                      {!n.read && (
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%',
                          background: 'var(--text-color-kumo-default)', flexShrink: 0,
                        }} />
                      )}
                      <span style={{
                        marginLeft: 'auto', fontSize: 11,
                        color: 'var(--text-color-kumo-subtle)', whiteSpace: 'nowrap',
                      }}>
                        {n.time}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 12, color: 'var(--text-color-kumo-subtle)', lineHeight: 1.5 }}>
                      {n.body}
                    </p>
                    <span style={{
                      display: 'inline-block', marginTop: 6,
                      fontSize: 11, color: 'var(--text-color-kumo-subtle)',
                      background: 'var(--color-kumo-base)',
                      border: '1px solid var(--color-kumo-line)',
                      borderRadius: 4, padding: '1px 6px',
                    }}>
                      {n.product}
                    </span>
                  </div>

                  {/* Dismiss */}
                  <button
                    type="button"
                    onClick={e => { e.stopPropagation(); dismiss(n.id) }}
                    aria-label="Dismiss"
                    style={{
                      flexShrink: 0, background: 'transparent', border: 'none',
                      cursor: 'pointer', padding: 4, borderRadius: 6,
                      color: 'var(--text-color-kumo-subtle)', opacity: 0.4,
                      transition: 'opacity 150ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                    onMouseLeave={e => (e.currentTarget.style.opacity = '0.4')}
                  >
                    <X size={14} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
    </div>
  )
}
