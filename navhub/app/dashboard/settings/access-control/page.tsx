import SettingsLayout from '@/components/settings-layout'
export default function AccessControlPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Access Control</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Define roles, permissions, and IP allowlists.</p>
    </SettingsLayout>
  )
}
