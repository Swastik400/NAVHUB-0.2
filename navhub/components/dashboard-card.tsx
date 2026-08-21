'use client'

import { Rocket, ShieldCheck, ChartBar } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface CardData {
  icon: Icon
  title: string
  description: string
  btnText: string
}

const cards: CardData[] = [
  {
    icon: Rocket,
    title: 'Ship something new',
    description: 'Deploy simple sites or full-stack apps with integrated compute, AI, storage, and media services.',
    btnText: 'Create app',
  },
  {
    icon: ShieldCheck,
    title: 'Protect your sites',
    description: 'Add DDoS protection, WAF rules, and bot management to keep your applications secure.',
    btnText: 'Add security',
  },
  {
    icon: ChartBar,
    title: 'Analyze traffic',
    description: 'Get real-time insights into your traffic, performance metrics, and security events.',
    btnText: 'View analytics',
  },
]

function DashboardCard({ icon: Icon, title, description, btnText }: CardData) {
  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-xl transition-colors"
      style={{ background: 'var(--color-kumo-elevated)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
    >
      <div
        className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--color-kumo-base)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
      >
        <Icon size={17} style={{ color: 'var(--accent, #f48120)' }} />
      </div>
      <div className="flex flex-col gap-1.5 flex-1">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>{title}</h3>
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-color-kumo-subtle)' }}>{description}</p>
      </div>
      <button
        type="button"
        className="h-8 px-3 rounded-lg text-sm font-medium border-0 cursor-pointer w-fit transition-colors"
        style={{ background: 'var(--color-kumo-base)', color: 'var(--text-color-kumo-default)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
      >
        {btnText}
      </button>
    </div>
  )
}

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </div>
  )
}
