import React from 'react'

export default function BarChart({ values = [], labels = [], max = 100 }) {
  const width = 520
  const barH = 28
  const gap = 10
  const height = labels.length * (barH + gap) + 20
  const barX = 140
  const barW = width - 160
  const scale = (v) => Math.max(0, Math.min(1, v / max)) * barW
  const colorBar = 'var(--accent-1)' // will use CSS fallback via inline style
  const colorBg = 'rgba(255,255,255,0.06)'
  const colorPillBg = 'var(--surface)'
  const colorText = 'var(--fg)'

  let y = 20
  const rows = labels.map((label, i) => {
    const v = Number(values[i])
    const w = Math.round(scale(v))
    const textLabelY = y + 20

    // pill calculation
    const pillW = 36
    const pillH = 18
    const clamp = (n, min, max) => Math.max(min, Math.min(max, n))
    const pillX = clamp(barX + w - pillW - 4, barX + 6, barX + barW - pillW - 6)
    const pillY = y + (barH - pillH) / 2

    const row = (
      <g key={i} className="bar-group">
        <rect x={barX} y={y} width={barW} height={barH} rx="6" fill={colorBg} />
        <rect x={barX} y={y} width={w} height={barH} rx="6" fill="var(--accent-1)" />
        <text x="10" y={textLabelY} fill={colorText} fontSize="13">
          {label}
        </text>
        <g className="value">
          <rect x={pillX} y={pillY} width={pillW} height={pillH} rx="9" fill={colorPillBg} />
          <text x={pillX + pillW / 2} y={pillY + 12} fill={colorText} fontSize="12" textAnchor="middle">
            {v}
          </text>
        </g>
      </g>
    )

    y += barH + gap
    return row
  })

  return (
    <div className="chart">
      <svg width={width} height={height} style={{ display: 'block' }}>
        {rows}
      </svg>
    </div>
  )
}
