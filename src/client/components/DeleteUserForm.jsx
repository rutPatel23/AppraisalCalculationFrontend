import React, { useState, useEffect } from 'react'

export default function DeleteUserForm({ users = [], onClose }) {
  const [username, setUsername] = useState(users.length ? users[0].username : '')
  const [msg, setMsg] = useState('')

  useEffect(()=>{ if (users && users.length) setUsername(users[0].username) }, [users])

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('')
    if (!username) return setMsg('Enter username')
    try {
      const res = await fetch('https://appraisalcalculationbackend.onrender.com/api/delete_user', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: localStorage.getItem('user'), username })
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data.error || res.statusText)
      setMsg('User deleted')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <form className="card" style={{ padding: 12 }} onSubmit={handleSubmit}>
      <label>Username</label>
      <select value={username} onChange={e=>setUsername(e.target.value)}>
        {users.map(u=> <option key={u.username} value={u.username}>{u.username}{u.role? ` (${u.role})`:''}</option>)}
      </select>
      <div style={{ display:'flex', gap:8, alignItems:'center', marginTop:8 }}>
        <button className="btn" type="submit">Delete</button>
        <button type="button" className="btn" onClick={onClose} style={{ marginLeft:'auto' }}>Close</button>
        <span style={{ color: msg && msg.includes('deleted') ? '#22c55e' : '#ef4444' }}>{msg}</span>
      </div>
    </form>
  )
}
