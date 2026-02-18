import React, { useMemo } from 'react'

function Summary({ employees }) {
  const stats = useMemo(() => {
    if (!employees || employees.length === 0) {
      return {
        count: 0,
        avgSalary: 0,
        avgIncrement: 0,
        avgIncSalary: 0
      }
    }

    const salaries = employees
      .map(e => e.currentsalary)
      .filter(s => s !== null && s !== undefined && !isNaN(s))
    
    const increments = employees
      .map(e => e.increment)
      .filter(i => i !== null && i !== undefined && !isNaN(i))
    
    const incSalaries = employees
      .map(e => e.incrementedsalary)
      .filter(s => s !== null && s !== undefined && !isNaN(s))

    return {
      count: employees.length,
      avgSalary: salaries.length > 0 ? salaries.reduce((a, b) => a + Number(b), 0) / salaries.length : 0,
      avgIncrement: increments.length > 0 ? increments.reduce((a, b) => a + Number(b), 0) / increments.length : 0,
      avgIncSalary: incSalaries.length > 0 ? incSalaries.reduce((a, b) => a + Number(b), 0) / incSalaries.length : 0
    }
  }, [employees])

  const formatMoney = (n) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
  }

  return (
    <section id="summary">
      <div className="card">
        <div className="k">Employees</div>
        <div className="v" id="sum-count">{stats.count}</div>
      </div>
      <div className="card">
        <div className="k">Avg Salary</div>
        <div className="v" id="sum-avg-sal">{formatMoney(stats.avgSalary)}</div>
      </div>
      <div className="card">
        <div className="k">Avg Increment %</div>
        <div className="v" id="sum-avg-inc">{stats.avgIncrement ? stats.avgIncrement.toFixed(2) : '0'}</div>
      </div>
      <div className="card">
        <div className="k">Avg Incremented</div>
        <div className="v" id="sum-avg-incsal">{formatMoney(stats.avgIncSalary)}</div>
      </div>
    </section>
  )
}

export default Summary
