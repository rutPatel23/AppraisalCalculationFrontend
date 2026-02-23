import React, { useState } from "react";
import Header from "./Header";
import FilterBar from "./FilterBar";
import StatsCards from "./StatsCards";
import EmployeeTable from "./EmployeeTable";
import Pagination from "./Pagination";
import './Dashboard.css';

const dummyEmployees = [
  { id: "E001", name: "Ashish", department: "IT", currentsalary: 80000, grade: "A", increment: 10, incrementedsalary: 88000 },
  { id: "E002", name: "Priya", department: "HR", currentsalary: 70000, grade: "B", increment: 8, incrementedsalary: 75600 },
  { id: "E003", name: "Rahul", department: "Finance", currentsalary: 90000, grade: "A", increment: 12, incrementedsalary: 100800 },
  { id: "E004", name: "Sneha", department: "IT", currentsalary: 85000, grade: "C", increment: 7, incrementedsalary: 90950 },
  { id: "E005", name: "Vikas", department: "HR", currentsalary: 75000, grade: "B", increment: 9, incrementedsalary: 81750 },
];

const stats = [
  { label: "Employees", value: dummyEmployees.length },
  { label: "Avg Salary", value: Math.round(dummyEmployees.reduce((a,b)=>a+b.currentsalary,0)/dummyEmployees.length) },
  { label: "Avg Increment %", value: Math.round(dummyEmployees.reduce((a,b)=>a+b.increment,0)/dummyEmployees.length) },
  { label: "Avg Incremented", value: Math.round(dummyEmployees.reduce((a,b)=>a+b.incrementedsalary,0)/dummyEmployees.length) },
];

const departments = [...new Set(dummyEmployees.map(e=>e.department))];
const grades = [...new Set(dummyEmployees.map(e=>e.grade))];

function Dashboard() {
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [rows, setRows] = useState(10);
  const [page, setPage] = useState(1);

  const sortedEmployees = [...dummyEmployees].sort((a,b)=>{
    let aVal = a[sortKey], bVal = b[sortKey];
    if(typeof aVal === "string") aVal = aVal.toLowerCase();
    if(typeof bVal === "string") bVal = bVal.toLowerCase();
    if(aVal < bVal) return sortOrder === "asc" ? -1 : 1;
    if(aVal > bVal) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const paginated = sortedEmployees.slice((page-1)*rows, page*rows);
  const totalPages = Math.ceil(sortedEmployees.length/rows);

  return (
    <div className="dashboard-bg">
      <Header role="hr" onThemeToggle={()=>{}} />
      <FilterBar
        departments={departments}
        grades={grades}
        rows={rows}
        page={page}
        totalPages={totalPages}
        onSearch={()=>{}}
        onDept={()=>{}}
        onGrade={()=>{}}
        onRows={e=>setRows(Number(e.target.value))}
        onPrev={()=>setPage(p=>Math.max(1,p-1))}
        onNext={()=>setPage(p=>Math.min(totalPages,p+1))}
      />
      <StatsCards stats={stats} />
      <EmployeeTable
        employees={paginated}
        onSort={key=>{
          if(sortKey===key) setSortOrder(o=>o==='asc'?'desc':'asc');
          else { setSortKey(key); setSortOrder('asc'); }
        }}
        sortKey={sortKey}
        sortOrder={sortOrder}
      />
      <Pagination page={page} totalPages={totalPages} onPrev={()=>setPage(p=>Math.max(1,p-1))} onNext={()=>setPage(p=>Math.min(totalPages,p+1))} />
    </div>
  );
}

export default Dashboard;
