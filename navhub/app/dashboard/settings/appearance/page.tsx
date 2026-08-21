import SettingsLayout from '@/components/settings-layout'
export default function AppearancePage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Appearance</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Customize theme, density, and visual preferences.</p>
    </SettingsLayout>
  )
}
