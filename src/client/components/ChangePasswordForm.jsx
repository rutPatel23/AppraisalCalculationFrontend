import React, { useState } from 'react'

export default function ChangePasswordForm({ onClose }) {
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!current || !next || !confirm) return setMsg('Fill all fields')
    if (next !== confirm) return setMsg('Passwords do not match')
    try {
      const username = localStorage.getItem('user')
      const res = await fetch('/api/change_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, current, next })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || res.statusText)
      setMsg('Password updated')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <form className="card" style={{ padding: 12 }} onSubmit={handleSubmit}>
      <label>Current Password</label>
      <input type="password" value={current} onChange={e => setCurrent(e.target.value)} />
      <label>New Password</label>
      <input type="password" value={next} onChange={e => setNext(e.target.value)} />
      <label>Confirm Password</label>
      <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <button className="btn" type="submit">Update</button>
        <span style={{ color: msg && msg.includes('updated') ? '#22c55e' : '#ef4444' }}>{msg}</span>
        <button type="button" className="btn" onClick={onClose} style={{ marginLeft: 'auto' }}>Close</button>
      </div>
    </form>
  )
}
