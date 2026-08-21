'use client'

import { useState } from 'react'
import Sidebar from './sidebar'
import Topbar from './topbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-kumo-canvas)', color: 'var(--text-color-kumo-default)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — hidden on mobile unless open */}
      <div className={`fixed inset-y-0 left-0 z-30 h-full md:relative md:z-auto transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenuClick={() => setSidebarOpen(o => !o)} />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <footer className="mt-auto px-4 py-3 border-t" style={{ borderColor: 'var(--color-kumo-line)', background: 'var(--color-kumo-canvas)' }}>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {[
              { label: 'Support',               href: 'https://navhub.in/support' },
              { label: 'System status',          href: 'https://status.navhub.in' },
              { label: 'Terms of Use',           href: 'https://navhub.in/terms' },
              { label: 'Privacy Policy',         href: 'https://navhub.in/privacy' },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs no-underline hover:opacity-80 transition-opacity"
                style={{ color: 'var(--text-color-kumo-subtle)' }}
              >
                {link.label}
              </a>
            ))}
            <span className="text-xs" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.5 }}>© 2026 NavHub, Inc.</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
