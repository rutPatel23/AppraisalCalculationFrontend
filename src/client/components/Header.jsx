import React from "react";
import './Dashboard.css';

const Header = ({ role, onThemeToggle }) => (
  <header className="dashboard-header">
    <div className="header-left">
      <img src="/logo.png" alt="Logo" className="logo" />
      <h1>Employee Incremented Details</h1>
      <span className="status-badge">Ready</span>
    </div>
    <div className="header-right">
      <button className="theme-toggle" onClick={onThemeToggle} title="Toggle theme">
        <span role="img" aria-label="moon">🌙</span>
      </button>
      <select className="role-dropdown" value={role} readOnly>
        <option value="hr">HR</option>
      </select>
    </div>
  </header>
);

export default Header;
