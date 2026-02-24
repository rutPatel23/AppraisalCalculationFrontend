import React, { useState, useEffect, useCallback } from "react";
import Loader from "../components/Loader";
import UserMenu from "../components/UserMenu";
import EmployeeTable from "../components/EmployeeTable";
import Modal from "../components/Modal";
import Summary from "../components/Summary";
import ChangePasswordForm from "../components/ChangePasswordForm";
import AddUserForm from "../components/AddUserForm";
import SetRoleForm from "../components/SetRoleForm";
import DeleteUserForm from "../components/DeleteUserForm";
import EditEmployeeForm from "../components/EditEmployeeForm";
import PieChart from "../components/PieChart";
import BarChart from "../components/BarChart";
import { useNavigate } from "react-router-dom";
import logo from "../pages/logo.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../styles.css";

function DashboardPage({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [invalidData, setInvalidData] = useState([]);
  const [weights, setWeights] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [sortKey, setSortKey] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");
  const [modal, setModal] = useState({ isOpen: false, title: "", content: "" });
  const [showWeights, setShowWeights] = useState(false);
  const [showInvalid, setShowInvalid] = useState(false);
  const [perms, setPerms] = useState({
    can_add: false,
    can_update: false,
    can_delete: false,
  });
  const [role, setRole] = useState("hr");

  const navigate = useNavigate();

  // Fetch employees and permissions
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const empRes = await fetch(
          "https://appraisalcalculationbackend.onrender.com/api/employees",
        );
        if (!empRes.ok) throw new Error("Failed to fetch employees");
        const employees = await empRes.json();
        setEmployees(employees);

        // departments/grades
        const depts = [
          ...new Set(employees.map((e) => e.department).filter(Boolean)),
        ];
        const grds = [
          ...new Set(employees.map((e) => e.grade).filter(Boolean)),
        ];
        setDepartments(depts.sort());
        setGrades(grds.sort());

        // attempt to fetch permissions/role for current user
        const username = localStorage.getItem("user") || user;
        if (username) {
          try {
            const r = await fetch(
              `/api/permissions/${encodeURIComponent(username)}`,
            );
            if (r.ok) {
              const p = await r.json();
              setPerms(p);
            }
          } catch (_) {}
          try {
            const who = await fetch(
              `https://appraisalcalculationbackend.onrender.com/api/whoami`,
              {
                headers: { "x-user": username },
              },
            );
            if (who.ok) {
              const wr = await who.json();
              setRole((wr.role || "hr").toLowerCase());
            }
          } catch (_) {}
        }
      } catch (error) {
        console.error("Data fetch failed:", error);
        setModal({
          isOpen: true,
          title: "Error",
          content: `Failed to load data: ${error.message}`,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Filter and sort employees
  useEffect(() => {
    let filtered = [...employees];

    // Apply filters
    if (searchQuery) {
      filtered = filtered.filter(
        (e) =>
          String(e.id).includes(searchQuery) ||
          (e.name && e.name.toLowerCase().includes(searchQuery.toLowerCase())),
      );
    }

    if (departmentFilter) {
      filtered = filtered.filter((e) => e.department === departmentFilter);
    }

    if (gradeFilter) {
      filtered = filtered.filter((e) => e.grade === gradeFilter);
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortKey];
      let bVal = b[sortKey];

      if (aVal === null || aVal === undefined) aVal = "";
      if (bVal === null || bVal === undefined) bVal = "";

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredEmployees(filtered);
    setCurrentPage(1);
  }, [
    employees,
    searchQuery,
    departmentFilter,
    gradeFilter,
    sortKey,
    sortOrder,
  ]);

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Department",
      "Current Salary",
      "Grade",
      "Increment (%)",
      "Incremented Salary",
    ];
    const rows = filteredEmployees.map((e) => [
      e.id,
      e.name,
      e.department,
      e.currentsalary,
      e.grade,
      e.increment,
      e.incrementedsalary,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "employees.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleShowWeights = () => {
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://appraisalcalculationbackend.onrender.com/api/weights",
        );
        if (!res.ok) throw new Error("Failed to fetch weights");
        const w = await res.json();
        setWeights(w);
        setShowWeights(true);
        setShowInvalid(false);
        setModal({ isOpen: true, title: "Weights" });
      } catch (e) {
        setModal({ isOpen: true, title: "Error", content: e.message });
      } finally {
        setLoading(false);
      }
    })();
  };

  const handleShowInvalid = () => {
    // Navigate to dedicated invalid-data page instead of modal
    if (!showInvalid) {
      navigate("/invalid");
    } else {
      // if already open locally, close modal/state
      setShowInvalid(false);
      setModal({ isOpen: false, title: "" });
    }
  };

  const handleEdit = (employee) => {
    // sanitize employee fields (no null/undefined) before opening edit modal
    const sanitized = { ...employee };
    Object.keys(sanitized).forEach((k) => {
      if (sanitized[k] === null || sanitized[k] === undefined)
        sanitized[k] = "";
    });
    setModal({
      isOpen: true,
      title: `Edit Employee #${employee.id}`,
      form: { type: "edit-employee", data: sanitized, isInvalid: false },
    });
  };

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(
        `https://appraisalcalculationbackend.onrender.com/api/employees/${id}/inputdetails`,
      );
      if (!res.ok) throw new Error("Failed to fetch details");
      const details = await res.json();

      setModal({
        isOpen: true,
        title: `Employee Input Details #${id}`,
        details,
      });
    } catch (error) {
      setModal({
        isOpen: true,
        title: "Error",
        content: `Failed to load details: ${error.message}`,
      });
    }
  };

  const handleCloseModal = () => {
    setModal({ isOpen: false, title: "", content: "" });
    setShowWeights(false);
    setShowInvalid(false);
  };

  const handleDelete = async (id) => {
    if (!id) return;
    try {
      const url = showInvalid
        ? `https://appraisalcalculationbackend.onrender.com/api/invaliddata/${id}`
        : `https://appraisalcalculationbackend.onrender.com/api/employeedetails/${id}`;
      const res = await fetch(url, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor: localStorage.getItem("user") }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      // refresh lists
      const empRes = await fetch(
        "https://appraisalcalculationbackend.onrender.com/api/employees",
      );
      if (empRes.ok) setEmployees(await empRes.json());
      if (showInvalid) {
        const invRes = await fetch("/api/invalid");
        if (invRes.ok) setInvalidData(await invRes.json());
      }
      setModal({ isOpen: false, title: "" });
    } catch (e) {
      setModal({ isOpen: true, title: "Error", content: e.message });
    }
  };

  // User menu actions
  const handleToggleTheme = () => {
    const themes = [
      "hulk",
      "thanos",
      "frost",
      "batman",
      "light",
      "emerald",
      "ocean",
      "sunset",
      "spiderman",
      "deep",
      "violet",
      "contrast",
      "red",
    ];
    const current = localStorage.getItem("theme") || "hulk";
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    localStorage.setItem("theme", next);
    document.body.setAttribute("data-theme", next);
  };

  const handleChangePassword = () => {
    // render change password form
    setModal({
      isOpen: true,
      title: "Change Password",
      form: { type: "change-password" },
    });
  };

  const handleAddUser = () =>
    setModal({ isOpen: true, title: "Add User", form: { type: "add-user" } });

  const handleSetRole = async () => {
    // fetch users for select
    try {
      const res = await fetch(
        "https://appraisalcalculationbackend.onrender.com/api/users",
      );
      const users = res.ok ? await res.json() : [];
      setModal({
        isOpen: true,
        title: "Set Role",
        form: { type: "set-role", users },
      });
    } catch (_) {
      setModal({
        isOpen: true,
        title: "Set Role",
        form: { type: "set-role", users: [] },
      });
    }
  };

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        "https://appraisalcalculationbackend.onrender.com/api/users",
      );
      const users = res.ok ? await res.json() : [];
      setModal({
        isOpen: true,
        title: "Delete User",
        form: { type: "delete-user", users },
      });
    } catch (_) {
      setModal({
        isOpen: true,
        title: "Delete User",
        form: { type: "delete-user", users: [] },
      });
    }
  };

  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const totalPages = Math.ceil(filteredEmployees.length / pageSize);

  if (loading) {
    return (
      // <main style={{ padding: "20px", textAlign: "center" }}>
      //   <Loader />
      // </main>
      <main style={{ padding: 20 }}>
        {/* <SkeletonTheme baseColor="#fff5f5" highlightColor="#e0e0e0"> */}
        <SkeletonTheme baseColor="transparent" highlightColor="#e0e0e0">
          <Skeleton height={50} width={320} />
          <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
            <Skeleton height={36} width={180} />
            <Skeleton height={36} width={180} />
            <Skeleton height={36} width={120} />
          </div>
          <Skeleton count={10} height={42} style={{ marginTop: 15 }} />
        </SkeletonTheme>
      </main>
    );
  }

  return (
    <>
      <header>
        <div className="logo-wrap">
          <img
            src={logo}
            alt="TecnoPrism"
            className="brand"
            onError={(e) => e.target.remove()}
          />
        </div>
        <h1>
          {showInvalid
            ? "Employee Invalid Data"
            : "Employee Incremented Details"}
        </h1>
        <div id="status">Ready</div>
        <button type="button" className="theme-btn" onClick={handleToggleTheme}>
          🌙
        </button>

        <UserMenu
          user={user}
          onLogout={onLogout}
          onChangePassword={handleChangePassword}
          onAddUser={handleAddUser}
          onSetRole={handleSetRole}
          onDeleteUser={handleDeleteUser}
          onToggleTheme={handleToggleTheme}
        />
      </header>

      <main>
        <section id="controls">
          <input
            id="q"
            type="search"
            placeholder="Search name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            id="dept"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <select
            id="grade"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="">All Grades</option>
            {grades.map((grade) => (
              <option key={grade} value={grade}>
                {grade}
              </option>
            ))}
          </select>
          <button
            id="weights"
            type="button"
            onClick={handleShowWeights}
            style={{ color: "aliceblue" }}
          >
            Weights
          </button>
          <button
            id="invalid"
            type="button"
            onClick={handleShowInvalid}
            style={{ color: "aliceblue" }}
          >
            {showInvalid ? "Incremented Data" : "Invalid Data"}
          </button>
          <button
            id="export"
            type="button"
            onClick={handleExportCSV}
            style={{ color: "aliceblue" }}
          >
            Export CSV
          </button>
          <span className="spacer"></span>
          <label>
            Rows:
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </label>
          <div id="pager">
            <button
              id="prev"
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span id="pageInfo">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              id="next"
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </section>

        <Summary employees={paginatedEmployees} />
        <EmployeeTable
          employees={paginatedEmployees}
          onSort={() => {}}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
          sortKey={"id"}
          sortOrder={"asc"}
          showInvalid={false}
          showViewMore={true}
          perms={{ can_add: false, can_update: true, can_delete: true }}
        />

        {/* <div className="employee-table-wrap">
          <table className="employee-table">
            <thead>
              <tr>
                <th onClick={() => handleSort("id")}>
                  ID {sortKey === "id" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("name")}>
                  Name{" "}
                  {sortKey === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("department")}>
                  Department{" "}
                  {sortKey === "department"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th onClick={() => handleSort("currentsalary")}>
                  Current Salary{" "}
                  {sortKey === "currentsalary"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th onClick={() => handleSort("grade")}>
                  Grade{" "}
                  {sortKey === "grade" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
                </th>
                <th onClick={() => handleSort("increment")}>
                  Increment (%){" "}
                  {sortKey === "increment"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th onClick={() => handleSort("incrementedsalary")}>
                  Incremented Salary{" "}
                  {sortKey === "incrementedsalary"
                    ? sortOrder === "asc"
                      ? "↑"
                      : "↓"
                    : ""}
                </th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEmployees.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? "even-row" : "odd-row"}>
                  <td>{e.id}</td>
                  <td>{e.name}</td>
                  <td>{e.department}</td>
                  <td>{e.currentsalary}</td>
                  <td>{e.grade}</td>
                  <td>{e.increment}</td>
                  <td>{e.incrementedsalary}</td>
                  <td>
                    <button className="action-btn" title="Actions">
                      ⋯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div> */}
      </main>

      <Modal
        isOpen={modal.isOpen}
        title={modal.title}
        onClose={handleCloseModal}
      >
        {showWeights && (
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <PieChart
              values={weights.map((w) => w.weightpercentage)}
              labels={weights.map((w) => w.metric)}
            />
            <div style={{ flex: 1 }}>
              <h3>Weights</h3>
              <p style={{ color: "var(--muted)" }}>
                Hover a segment to see metric and percentage.
              </p>
            </div>
          </div>
        )}

        {showInvalid && (
          <table className="detail">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Department</th>
                <th className="num">Salary</th>
                <th className="num">KPI</th>
                <th className="num">Attendance</th>
                <th className="num">Behavior</th>
                <th className="num">Manager</th>
              </tr>
            </thead>
            <tbody>
              {invalidData.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.department}</td>
                  <td className="num">{item.currentsalary}</td>
                  <td className="num">{item.kpiscore}</td>
                  <td className="num">{item.attendance}</td>
                  <td className="num">{item.behavioralrating}</td>
                  <td className="num">{item.managerrating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {modal.details && (
          <div>
            <table className="detail" style={{ marginBottom: 12 }}>
              <tbody>
                <tr>
                  <th>ID</th>
                  <td>{modal.details.id}</td>
                </tr>
                <tr>
                  <th>Name</th>
                  <td>{modal.details.name}</td>
                </tr>
                <tr>
                  <th>Department</th>
                  <td>{modal.details.department}</td>
                </tr>
              </tbody>
            </table>
            <BarChart
              values={[
                modal.details.kpiscore,
                modal.details.attendance,
                modal.details.behavioralrating,
                modal.details.managerrating,
              ]}
              labels={[
                "KPI Score",
                "Attendance",
                "Behavioral Rating",
                "Manager Rating",
              ]}
              max={100}
            />
          </div>
        )}
        {/* Render form-based modals (change password, add user, set role, delete user, edit employee) */}
        {modal.form && modal.form.type === "change-password" && (
          <ChangePasswordForm onClose={handleCloseModal} />
        )}
        {modal.form && modal.form.type === "add-user" && (
          <AddUserForm onClose={handleCloseModal} />
        )}
        {modal.form && modal.form.type === "set-role" && (
          <SetRoleForm
            users={modal.form.users || []}
            onClose={handleCloseModal}
          />
        )}
        {modal.form && modal.form.type === "delete-user" && (
          <DeleteUserForm
            users={modal.form.users || []}
            onClose={handleCloseModal}
          />
        )}
        {modal.form && modal.form.type === "edit-employee" && (
          <EditEmployeeForm
            data={modal.form.data}
            isInvalid={modal.form.isInvalid}
            onClose={handleCloseModal}
          />
        )}
      </Modal>
    </>
  );
}

export default DashboardPage;
