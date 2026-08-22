'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  House, ClockCounterClockwise, Globe, MagnifyingGlass,
  ChartBar, Cpu, Sparkle, Database, FilmSlate,
  ShieldCheck, Lock, Network, Lightning, Gear, ArrowLeft,
  Sun, Monitor, Moon, CaretRight,
  Users, Wallet, Key, Bell, Sliders, Link as LinkIcon
} from '@phosphor-icons/react'
import { useTheme } from '@/components/theme-provider'
import type { Theme } from '@/components/theme-provider'

const link = (active: boolean, collapsed: boolean) =>
  `flex w-full min-w-0 cursor-pointer items-center rounded-lg min-h-[34px] text-sm font-medium transition-colors no-underline ${collapsed ? 'justify-center px-0' : 'gap-2.5 px-3'} ${
    active ? 'nav-active' : 'nav-item'
  }`

const iconClass = (active: boolean) => `shrink-0 ${active ? 'opacity-100' : 'opacity-60'}`

const sublink = (active: boolean) =>
  `flex w-full min-w-0 cursor-pointer items-center gap-2.5 px-3 rounded-lg min-h-[34px] text-sm font-medium transition-colors no-underline ${
    active ? 'nav-active' : 'nav-item'
  }`

const PANELS: Record<string, { label: string; base: string; isProduct?: boolean; items: { href: string; label: string; icon: string }[] }> = {
  recents: {
    label: 'Recents', base: '/dashboard/recents',
    items: [
      { href: '/dashboard/zero-trust', label: 'Zero Trust', icon: 'Lock' },
      { href: '/dashboard/log-search', label: 'Log search', icon: 'MagnifyingGlass' },
      { href: '/dashboard/overview', label: 'Overview', icon: 'House' },
    ],
  },
  domains: {
    label: 'Domains', base: '/dashboard/domains',
    items: [
      { href: '/dashboard/domains', label: 'All domains', icon: 'Globe' },
      { href: '/dashboard/domains/register', label: 'Register domain', icon: 'Globe' },
      { href: '/dashboard/domains/transfer', label: 'Transfer domain', icon: 'Network' },
    ],
  },
  investigate: {
    label: 'Investigate', base: '/dashboard/investigate',
    items: [
      { href: '/dashboard/investigate/log-search', label: 'Log search', icon: 'MagnifyingGlass' },
      { href: '/dashboard/investigate/events', label: 'Security events', icon: 'ShieldCheck' },
      { href: '/dashboard/investigate/activity', label: 'Activity log', icon: 'ChartBar' },
    ],
  },
  analytics: {
    label: 'Analytics', base: '/dashboard/analytics',
    items: [
      { href: '/dashboard/analytics',             label: 'Overview',    icon: 'House'          },
      { href: '/dashboard/analytics/usage',       label: 'Usage',       icon: 'ChartBar'       },
      { href: '/dashboard/analytics/performance', label: 'Performance', icon: 'Lightning'      },
      { href: '/dashboard/analytics/health',      label: 'Health',      icon: 'ShieldCheck'    },
      { href: '/dashboard/analytics/caching',     label: 'Caching',     icon: 'Lightning'      },
      { href: '/dashboard/analytics/rate-limits', label: 'Rate limits', icon: 'Network'        },
      { href: '/dashboard/analytics/cost',        label: 'Cost',        icon: 'ChartBar'       },
      { href: '/dashboard/analytics/logs',        label: 'Logs',        icon: 'MagnifyingGlass'},
      { href: '/dashboard/analytics/insights',    label: 'Insights',    icon: 'Sparkle'        },
    ],
  },
  compute: {
    label: 'Compute', base: '/dashboard/compute',
    items: [
      { href: '/dashboard/compute/workers', label: 'Workers', icon: 'Cpu' },
      { href: '/dashboard/compute/pages', label: 'Pages', icon: 'FilmSlate' },
      { href: '/dashboard/compute/functions', label: 'Functions', icon: 'Lightning' },
    ],
  },
  ai: {
    label: 'AI', base: '/dashboard/ai',
    items: [
      { href: '/dashboard/ai/models', label: 'Workers AI', icon: 'Sparkle' },
      { href: '/dashboard/ai/gateway', label: 'AI Gateway', icon: 'Network' },
      { href: '/dashboard/ai/vectorize', label: 'Vectorize', icon: 'Sparkle' },
    ],
  },
  storage: {
    label: 'Storage & databases', base: '/dashboard/storage',
    items: [
      { href: '/dashboard/storage/r2', label: 'R2 Object Storage', icon: 'Database' },
      { href: '/dashboard/storage/kv', label: 'KV', icon: 'Database' },
      { href: '/dashboard/storage/d1', label: 'D1 SQL Database', icon: 'Database' },
    ],
  },
  media: {
    label: 'Media', base: '/dashboard/media',
    items: [
      { href: '/dashboard/media/stream', label: 'Stream', icon: 'FilmSlate' },
      { href: '/dashboard/media/images', label: 'Images', icon: 'FilmSlate' },
      { href: '/dashboard/media/calls', label: 'Calls', icon: 'Network' },
    ],
  },
  security: {
    label: 'Application security', base: '/dashboard/security',
    items: [
      { href: '/dashboard/security/waf', label: 'WAF', icon: 'ShieldCheck' },
      { href: '/dashboard/security/ddos', label: 'DDoS protection', icon: 'ShieldCheck' },
      { href: '/dashboard/security/bots', label: 'Bot management', icon: 'ShieldCheck' },
    ],
  },
  networking: {
    label: 'Networking', base: '/dashboard/networking',
    items: [
      { href: '/dashboard/networking/dns', label: 'DNS', icon: 'Network' },
      { href: '/dashboard/networking/tunnels', label: 'Tunnels', icon: 'Network' },
      { href: '/dashboard/networking/load-balancing', label: 'Load balancing', icon: 'Network' },
    ],
  },
  delivery: {
    label: 'Delivery & performance', base: '/dashboard/delivery',
    items: [
      { href: '/dashboard/delivery/cache', label: 'Cache rules', icon: 'Lightning' },
      { href: '/dashboard/delivery/cdn', label: 'CDN settings', icon: 'Lightning' },
      { href: '/dashboard/delivery/rules', label: 'Page rules', icon: 'Lightning' },
    ],
  },
  settings: {
    label: 'Manage account', base: '/dashboard/settings',
    items: [
      { href: '/dashboard/settings/members',       label: 'Members',       icon: 'Users'    },
      { href: '/dashboard/settings/billing',        label: 'Wallet',        icon: 'Wallet'   },
      { href: '/dashboard/settings/api-tokens',     label: 'API tokens',    icon: 'Key'      },
      { href: '/dashboard/settings/notifications',  label: 'Notifications', icon: 'Bell'     },
      { href: '/dashboard/settings/preferences',    label: 'Preferences',   icon: 'Sliders'  },
    ],
  },
  'osmium-ai': {
    label: 'Osmium AI', base: '/dashboard/products/osmium-ai', isProduct: true,
    items: [
      { href: '/dashboard/products/osmium-ai',                  label: 'Overview',    icon: 'House'           },
      { href: '/dashboard/products/osmium-ai?tab=usage',        label: 'Usage',       icon: 'ChartBar'        },
      { href: '/dashboard/products/osmium-ai?tab=performance',  label: 'Performance', icon: 'Lightning'       },
      { href: '/dashboard/products/osmium-ai?tab=health',       label: 'Health',      icon: 'ShieldCheck'     },
      { href: '/dashboard/products/osmium-ai?tab=caching',      label: 'Caching',     icon: 'Lightning'       },
      { href: '/dashboard/products/osmium-ai?tab=rate-limits',  label: 'Rate limits', icon: 'Network'         },
      { href: '/dashboard/products/osmium-ai?tab=cost',         label: 'Cost',        icon: 'ChartBar'        },
      { href: '/dashboard/products/osmium-ai?tab=logs',         label: 'Logs',        icon: 'MagnifyingGlass' },
      { href: '/dashboard/products/osmium-ai?tab=insights',     label: 'Insights',    icon: 'Sparkle'         },
    ],
  },
  'aegis-auth':  { label: 'Aegis Auth',  base: '/dashboard/products/aegis-auth',  isProduct: true, items: [] },
  'lmlens':      { label: 'LMLens',      base: '/dashboard/products/lmlens',      isProduct: true, items: [] },
  'natraj':      { label: 'Natraj',      base: '/dashboard/products/natraj',      isProduct: true, items: [] },
  'oneonone':    { label: 'OneOnOne',    base: '/dashboard/products/oneonone',    isProduct: true, items: [] },
  'nsl':         { label: 'NSL',         base: '/dashboard/products/nsl',         isProduct: true, items: [] },
  'rux':         { label: 'RUX',         base: '/dashboard/products/rux',         isProduct: true, items: [] },
  'vajra':       { label: 'Vajra',       base: '/dashboard/products/vajra',       isProduct: true, items: [] },
  'kriya':       { label: 'Kriya',       base: '/dashboard/products/kriya',       isProduct: true, items: [] },
  'leadcontrol': { label: 'LeadControl', base: '/dashboard/products/leadcontrol', isProduct: true, items: [] },
  'vetting':     { label: 'Vetting',     base: '/dashboard/products/vetting',     isProduct: true, items: [] },
}

