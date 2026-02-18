import React, { useState } from 'react'

function EmployeeTable({ employees, onSort, onEdit, onViewDetails, onDelete, sortKey, sortOrder, showInvalid = false, perms = {}, showViewMore = true }) {
  const [openRowMenu, setOpenRowMenu] = useState(null)
  const formatMoney = (n) => {
    if (n === null || n === undefined) return '—'
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(n)
  }

  const renderSortIndicator = (key) => {
    if (sortKey !== key) return '↑↓'
    return sortOrder === 'asc' ? '↑' : '↓'
  }

  return (
    <table id="employees">
      <thead>
        <tr>
          <th data-key="id" onClick={() => onSort('id')} style={{ cursor: 'pointer' }}>
            ID <span className="sort">{renderSortIndicator('id')}</span>
          </th>
          <th data-key="name" onClick={() => onSort('name')} style={{ cursor: 'pointer' }}>
            Name <span className="sort">{renderSortIndicator('name')}</span>
          </th>
          <th data-key="department" onClick={() => onSort('department')} style={{ cursor: 'pointer' }}>
            Department <span className="sort">{renderSortIndicator('department')}</span>
          </th>
          {!showInvalid && (
            <>
              <th className="num" data-key="currentsalary" onClick={() => onSort('currentsalary')} style={{ cursor: 'pointer' }}>
                Current Salary <span className="sort">{renderSortIndicator('currentsalary')}</span>
              </th>
              <th data-key="grade" onClick={() => onSort('grade')} style={{ cursor: 'pointer' }}>
                Grade <span className="sort">{renderSortIndicator('grade')}</span>
              </th>
              <th className="num" data-key="increment" onClick={() => onSort('increment')} style={{ cursor: 'pointer' }}>
                Increment (%) <span className="sort">{renderSortIndicator('increment')}</span>
              </th>
              <th className="num" data-key="incrementedsalary" onClick={() => onSort('incrementedsalary')} style={{ cursor: 'pointer' }}>
                Incremented Salary <span className="sort">{renderSortIndicator('incrementedsalary')}</span>
              </th>
            </>
          )}
          {showInvalid && (
            <>
              <th className="num" data-key="currentsalary">Current Salary <span className="sort">{renderSortIndicator('currentsalary')}</span></th>
              <th className="num" data-key="kpiscore">KPI <span className="sort">{renderSortIndicator('kpiscore')}</span></th>
              <th className="num" data-key="attendance">Attendance <span className="sort">{renderSortIndicator('attendance')}</span></th>
              <th className="num" data-key="behavioralrating">Behavior <span className="sort">{renderSortIndicator('behavioralrating')}</span></th>
              <th className="num" data-key="managerrating">Manager <span className="sort">{renderSortIndicator('managerrating')}</span></th>
            </>
          )}
          <th data-key="actions">Actions</th>
        </tr>
      </thead>
      <tbody>
        {employees.map((emp) => (
          <tr key={emp.id} data-id={emp.id}>
            <td>{emp.id}</td>
            <td>{emp.name}</td>
            <td>{emp.department}</td>
            {!showInvalid && (
              <>
                <td className="num">{formatMoney(emp.currentsalary)}</td>
                <td>{emp.grade}</td>
                <td className="num">{emp.increment ? `${emp.increment}%` : '—'}</td>
                <td className="num">{formatMoney(emp.incrementedsalary)}</td>
              </>
            )}
            {showInvalid && (
              <>
                <td className="num">{formatMoney(emp.currentsalary)}</td>
                <td className="num">{emp.kpiscore ?? '—'}</td>
                <td className="num">{emp.attendance ?? '—'}</td>
                <td className="num">{emp.behavioralrating ?? '—'}</td>
                <td className="num">{emp.managerrating ?? '—'}</td>
              </>
            )}
            <td>
              <div className="actions-cell">
                <div 
                  className="actions-menu"
                  onMouseEnter={() => setOpenRowMenu(emp.id)}
                  onMouseLeave={() => setOpenRowMenu(null)}
                >
                  <button className="menu-trigger">⋮</button>
                  {openRowMenu === emp.id && (
                    <div className="menu-actions">
                      {showViewMore && (
                        <button
                          className="action-btn view"
                          title="View Details"
                          onClick={() => onViewDetails(emp.id)}
                        >
                          👁️
                        </button>
                      )}
                      {perms.can_update && (
                        <button
                          className="action-btn edit"
                          title="Edit"
                          onClick={() => onEdit(emp)}
                        >
                          ✎
                        </button>
                      )}
                      {perms.can_delete && (
                        <button
                          className="action-btn delete"
                          title="Delete"
                          onClick={() => onDelete(emp.id)}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default EmployeeTable
