import SettingsLayout from '@/components/settings-layout'
export default function ProfilePage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Profile</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Manage your personal information and account details.</p>
    </SettingsLayout>
  )
}
