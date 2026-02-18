import React, { useState, useRef } from 'react'

function segmentPath(cx, cy, r, startAngle, endAngle) {
  const start = polar(cx, cy, r, startAngle)
  const end = polar(cx, cy, r, endAngle)
  const large = endAngle - startAngle > Math.PI ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}

function polar(cx, cy, r, angle) {
  return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
}

export default function WeightsGauge({ data = [], size = 220 }) {
  const [hover, setHover] = useState(null)
  const cx = size / 2
  const cy = size / 2
  const r = (size / 2) - 18
  // data assumed array of { label, value } where values sum to 100
  const total = data.reduce((s, d) => s + (Number(d.weightpercentage) || 0), 0) || 100
  let angle = -Math.PI

  const segments = data.map((d) => {
    const portion = (Number(d.weightpercentage) || 0) / total
    const seg = { ...d, portion, start: angle }
    angle += portion * Math.PI
    seg.end = angle
    return seg
  })

  const colorMap = ['#3b82f6','#f59e0b','#ef4444','#10b981','#a78bfa']

  const wrapRef = useRef(null)

  const tooltipStyle = hover && hover.evt && wrapRef.current ? (() => {
    const rect = wrapRef.current.getBoundingClientRect()
    const x = hover.evt.clientX - rect.left
    const y = hover.evt.clientY - rect.top
    return { left: x + 8, top: Math.max(4, y - 36) }
  })() : { left: '50%', top: 6 }

  return (
    <div className="gauge-wrap" ref={wrapRef} style={{ width: size }}>
      <svg width={size} height={size/1.2} viewBox={`0 0 ${size} ${size/1.2}`}>
        <g transform={`translate(0,10)`}>
          {segments.map((s, idx) => (
            <path
              key={idx}
              d={segmentPath(cx, cy, r, s.start + 0.005, s.end - 0.005)}
              stroke={colorMap[idx % colorMap.length]}
              strokeWidth={26}
              strokeLinecap="round"
              fill="none"
              onMouseEnter={(e) => setHover({ idx, s, evt: e })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: 'pointer' }}
            />
          ))}
          <circle cx={cx} cy={cy} r={r-30} fill="var(--bg)" stroke="transparent" />
        </g>
      </svg>
      <div className="gauge-legend">
        {data.map((d, i) => (
          <div className="gauge-legend-item" key={i} onMouseEnter={() => setHover({ idx:i, s:d })} onMouseLeave={() => setHover(null)}>
            <span className="dot" style={{ background: colorMap[i % colorMap.length] }}></span>
            <span className="lbl">{d.metric || d.label}</span>
            <span className="val">{d.weightpercentage}%</span>
          </div>
        ))}
      </div>
      {hover && (
        <div className="gauge-tooltip" style={tooltipStyle}>
          <strong>{hover.s.metric || hover.s.label}</strong>
          <div>{hover.s.weightpercentage}%</div>
        </div>
      )}
    </div>
  )
}