const MAIN_NAV_ROUTES = ['/dashboard/settings/api-keys', '/dashboard/settings/webhooks']

function getPanelKey(pathname: string): string | null {
  if (MAIN_NAV_ROUTES.some(r => pathname.startsWith(r))) return null
  for (const [key, panel] of Object.entries(PANELS)) {
    if (pathname.startsWith(panel.base)) return key
  }
  return null
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  House, ClockCounterClockwise, Globe, MagnifyingGlass, ChartBar, Cpu,
  Sparkle, Database, FilmSlate, ShieldCheck, Lock, Network, Lightning, Gear, ArrowLeft, CaretRight,
  Users, Wallet, Key, Bell, Sliders, Link: LinkIcon,
} as Record<string, React.ComponentType<{ size?: number; className?: string }>>

function NavIcon({ name, size = 16, className }: { name: string; size?: number; className?: string }) {
  const Icon = ICON_MAP[name]
  return Icon ? <Icon size={size} className={className} /> : null
}

const THEME_OPTIONS: { value: Theme; label: string }[] = [
  { value: 'light',  label: 'Light' },
  { value: 'system', label: 'System' },
  { value: 'dark',   label: 'Dark' },
]

const THEME_ICONS: Record<Theme, React.FC> = {
  light: () => <Sun size={14} />,
  system: () => <Monitor size={14} />,
  dark: () => <Moon size={14} />,
}

