import SettingsLayout from '@/components/settings-layout'
export default function KeyboardShortcutsPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Keyboard Shortcuts</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>View and customize keyboard shortcuts across NavHub.</p>
    </SettingsLayout>
  )
}
