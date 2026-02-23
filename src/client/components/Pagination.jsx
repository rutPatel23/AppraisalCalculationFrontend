import React from "react";
import './Dashboard.css';

const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div className="pagination">
    <button className="pager-btn" onClick={onPrev}>Prev</button>
    <span>Page {page} of {totalPages}</span>
    <button className="pager-btn" onClick={onNext}>Next</button>
  </div>
);

export default Pagination;
