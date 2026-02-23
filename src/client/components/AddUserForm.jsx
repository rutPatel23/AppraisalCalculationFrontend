import React, { useState } from 'react'

export default function AddUserForm({ onClose }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [role, setRole] = useState('hr')
  const [email,setEmail] = useState('')
  const [msg, setMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    if (!username || !password || !confirm) return setMsg('Fill all fields')
    if (password !== confirm) return setMsg('Passwords do not match')
    if (email == null) return setMsg('Email cannot be empty')
    try {
      const res = await fetch('https://appraisalcalculationbackend.onrender.com/api/add_user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: localStorage.getItem('user'), username, password, role,email })
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || res.statusText)
      setMsg('User created')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <form className="card adduser-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Password</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Confirm Password</label>
        <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} />
      </div>
      <div className="form-row">
        <label>E-mail</label>
        <input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div className="form-row">
        <label>Role</label>
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="form-actions">
        <button className="btn" type="submit">Create</button>
        <button type="button" className="btn" onClick={onClose}>Close</button>
        <span className="form-msg" style={{ color: msg && msg.includes('created') ? '#22c55e' : '#ef4444' }}>{msg}</span>
      </div>
    </form>
  )
}
