import React, { useState, useEffect } from 'react'

export default function SetRoleForm({ users = [], onClose }) {
  const [username, setUsername] = useState(users.length ? users[0].username : '')
  const [role, setRole] = useState('hr')
  const [canAdd, setCanAdd] = useState(false)
  const [canUpdate, setCanUpdate] = useState(false)
  const [canDelete, setCanDelete] = useState(false)
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (users && users.length) setUsername(users[0].username)
  }, [users])

  const loadPerms = async (u) => {
    if (!u) return
    try {
      const r = await fetch(`/api/permissions/${encodeURIComponent(u)}`)
      if (r.ok) {
        const p = await r.json()
        setCanAdd(!!p.can_add)
        setCanUpdate(!!p.can_update)
        setCanDelete(!!p.can_delete)
      }
    } catch (_) {}
  }

  useEffect(() => { loadPerms(username) }, [username])

  const handleSubmit = async (e) => {
    e.preventDefault(); setMsg('')
    if (!username || !role) return setMsg('Fill all fields')
    try {
      const res = await fetch('/api/set_role', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: localStorage.getItem('user'), username, role })
      })
      const data = await res.json().catch(()=>({}))
      if (!res.ok) throw new Error(data.error || res.statusText)
      const rp = await fetch('/api/set_permissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor: localStorage.getItem('user'), username, can_add: canAdd, can_update: canUpdate, can_delete: canDelete })
      })
      const pdata = await rp.json().catch(()=>({}))
      if (!rp.ok) throw new Error(pdata.error || rp.statusText)
      setMsg('Role and permissions updated')
    } catch (err) {
      setMsg(err.message)
    }
  }

  return (
    <form className="card" style={{ padding: 12 }} onSubmit={handleSubmit}>
      <label>Username</label>
      <select value={username} onChange={e => setUsername(e.target.value)}>
        {users.map(u => <option key={u.username} value={u.username}>{u.username}{u.role ? ` (${u.role})` : ''}</option>)}
      </select>
      <label>Role</label>
      <select value={role} onChange={e => setRole(e.target.value)}>
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        <label><input type="checkbox" checked={canAdd} onChange={e => setCanAdd(e.target.checked)} /> Add data</label>
        <label><input type="checkbox" checked={canUpdate} onChange={e => setCanUpdate(e.target.checked)} /> Update data</label>
        <label><input type="checkbox" checked={canDelete} onChange={e => setCanDelete(e.target.checked)} /> Delete data</label>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
        <button className="btn" type="submit">Update</button>
        <span style={{ color: msg && msg.includes('updated') ? '#22c55e' : '#ef4444' }}>{msg}</span>
        <button type="button" className="btn" onClick={onClose} style={{ marginLeft: 'auto' }}>Close</button>
      </div>
    </form>
  )
}
