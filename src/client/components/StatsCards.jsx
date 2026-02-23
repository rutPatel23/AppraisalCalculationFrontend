import React from "react";
import './Dashboard.css';

const StatsCards = ({ stats }) => (
  <div className="stats-cards">
    {stats.map(({ label, value }, i) => (
      <div className="stats-card" key={i}>
        <div className="stats-value">{value}</div>
        <div className="stats-label">{label}</div>
      </div>
    ))}
  </div>
);

export default StatsCards;