function ThemePill() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div
      className="flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ background: 'var(--color-kumo-elevated)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
    >
      {THEME_OPTIONS.map(opt => {
        const Icon = THEME_ICONS[opt.value]
        const isActive = mounted && theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            aria-pressed={isActive}
            className="flex items-center justify-center w-10 h-5 rounded-md cursor-pointer border-0 transition-colors"
            style={{
              background: isActive ? 'var(--color-kumo-base)' : 'transparent',
              color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              boxShadow: isActive ? '0 0 0 1px var(--color-kumo-line)' : 'none',
            }}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

const PRODUCTS = [
  { href: '/dashboard/products/osmium-ai',   label: 'Osmium AI',    abbr: 'OA', color: '#2563eb', logo: '/osmium-ai-logo.svg' },
  { href: '/dashboard/products/aegis-auth',  label: 'Aegis Auth',   abbr: 'AA',  color: '#7c3aed', logo: '/aegislogo.png' },
  { href: '/dashboard/products/lmlens',      label: 'LMLens',       abbr: 'LM',  color: '#374151', logo: '/lmllenslogo.png' },
  { href: '/dashboard/products/natraj',      label: 'Natraj',       abbr: 'N',   color: '#b45309', logo: '/natrajlogo.png' },
  { href: '/dashboard/products/oneonone',    label: 'Connectt.live',     abbr: '1:1', color: '#0891b2', logo: '/conectlive.png' },
  { href: '/dashboard/products/nsl',         label: 'NSL',          abbr: 'NSL', color: '#374151', logo: '/nsllogo.png' },
  { href: '/dashboard/products/rux',         label: 'RUX',          abbr: 'RUX', color: '#374151', logo: null },
  { href: '/dashboard/products/vajra',       label: 'Vajra',        abbr: 'V',   color: '#6d28d9', logo: null },
  { href: '/dashboard/products/kriya',       label: 'Kriya',        abbr: 'K',   color: '#065f46', logo: null },
  { href: '/dashboard/products/leadcontrol', label: 'LeadControl',  abbr: 'LC',  color: '#1e40af', logo: null },
  { href: '/dashboard/products/vetting',     label: 'Vetting',      abbr: 'VT',  color: '#374151', logo: null },
]

const ALL_NAV_ITEMS = Object.values(PANELS).flatMap(p =>
  p.items.map(item => ({ href: item.href, label: item.label, icon: item.icon, section: p.label }))
)

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentHref = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const effectiveCollapsed = isMobile ? false : collapsed
  const [activePanel, setActivePanel] = useState<string | null>(() => getPanelKey(pathname))
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  // Keep last panel content alive during fade-out transition
  const lastPanelRef = useRef<string | null>(activePanel)
  if (activePanel) lastPanelRef.current = activePanel
  const displayPanel = activePanel ?? lastPanelRef.current
  const panel = displayPanel ? PANELS[displayPanel] : null

  useEffect(() => {
    setActivePanel(getPanelKey(pathname))
  }, [pathname])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setCollapsed(false)
        setActivePanel(null)
        setQuery('\u200b') // zero-width space — mounts the input
        setTimeout(() => { searchRef.current?.focus(); searchRef.current?.select() }, 20)
      }
      if (e.key === 'Escape') {
        setQuery('')
        searchRef.current?.blur()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const searchResults = query.trim().replace(/\u200b/g, '')
    ? ALL_NAV_ITEMS.filter(item =>
        item.label.toLowerCase().includes(query.toLowerCase()) ||
        item.section.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const open = !!activePanel && !query

  return (
    <div
      className="shrink-0 border-r flex flex-col h-full overflow-hidden transition-[width] duration-300"
      style={{ width: effectiveCollapsed ? '57px' : '280px', background: 'var(--color-kumo-canvas)', borderColor: 'var(--color-kumo-line)' }}
    >
      {/* Header */}
      <div
        data-sidebar="header"
        className={`flex shrink-0 items-center border-b px-3 ${effectiveCollapsed ? 'justify-center' : 'gap-1'}`}
        style={{ height: 'var(--header-height, 58px)', borderColor: 'var(--color-kumo-line)' }}
      >
        <a className="translate-y-0.5 cursor-pointer shrink-0" href="/">
          <img src="/group-80.png" alt="NavHub" width="90" height="28" aria-hidden="true" className="navhub-logo" style={{ objectFit: 'contain' }} />
        </a>
        {!effectiveCollapsed && (
            <button
              className="flex items-center justify-between gap-2 w-full min-w-0 px-3 py-1.5 rounded-lg text-left bg-transparent border-0 font-sans cursor-pointer nav-item"
              aria-label="Switch Account"
              type="button"
            >
              <span className="flex flex-col min-w-0 overflow-hidden">
                <span className="block text-sm font-medium truncate leading-snug" style={{ color: 'var(--text-color-kumo-default)' }}>
                  Swastikkhatua4@gmail.com&apos;s Account
                </span>
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 256 256" className="shrink-0" style={{ color: 'var(--text-color-kumo-subtle)' }}>
                <path d="M181.66,170.34a8,8,0,0,1,0,11.32l-48,48a8,8,0,0,1-11.32,0l-48-48a8,8,0,0,1,11.32-11.32L128,212.69l42.34-42.35A8,8,0,0,1,181.66,170.34Zm-96-84.68L128,43.31l42.34,42.35a8,8,0,0,0,11.32-11.32l-48-48a8,8,0,0,0-11.32,0l-48,48A8,8,0,0,0,85.66,85.66Z" />
              </svg>
            </button>
        )}
      </div>

      {/* Search */}
      <div className={`px-2 shrink-0 transition-[margin,opacity] duration-300 ${
        effectiveCollapsed ? 'mb-0 opacity-0 pointer-events-none' : 'mt-2 mb-3 opacity-100'
      }`}>
        {/* Button shown when idle (no query); input shown when active */}
        {query ? (
          <div
            className="flex items-center h-8 rounded-lg px-3 gap-2 text-sm ring-1 transition-colors duration-250"
            style={{ background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256" className="shrink-0 opacity-50" style={{ color: 'var(--text-color-kumo-subtle)' }}>
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Quick search..."
              aria-label="Quick search"
              className="flex-1 bg-transparent border-0 outline-none text-sm min-w-0"
              style={{ color: 'var(--text-color-kumo-default)' }}
            />
            <button
              type="button"
              onClick={() => { setQuery(''); searchRef.current?.blur() }}
              className="shrink-0 opacity-40 hover:opacity-70 bg-transparent border-0 cursor-pointer p-0 flex items-center"
              style={{ color: 'var(--text-color-kumo-subtle)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 256 256">
                <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Quick search"
            onClick={() => { setCollapsed(false); setActivePanel(null); setTimeout(() => { setQuery(' '); setTimeout(() => { setQuery(''); searchRef.current?.focus() }, 0) }, 0) }}
            className="flex items-center w-full h-8 rounded-lg px-3 gap-2 text-sm font-normal cursor-pointer border-0 overflow-hidden transition-colors duration-250 nav-item"
            style={{ background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256"
              className={`shrink-0 opacity-50 transition-transform duration-250 ${effectiveCollapsed ? '-translate-x-1' : 'translate-x-0'}`}
              style={{ color: 'var(--text-color-kumo-subtle)' }}
            >
              <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
            </svg>
            <span className="leading-none whitespace-nowrap text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Quick search...</span>
            <kbd className="ml-auto font-sans text-xs leading-4 whitespace-nowrap flex items-center gap-0.5" style={{ color: 'var(--text-color-kumo-subtle)' }}>
              <span className="opacity-50">Ctrl</span>&nbsp;K
            </kbd>
          </button>
        )}

        {/* Search results */}
        {searchResults.length > 0 && (
          <ul className="mt-1.5 m-0 flex flex-col gap-0.5 list-none">
            {searchResults.map(item => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setQuery('')}
                  className={sublink(pathname === item.href)}
                >
                  <NavIcon name={item.icon} size={16} className={iconClass(pathname === item.href)} />
                  <span className="truncate flex-1">{item.label}</span>
                  <span className="text-xs shrink-0 opacity-40">{item.section}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        {query.replace(/\u200b/g, '').trim() && searchResults.length === 0 && (
          <p className="mt-2 px-1 text-xs" style={{ color: 'var(--text-color-kumo-subtle)' }}>No results for &ldquo;{query}&rdquo;</p>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-hidden relative">

        {/* Main panel */}
        <nav
          className="absolute inset-0 py-2 overflow-y-auto"
          style={{
            transform: open ? 'translateX(-16px)' : 'translateX(0)',
            opacity: open ? 0 : 1,
            pointerEvents: open ? 'none' : 'auto',
            transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1), opacity 160ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          <ul className="px-2 m-0 flex flex-col gap-0.5 list-none">

            {!effectiveCollapsed && <li className="px-3 pt-2 pb-1"><span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.5 }}>Dashboard</span></li>}

            <li className="relative">
              <Link href="/dashboard" onClick={onClose} className={link(pathname === '/dashboard', effectiveCollapsed)}>
                <NavIcon name="House" size={16} className={iconClass(pathname === '/dashboard')} />
                {!effectiveCollapsed && <span className="truncate flex-1">Home</span>}
              </Link>
            </li>

            <li className="relative">
              <Link href="/dashboard/analytics" className={link(pathname.startsWith('/dashboard/analytics'), effectiveCollapsed)}>
                <NavIcon name="ChartBar" size={16} className={iconClass(pathname.startsWith('/dashboard/analytics'))} />
                {!effectiveCollapsed && <><span className="truncate flex-1">Analytics</span><CaretRight size={12} className="shrink-0 opacity-40" /></>}
              </Link>
            </li>

            <li className="relative">
              <Link href="/dashboard/notifications" className={link(pathname.startsWith('/dashboard/notifications'), effectiveCollapsed)}>
                <NavIcon name="ClockCounterClockwise" size={16} className={iconClass(pathname.startsWith('/dashboard/notifications'))} />
                {!effectiveCollapsed && <><span className="truncate flex-1">Notifications</span><CaretRight size={12} className="shrink-0 opacity-40" /></>}
              </Link>
            </li>

            <li className="relative">
              <Link href="/dashboard/settings/api-keys" onClick={onClose} className={link(pathname.startsWith('/dashboard/settings/api-keys'), effectiveCollapsed)}>
                <NavIcon name="Key" size={16} className={iconClass(pathname.startsWith('/dashboard/settings/api-keys'))} />
                {!effectiveCollapsed && <span className="truncate flex-1">API Keys</span>}
              </Link>
            </li>

            <li className="relative">
              <Link href="/dashboard/settings/webhooks" onClick={onClose} className={link(pathname.startsWith('/dashboard/settings/webhooks'), effectiveCollapsed)}>
                <NavIcon name="Link" size={16} className={iconClass(pathname.startsWith('/dashboard/settings/webhooks'))} />
                {!effectiveCollapsed && <span className="truncate flex-1">Webhooks</span>}
              </Link>
            </li>

            {!effectiveCollapsed && <li className="px-3 pt-4 pb-1"><span className="text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.5 }}>Products</span></li>}

            {PRODUCTS.map(product => {
              const panelKey = product.href.split('/').pop()!
              const isActive = activePanel === panelKey || pathname.startsWith(product.href)
              return (
                <li key={product.href} className="relative">
                  <Link
                    href={product.href}
                    onClick={() => setActivePanel(panelKey)}
                    className={link(isActive, effectiveCollapsed)}
                  >
                    {product.logo
                      ? <img src={product.logo} alt="" aria-hidden="true" style={{ width: 16, height: 16, minWidth: 16, borderRadius: 3, objectFit: 'cover', flexShrink: 0, opacity: isActive ? 1 : 0.85 }} />
                      : <span aria-hidden="true" style={{ width: 16, height: 16, minWidth: 16, borderRadius: 3, background: product.color, color: '#fff', fontSize: 9, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{product.abbr}</span>
                    }
                    {!effectiveCollapsed && <><span className="truncate flex-1">{product.label}</span><CaretRight size={12} className="shrink-0 opacity-40" /></>}
                  </Link>
                </li>
              )
            })}

            <li className="my-2 mx-1 border-t" style={{ borderColor: 'var(--color-kumo-line)' }} />

            <li className="relative">
              <button
                type="button"
                onClick={() => setActivePanel('settings')}
                className={link(pathname.startsWith('/dashboard/settings'), effectiveCollapsed)}
                style={{ border: 'none', background: 'transparent', font: 'inherit', textAlign: 'left' }}
              >
                <NavIcon name="Gear" size={16} className={iconClass(pathname.startsWith('/dashboard/settings'))} />
                {!effectiveCollapsed && <><span className="truncate flex-1">Settings</span><CaretRight size={12} className="shrink-0 opacity-40" /></>}
              </button>
            </li>

          </ul>
        </nav>

        {/* Sub-panel — always rendered, animated in/out */}
        <div
          className="absolute inset-0 py-2 overflow-y-auto flex flex-col"
          style={{
            transform: open ? 'translateX(0)' : 'translateX(16px)',
            opacity: open ? 1 : 0,
            pointerEvents: open ? 'auto' : 'none',
            transition: 'transform 200ms cubic-bezier(0.4,0,0.2,1), opacity 160ms cubic-bezier(0.4,0,0.2,1)',
          }}
        >
          {panel && (
            <>
              <div className="flex items-center gap-1 px-2 mb-2">
                <button
                  type="button"
                  onClick={() => setActivePanel(null)}
                  className={sublink(false) + ' flex-1 border-0 bg-transparent'}
                >
                  <ArrowLeft size={16} className="shrink-0 opacity-60" />
                  <span className="truncate flex-1">{panel.label}</span>
                </button>
              </div>
              {panel.items.length > 0 ? (
                <ul className="px-2 m-0 flex flex-col gap-0.5 list-none flex-1">
                  {panel.items.map((item, i) => (
                    <li
                      key={item.href}
                      className="relative"
                      style={{
                        animation: open ? `subitem-in 180ms cubic-bezier(0.4,0,0.2,1) ${40 + i * 30}ms both` : 'none',
                      }}
                    >
                      <Link href={item.href} onClick={onClose} className={sublink(currentHref === item.href)}>
                        <NavIcon name={item.icon} size={16} className={iconClass(pathname === item.href)} />
                        <span className="truncate flex-1">{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-5 pt-2" style={{ animation: open ? 'subitem-in 180ms cubic-bezier(0.4,0,0.2,1) 40ms both' : 'none' }}>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>{panel.label}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-color-kumo-subtle)', opacity: 0.6 }}>No sub-sections yet.</p>
                </div>
              )}
            </>
          )}
        </div>

      </div>

      {/* Footer */}
      <div
        className="mt-auto border-t flex items-center justify-between py-2.5 px-3"
        style={{ borderColor: 'var(--color-kumo-line)', minHeight: '52px' }}
      >
        {/* Theme pill — only when expanded */}
        {!effectiveCollapsed && <ThemePill />}

        {/* Collapse button — hidden on mobile */}
        {!isMobile && (
          <button
            type="button"
            onClick={() => { setCollapsed(c => !c); setActivePanel(null) }}
            className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white/5 cursor-pointer border-0 bg-transparent transition-colors ml-auto"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256" style={{ color: 'var(--text-color-kumo-subtle)' }}>
              <path d="M216,40H40A16,16,0,0,0,24,56V200a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A16,16,0,0,0,216,40ZM40,56H80V200H40ZM216,200H96V56H216V200Z" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  return (
    <Suspense fallback={null}>
      <SidebarInner onClose={onClose} />
    </Suspense>
  )
}
