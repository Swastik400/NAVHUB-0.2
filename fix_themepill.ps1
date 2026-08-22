$file = 'c:\Users\Swast\OneDrive\Desktop\NAVHUB.2\navhub\components\sidebar.tsx'
$content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

$old = @'
function ThemePill() {
'@

# Find start index
$startIdx = $content.IndexOf('function ThemePill() {')
# Find end: the closing } followed by newline then const PRODUCTS
$endMarker = '}' + [System.Environment]::NewLine + [System.Environment]::NewLine + 'const PRODUCTS'
$endIdx = $content.IndexOf($endMarker, $startIdx)
if ($endIdx -lt 0) {
  # try single newline
  $endMarker = '}' + [System.Environment]::NewLine + 'const PRODUCTS'
  $endIdx = $content.IndexOf($endMarker, $startIdx)
}

Write-Host "startIdx: $startIdx  endIdx: $endIdx"

$newBlock = @'
function ThemePill() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  return (
    <div
      className="flex items-center rounded-lg p-0.5 gap-0.5"
      style={{ background: 'var(--color-kumo-elevated)', boxShadow: '0 0 0 1px var(--color-kumo-line)' }}
    >
      {THEME_OPTIONS.map(opt => {
        const Icon = THEME_ICONS[opt.value]
        const isActive = mounted && theme === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => setTheme(opt.value)}
            aria-label={opt.label}
            aria-pressed={isActive}
            className="flex items-center justify-center w-10 h-5 rounded-md cursor-pointer border-0 transition-colors"
            style={{
              background: isActive ? 'var(--color-kumo-base)' : 'transparent',
              color: isActive ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)',
              boxShadow: isActive ? '0 0 0 1px var(--color-kumo-line)' : 'none',
            }}
          >
            <Icon />
          </button>
        )
      })}
    </div>
  )
}

'@

$before = $content.Substring(0, $startIdx)
$after  = $content.Substring($endIdx + 1)  # skip the closing }
$result = $before + $newBlock + $after

[System.IO.File]::WriteAllText($file, $result, [System.Text.Encoding]::UTF8)
Write-Host 'Done'
