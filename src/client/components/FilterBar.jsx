import React from "react";
import './Dashboard.css';

const FilterBar = ({ departments, grades, rows, page, totalPages, onSearch, onDept, onGrade, onRows, onPrev, onNext }) => (
  <div className="filter-bar">
    <input className="search-input" placeholder="Search name or ID" onChange={onSearch} />
    <select className="filter-dropdown" onChange={onDept}>
      <option value="">All Departments</option>
      {departments.map(d => <option key={d} value={d}>{d}</option>)}
    </select>
    <select className="filter-dropdown" onChange={onGrade}>
      <option value="">All Grades</option>
      {grades.map(g => <option key={g} value={g}>{g}</option>)}
    </select>
    <button className="filter-btn">Weights</button>
    <button className="filter-btn">Invalid Data</button>
    <button className="export-btn">Export CSV</button>
    <div className="filter-right">
      <select className="rows-dropdown" value={rows} onChange={onRows}>
        {[5,10,25,50].map(r => <option key={r} value={r}>{r}</option>)}
      </select>
      <div className="pagination">
        <button className="pager-btn" onClick={onPrev}>Prev</button>
        <span>Page {page} of {totalPages}</span>
        <button className="pager-btn" onClick={onNext}>Next</button>
      </div>
    </div>
  </div>
);

export default FilterBar;
