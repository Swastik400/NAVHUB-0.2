'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeft } from '@phosphor-icons/react'
import DashboardLayout from './dashboard-layout'

const SECTIONS = [
  {
    label: 'Account',
    items: [
      { href: '/dashboard/settings/profile',       label: 'Profile' },
      { href: '/dashboard/settings/members',        label: 'Members' },
      { href: '/dashboard/settings/billing',        label: 'Billing' },
      { href: '/dashboard/settings/api-tokens',     label: 'API Tokens' },
      { href: '/dashboard/settings/notifications',  label: 'Notifications' },
    ],
  },
  {
    label: 'Security',
    items: [
      { href: '/dashboard/settings/authentication', label: 'Authentication' },
      { href: '/dashboard/settings/sessions',       label: 'Sessions' },
      { href: '/dashboard/settings/access-control', label: 'Access Control' },
    ],
  },
  {
    label: 'Developer',
    items: [
      { href: '/dashboard/settings/api-keys',    label: 'API Keys' },
      { href: '/dashboard/settings/webhooks',    label: 'Webhooks' },
      { href: '/dashboard/settings/integrations',label: 'Integrations' },
    ],
  },
  {
    label: 'Preferences',
    items: [
      { href: '/dashboard/settings/appearance',         label: 'Appearance' },
      { href: '/dashboard/settings/keyboard-shortcuts', label: 'Keyboard Shortcuts' },
    ],
  },
  {
    label: 'Support',
    items: [
      { href: '/dashboard/settings/help-center',  label: 'Help Center' },
      { href: '/dashboard/settings/report-issue', label: 'Report Issue' },
    ],
  },
]

function SettingsSidebar() {
  const pathname = usePathname()
  return (
    <aside
      className="shrink-0 border-r flex flex-col h-full overflow-y-auto"
      style={{ width: 220, background: 'var(--color-kumo-canvas)', borderColor: 'var(--color-kumo-line)' }}
    >
      <div className="px-4 pt-5 pb-3">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm no-underline mb-5 opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: 'var(--text-color-kumo-default)' }}
        >
          <ArrowLeft size={14} />
          <span>Settings</span>
        </Link>

        {SECTIONS.map(section => (
          <div key={section.label} className="mb-5">
            <p
              className="text-xs font-semibold tracking-wider uppercase px-2 mb-1"
              style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.5 }}
            >
              {section.label}
            </p>
            <ul className="m-0 p-0 list-none flex flex-col gap-0.5">
              {section.items.map(item => {
                const active = pathname === item.href
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
        ))}
      </div>
    </aside>
  )
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout>
      <div className="flex h-full overflow-hidden">
        <SettingsSidebar />
        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>
      </div>
    </DashboardLayout>
  )
}
