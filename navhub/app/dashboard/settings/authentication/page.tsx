import SettingsLayout from '@/components/settings-layout'
export default function AuthenticationPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Authentication</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Manage login methods, SSO, and Aegis Auth configuration.</p>
    </SettingsLayout>
  )
}
