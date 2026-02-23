import React, { useState, useRef, useEffect } from 'react'
 
function UserMenu({ user, onLogout, onChangePassword, onAddUser, onSetRole, onDeleteUser, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
 
  const handleTheme = () => {
    onToggleTheme && onToggleTheme()
    setIsOpen(false)
  }
 
  const handleClick = (cb) => {
    if (cb) cb()
    setIsOpen(false)
  }
 
  // ✅ close menu when clicking outside
  useEffect(() => {
    function handleOutsideClick(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
 
    document.addEventListener('mousedown', handleOutsideClick)
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [])
 
  return (
    <div ref={menuRef} className="menu-wrap" id="userMenuWrap">
      <button
        id="userMenuBtn"
        type="button"
        className="btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {user} ▾
      </button>
      <div id="userMenu" className={`menu ${isOpen ? '' : 'hidden'}`} role="menu">
        <button type="button" className="menu-item" id="menuChangePassword" onClick={() => handleClick(onChangePassword)}>
          Change Password
        </button>
        <button type="button" className="menu-item" id="menuAddUser" onClick={() => handleClick(onAddUser)}>
          Add User
        </button>
        <button type="button" className="menu-item" id="menuSetRole" onClick={() => handleClick(onSetRole)}>
          Set Role
        </button>
        <button type="button" className="menu-item" id="menuDeleteUser" onClick={() => handleClick(onDeleteUser)}>
          Delete User
        </button>
        <hr />
        <button type="button" className="menu-item" id="menuTheme" onClick={() => handleTheme()}>
          Toggle Theme
        </button>
        <hr />
        <button
          type="button"
          className="menu-item"
          id="menuLogout"
          onClick={() => { setIsOpen(false); onLogout && onLogout(); }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
 
export default UserMenu