import React, { useState } from 'react'

function Bar({ label, value, max = 100 }) {
  const [hover, setHover] = useState(false)
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)))
  return (
    <div className="metric-row" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <div className="metric-label">{label}</div>
      <div className="metric-bar-wrap">
        <div className="metric-bar" style={{ width: `${pct}%` }} />
        <div className="metric-value">{value}</div>
      </div>
      {hover && <div className="metric-tip">{label}: {value}</div>}
    </div>
  )
}

export default function EmployeeMetricsGraph({ details = {} }) {
  // details expected to have kpiscore, attendance, behavioralrating, managerrating
  const metrics = [
    { label: 'KPI Score', value: details.kpiscore ?? 0 },
    { label: 'Attendance', value: details.attendance ?? 0 },
    { label: 'Behavioral Rating', value: details.behavioralrating ?? 0 },
    { label: 'Manager Rating', value: details.managerrating ?? 0 }
  ]

  return (
    <div className="employee-metrics">
      <h3>Input Metrics</h3>
      <div className="metrics-list">
        {metrics.map((m, i) => (
          <Bar key={i} label={m.label} value={m.value} max={100} />
        ))}
      </div>
    </div>
  )
}
