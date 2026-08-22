'use client'

import DashboardLayout from '@/components/dashboard-layout'

const TABS = ['overview', 'usage', 'performance', 'health', 'caching', 'rate-limits', 'cost', 'logs', 'insights'] as const

function TabBar() {
  return (
    <div className="flex items-center gap-1 px-4 border-b overflow-x-auto no-scrollbar" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
      {TABS.map(tab => {
        const href =
          tab === 'overview' ? '/dashboard/analytics' :
          tab === 'usage'    ? '/dashboard/analytics/usage' :
          `/dashboard/analytics/${tab}`
        const isActive = tab === 'health'
        return (
          <a key={tab} href={href} className="relative px-3 py-2.5 text-sm font-medium no-underline transition-colors"
            style={{ color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)', borderBottom: isActive ? '2px solid var(--color-kumo-brand)' : '2px solid transparent', marginBottom: -1, whiteSpace: 'nowrap' }}>
            {tab === 'rate-limits' ? 'Rate limits' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        )
      })}
    </div>
  )
}

type ServiceStatus = 'Operational' | 'Degraded' | 'Maintenance'

const STATUS_COLOR: Record<ServiceStatus, string> = {
  Operational:  'rgb(34,197,94)',
  Degraded:     'rgb(234,179,8)',
  Maintenance:  'rgb(148,163,184)',
}
const STATUS_BG: Record<ServiceStatus, string> = {
  Operational:  'rgba(34,197,94,0.1)',
  Degraded:     'rgba(234,179,8,0.1)',
  Maintenance:  'rgba(148,163,184,0.1)',
}

function StatusBadge({ status }: { status: ServiceStatus }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 22, padding: '0 8px', borderRadius: 999, fontSize: 12, fontWeight: 500, background: STATUS_BG[status], color: STATUS_COLOR[status] }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[status], flexShrink: 0 }} />
      {status}
    </span>
  )
}

type Service = { name: string; description: string; status: ServiceStatus; uptime: string; latency?: string }

const SERVICES: Service[] = [
  { name: 'API Gateway',       description: 'Handles all inbound API requests and routing',   status: 'Operational',  uptime: '99.98%', latency: '12 ms'  },
  { name: 'Database',          description: 'Primary data store for user and session data',    status: 'Operational',  uptime: '99.99%', latency: '4 ms'   },
  { name: 'Inference Cluster', description: 'AI model inference and token generation',         status: 'Degraded',     uptime: '99.71%', latency: '284 ms' },
  { name: 'Queue',             description: 'Async job processing and background tasks',       status: 'Operational',  uptime: '99.95%', latency: '8 ms'   },
  { name: 'Storage',           description: 'Object storage for files and model artifacts',    status: 'Maintenance',  uptime: '—',      latency: '—'      },
  { name: 'CDN',               description: 'Edge caching and static asset delivery',          status: 'Operational',  uptime: '100%',   latency: '6 ms'   },
]

const INCIDENTS = [
  { time: 'Today, 09:14 AM', title: 'Inference Cluster — elevated latency', status: 'Investigating', color: 'rgb(234,179,8)' },
  { time: 'Today, 06:00 AM', title: 'Storage — scheduled maintenance window', status: 'In progress',   color: 'rgb(148,163,184)' },
  { time: 'Jul 28, 11:42 PM', title: 'API Gateway — brief connection spike',  status: 'Resolved',      color: 'rgb(34,197,94)' },
]

export default function HealthPage() {
  const operational = SERVICES.filter(s => s.status === 'Operational').length
  const total = SERVICES.length

  return (
    <DashboardLayout>
      <TabBar />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 'clamp(1rem, 4vw, 2rem)', width: '100%' }}>

        <div style={{ marginBottom: 8 }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 500, color: 'var(--text-color-kumo-default)', margin: 0 }}>System Health</h1>
          <p style={{ fontSize: 14, color: 'var(--text-color-kumo-subtle)', marginTop: 6, marginBottom: 0 }}>Real-time status of all infrastructure components.</p>
        </div>

        <div style={{ height: 1, background: 'var(--color-kumo-line)', margin: '16px 0 20px' }} />

        {/* Overall banner */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderRadius: 12, marginBottom: 20, background: operational === total ? 'rgba(34,197,94,0.08)' : 'rgba(234,179,8,0.08)', border: `1px solid ${operational === total ? 'rgba(34,197,94,0.25)' : 'rgba(234,179,8,0.25)'}` }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', flexShrink: 0, background: operational === total ? 'rgb(34,197,94)' : 'rgb(234,179,8)' }} />
          <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>
            {operational === total ? 'All systems operational' : `${total - operational} service${total - operational > 1 ? 's' : ''} affected`}
          </span>
          <span style={{ fontSize: 13, color: 'var(--text-color-kumo-subtle)', marginLeft: 4 }}>
            {operational} / {total} services healthy
          </span>
        </div>

        {/* Service grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginBottom: 24 }}>
          {SERVICES.map(svc => (
            <div key={svc.name} style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{svc.name}</span>
                <StatusBadge status={svc.status} />
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', margin: 0, lineHeight: 1.5 }}>{svc.description}</p>
              <div style={{ display: 'flex', gap: 20, paddingTop: 4, borderTop: '1px solid var(--color-kumo-line)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-color-kumo-subtle)' }}>Uptime</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{svc.uptime}</span>
                </div>
                {svc.latency && svc.latency !== '—' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-color-kumo-subtle)' }}>Latency</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-color-kumo-default)', fontVariantNumeric: 'tabular-nums' }}>{svc.latency}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Incidents */}
        <div style={{ background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--color-kumo-line)' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>Recent incidents</span>
          </div>
          {INCIDENTS.map((inc, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px', borderBottom: i < INCIDENTS.length - 1 ? '1px solid var(--color-kumo-line)' : 'none' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: inc.color }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-color-kumo-default)' }}>{inc.title}</div>
                <div style={{ fontSize: 12, color: 'var(--text-color-kumo-subtle)', marginTop: 2 }}>{inc.time}</div>
              </div>
              <span style={{ fontSize: 12, fontWeight: 500, color: inc.color, flexShrink: 0 }}>{inc.status}</span>
            </div>
          ))}
        </div>

      </div>
    </DashboardLayout>
  )
}
