import React, { useState } from 'react'

export default function PieChart({ values = [], labels = [] }) {
  const [hoveredLabel, setHoveredLabel] = useState('Weights')
  
  const total = values.reduce((a, b) => a + Number(b), 0) || 1
  const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']
  const width = 420
  const height = 270
  const cx = width / 2
  const cy = 180
  const rOuter = 130
  const rInner = 92

  const toXY = (r, ang) => [cx + r * Math.cos(ang), cy + r * Math.sin(ang)]

  let start = Math.PI
  const slices = values.map((val, i) => {
    const frac = Number(val) / total
    const end = start + frac * Math.PI
    const [x1, y1] = toXY(rOuter, start)
    const [x2, y2] = toXY(rOuter, end)
    const [x3, y3] = toXY(rInner, end)
    const [x4, y4] = toXY(rInner, start)
    const largeArc = end - start > Math.PI ? 1 : 0
    const color = colors[i % colors.length]
    const pathD = `M ${x1} ${y1} A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4} Z`
    
    start = end

    return (
      <path
        key={i}
        d={pathD}
        fill={color}
        style={{ cursor: 'pointer' }}
        onMouseEnter={() => setHoveredLabel(`${labels[i]} (${Math.round(frac * 100)}%)`)}
        onMouseLeave={() => setHoveredLabel('Weights')}
      />
    )
  })

  return (
    <div className="pie-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: `${height}px` }}>
        {slices}
        <text
          x={cx}
          y={cy - 6}
          fill="var(--fg)"
          fontSize="16"
          textAnchor="middle"
          fontWeight="600"
        >
          {hoveredLabel}
        </text>
      </svg>
      <div className="legend">
        {labels.map((l, i) => (
          <div key={i} className="legend-item">
            <span className="dot" style={{ background: colors[i % colors.length] }}></span>
            {l}
          </div>
        ))}
      </div>
    </div>
  )
}
