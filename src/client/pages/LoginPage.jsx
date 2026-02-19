import React, { useState } from 'react'
import logo from "../pages/logo.png";

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setIsError(false)

    try {
      const res = await fetch('https://appraisalcalculationbackend.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({ error: res.statusText }))
        throw new Error(data.error || 'Login failed')
      }

      onLogin(username)
    } catch (err) {
      setIsError(true)
      setMessage(err.message)
    }
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!username) {
      setIsError(true)
      setMessage('Enter your username first')
      return
    }

    setMessage('')
    setIsError(false)

    try {
      const res = await fetch('/api/forgot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) throw new Error(data.error || res.statusText)

      setIsError(false)
      setMessage('Password reset to password123')
    } catch (err) {
      setIsError(true)
      setMessage(err.message)
    }
  }

  return (
    <main style={{ padding: '20px', display: 'grid', placeItems: 'center', minHeight: '100vh' }}>
      <form className="card" style={{ width: '360px', padding: '20px' }} onSubmit={handleSubmit}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
          <img src={logo} alt="TecnoPrism" className="brand large"  />
        </div>
        <h1 style={{ margin: '0 0 12px' }}>Sign In</h1>
        
        <label htmlFor="username">Username</label>
        <input 
          id="username"
          type="text" 
          placeholder="username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: '100%', margin: '6px 0 12px', background: 'rgba(255,255,255,0.06)', color: 'var(--fg)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: '6px' }}
        />
        
        <label htmlFor="password">Password</label>
        <input 
          id="password"
          type="password" 
          placeholder="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', margin: '6px 0 16px', background: 'rgba(255,255,255,0.06)', color: 'var(--fg)', border: '1px solid var(--border)', padding: '8px 10px', borderRadius: '6px' }}
        />
        
        <button type="submit" className="btn" style={{ width: '100%' }}>Sign In</button>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <button 
            type="button"
            onClick={handleForgot}
            style={{ color: '#60a5fa', textDecoration: 'none', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            Forgot password?
          </button>
          <span style={{ color: isError ? '#ef4444' : '#22c55e' }}>{message}</span>
        </div>
      </form>
    </main>
  )
}

export default LoginPage
