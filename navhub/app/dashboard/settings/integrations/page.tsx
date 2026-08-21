import SettingsLayout from '@/components/settings-layout'
export default function IntegrationsPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Integrations</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Connect NavHub with third-party tools and services.</p>
    </SettingsLayout>
  )
}
