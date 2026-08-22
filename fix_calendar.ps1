$f = 'C:\Users\Swast\OneDrive\Desktop\NAVHUB.2\navhub\app\dashboard\analytics\page.tsx'
$c = [System.IO.File]::ReadAllText($f)
$s = $c.IndexOf('const CELL = 26')
$e = $c.IndexOf('function Shell(')
$before = $c.Substring(0, $s)
$after  = $c.Substring($e)

$mid = @'
const CELL = 26

  return (
    <div ref={ref} style={{ position: 'absolute', right: 0, top: '100%', marginTop: 8, zIndex: 50, display: 'inline-flex', flexDirection: 'row', background: 'var(--color-kumo-base)', border: '1px solid var(--color-kumo-line)', borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', maxWidth: '96vw' }}>
      <div style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-kumo-line)', flexShrink: 0, padding: '6px 0' }}>
        {PRESETS.map(p => (
          <button key={p.value} type="button" onClick={() => applyPreset(p.value)}
            style={{ textAlign: 'left', padding: '5px 14px', border: 'none', cursor: 'pointer', fontSize: 12, whiteSpace: 'nowrap', background: preset === p.value ? 'var(--color-kumo-tint)' : 'transparent', color: preset === p.value ? 'var(--text-color-kumo-default)' : 'var(--text-color-kumo-subtle)', fontWeight: preset === p.value ? 600 : 400 }}>
            {p.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 12, gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <button type="button" onClick={prevMonth} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)', flexShrink: 0 }}><CaretLeft size={11} weight="bold" /></button>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-color-kumo-default)' }}>{MONTHS[viewMonth]} {viewYear}</span>
          <button type="button" onClick={nextMonth} style={{ width: 22, height: 22, borderRadius: 4, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)', flexShrink: 0 }}><CaretRight size={11} weight="bold" /></button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: 2 }}>
          {DAYS.map(d => (
            <div key={d} style={{ width: CELL, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 600, color: 'var(--text-color-kumo-subtle)' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(7, ${CELL}px)`, gap: 2 }}>
          {cells.map((d, i) => {
            if (!d) return <div key={i} style={{ width: CELL, height: CELL }} />
            const isStart = start && isSame(d, start)
            const isEnd = end && isSame(d, end)
            const isToday = isSame(d, today)
            const inRng = inRange(d)
            const isFuture = d > today
            return (
              <button key={i} type="button" disabled={isFuture} onClick={() => pickDay(d)} onMouseEnter={() => setHovered(d)} onMouseLeave={() => setHovered(null)}
                style={{ width: CELL, height: CELL, border: 'none', cursor: isFuture ? 'default' : 'pointer', fontSize: 11, fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.1s', flexShrink: 0, background: (isStart || isEnd) ? 'var(--color-kumo-brand)' : inRng ? 'var(--color-kumo-tint)' : 'transparent', color: (isStart || isEnd) ? '#fff' : isFuture ? 'var(--text-color-kumo-subtle)' : 'var(--text-color-kumo-default)', opacity: isFuture ? 0.35 : 1, outline: isToday && !isStart && !isEnd ? '1.5px solid var(--color-kumo-brand)' : 'none', borderRadius: isStart ? '4px 0 0 4px' : isEnd ? '0 4px 4px 0' : inRng ? 0 : 4 }}>
                {d.getDate()}
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingTop: 8, borderTop: '1px solid var(--color-kumo-line)' }}>
          <span style={{ fontSize: 11, color: 'var(--text-color-kumo-subtle)' }}>
            {start ? start.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
            {' – '}
            {end ? end.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button type="button" onClick={onClose} style={{ height: 26, padding: '0 10px', borderRadius: 6, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 500, background: 'var(--color-kumo-tint)', color: 'var(--text-color-kumo-default)' }}>Cancel</button>
            <button type="button" onClick={applyCustom} disabled={!start} style={{ height: 26, padding: '0 10px', borderRadius: 6, border: 'none', cursor: !start ? 'default' : 'pointer', fontSize: 11, fontWeight: 500, background: 'var(--color-kumo-brand)', color: '#fff', opacity: !start ? 0.4 : 1 }}>Apply</button>
          </div>
        </div>
      </div>
    </div>
  )
}

'@

$result = $before + $mid + $after
[System.IO.File]::WriteAllText($f, $result, [System.Text.Encoding]::UTF8)
Write-Host 'Done'
