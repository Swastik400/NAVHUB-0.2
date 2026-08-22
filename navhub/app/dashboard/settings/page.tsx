'use client'
export default function SettingsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8 py-12">
      <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-color-kumo-default)' }}>Manage Account</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Members, billing, API tokens and preferences.</p>
    </div>
  )
}
