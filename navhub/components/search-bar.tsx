'use client'

import { MagnifyingGlass } from '@phosphor-icons/react'

export default function SearchBar() {
  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <MagnifyingGlass
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: 'var(--text-color-kumo-subtle)' }}
      />
      <input
        type="text"
        placeholder="Search"
        aria-label="Search"
        className="w-full h-10 rounded-xl border-0 outline-none text-sm pl-9 pr-4 transition-shadow"
        style={{
          background: 'var(--color-kumo-base)',
          color: 'var(--text-color-kumo-default)',
          boxShadow: '0 0 0 1px var(--color-kumo-line)',
        }}
      />
    </div>
  )
}
