import SettingsLayout from '@/components/settings-layout'
export default function HelpCenterPage() {
  return (
    <SettingsLayout>
      <h1 className="text-xl font-semibold mb-1" style={{ color: 'var(--text-color-kumo-default)' }}>Help Center</h1>
      <p className="text-sm" style={{ color: 'var(--text-color-kumo-subtle)' }}>Browse documentation, guides, and FAQs.</p>
    </SettingsLayout>
  )
}
