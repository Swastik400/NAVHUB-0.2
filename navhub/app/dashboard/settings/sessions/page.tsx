import SettingsLayout from '@/components/settings-layout'
export default function SessionsPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Sessions</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>View and revoke active sessions across all devices.</p>
    </SettingsLayout>
  )
}
