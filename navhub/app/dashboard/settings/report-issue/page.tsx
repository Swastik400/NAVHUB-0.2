import SettingsLayout from '@/components/settings-layout'
export default function ReportIssuePage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Report Issue</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Submit a bug report or flag something that isn't working.</p>
    </SettingsLayout>
  )
}
