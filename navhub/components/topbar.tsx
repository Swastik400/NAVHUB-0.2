'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Question, User, SignOut, Gear } from '@phosphor-icons/react'

export default function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userMenuOpen) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [userMenuOpen])

  return (
    <header
      className="sticky top-0 z-20 flex shrink-0 items-center border-b px-4"
      style={{
        height: 'var(--header-height, 58px)',
        borderColor: 'var(--color-kumo-line)',
        background: 'var(--color-kumo-canvas)',
      }}
    >
      {/* Hamburger — mobile only */}
      <button
        type="button"
        aria-label="Open menu"
        onClick={onMenuClick}
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer transition-colors"
        style={{ color: 'var(--text-color-kumo-subtle)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 256 256">
          <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z" />
        </svg>
      </button>

      <div className="ml-auto flex items-center gap-1">

        {/* Support */}
        <Link href="/dashboard/settings" className="kumo-ghost-btn">
          <Question size={15} className="opacity-70" style={{ color: 'var(--text-color-kumo-subtle)' }} />
          <span className="hidden md:inline text-sm">Support</span>
        </Link>

        {/* User menu */}
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="User menu"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onClick={() => setUserMenuOpen(v => !v)}
            className="kumo-ghost-btn !px-0 w-8 justify-center"
          >
            <User size={15} style={{ color: 'var(--text-color-kumo-subtle)' }} />
          </button>

          {userMenuOpen && (
            <div
              className="absolute right-0 mt-1 w-52 rounded-xl border py-1 z-50"
              style={{
                background: 'var(--color-kumo-elevated)',
                borderColor: 'var(--color-kumo-line)',
                boxShadow: '0 8px 32px rgba(0,0,0,.4)',
              }}
            >
              <div className="px-3 py-2 border-b mb-1" style={{ borderColor: 'var(--color-kumo-line)' }}>
                <p className="text-xs font-semibold truncate" style={{ color: 'var(--text-color-kumo-default)' }}>Swastik Khatua</p>
                <p className="text-xs truncate" style={{ color: 'var(--text-color-kumo-subtle)' }}>Swastikkhatua4@gmail.com</p>
              </div>
              {[
                { label: 'Account Settings', icon: Gear,    href: '/dashboard/settings' },
                { label: 'Sign out',          icon: SignOut, href: '/' },
              ].map(({ label, icon: Icon, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-sm no-underline transition-colors"
                  style={{ color: 'var(--text-color-kumo-default)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--color-kumo-tint)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon size={14} className="opacity-60" />
                  {label}
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </header>
  )
}
