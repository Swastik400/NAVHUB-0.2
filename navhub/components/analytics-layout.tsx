'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import DashboardLayout from './dashboard-layout'
import { Suspense } from 'react'

export type AnalyticsSidebarConfig = {
  label: string
  backHref: string
  items: { href: string; label: string }[]
}

const ANALYTICS_CONFIG: AnalyticsSidebarConfig = {
  label: 'Analytics',
  backHref: '/dashboard',
  items: [
    { href: '/dashboard/analytics',             label: 'Overview'     },
    { href: '/dashboard/analytics/usage',       label: 'Usage'        },
    { href: '/dashboard/analytics/performance', label: 'Performance'  },
    { href: '/dashboard/analytics/health',      label: 'Health'       },
    { href: '/dashboard/analytics/caching',     label: 'Caching'      },
    { href: '/dashboard/analytics/rate-limits', label: 'Rate limits'  },
    { href: '/dashboard/analytics/cost',        label: 'Cost'         },
    { href: '/dashboard/analytics/logs',        label: 'Logs'         },
    { href: '/dashboard/analytics/insights',    label: 'Insights'     },
  ],
}

const OSMIUM_CONFIG: AnalyticsSidebarConfig = {
  label: 'Osmium AI',
  backHref: '/dashboard',
  items: [
    { href: '/dashboard/products/osmium-ai',                 label: 'Overview'     },
    { href: '/dashboard/products/osmium-ai?tab=usage',       label: 'Usage'        },
    { href: '/dashboard/products/osmium-ai?tab=performance', label: 'Performance'  },
    { href: '/dashboard/products/osmium-ai?tab=health',      label: 'Health'       },
    { href: '/dashboard/products/osmium-ai?tab=caching',     label: 'Caching'      },
    { href: '/dashboard/products/osmium-ai?tab=rate-limits', label: 'Rate limits'  },
    { href: '/dashboard/products/osmium-ai?tab=cost',        label: 'Cost'         },
    { href: '/dashboard/products/osmium-ai?tab=logs',        label: 'Logs'         },
    { href: '/dashboard/products/osmium-ai?tab=insights',    label: 'Insights'     },
  ],
}

export { ANALYTICS_CONFIG, OSMIUM_CONFIG }

function InnerSidebarContent({ config }: { config: AnalyticsSidebarConfig }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname

  return (
    <aside
      className="shrink-0 border-r flex flex-col h-full overflow-y-auto"
      style={{ width: 200, background: 'var(--color-kumo-canvas)', borderColor: 'var(--color-kumo-line)' }}
    >
      <div className="px-4 pt-5 pb-3">
        <Link
          href={config.backHref}
          className="flex items-center gap-2 text-sm no-underline mb-5 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-color-kumo-default)' }}
        >
          <ArrowLeft size={14} />
          <span>{config.label}</span>
        </Link>
        <ul className="m-0 p-0 list-none flex flex-col gap-0.5">
          {config.items.map(item => {
            const active = currentHref === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-2 rounded-lg min-h-[32px] text-sm font-medium no-underline transition-colors"
                  style={{
                    color: active ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
                    background: active ? 'var(--color-kumo-tint)' : 'transparent',
                  }}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </aside>
  )
}

function InnerSidebar({ config }: { config: AnalyticsSidebarConfig }) {
  return (
    <Suspense fallback={null}>
      <InnerSidebarContent config={config} />
    </Suspense>
  )
}

export default function AnalyticsLayout({
  children,
  config,
}: {
  children: React.ReactNode
  config: AnalyticsSidebarConfig
}) {
  return (
    <DashboardLayout>
      <main className="flex-1 overflow-y-auto w-full h-full">
        {children}
      </main>
    </DashboardLayout>
  )
}
