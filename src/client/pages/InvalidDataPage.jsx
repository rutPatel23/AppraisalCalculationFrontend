import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmployeeTable from "../components/EmployeeTable";
import Summary from "../components/Summary";
import Modal from "../components/Modal";
import BarChart from "../components/BarChart";
import ChangePasswordForm from "../components/ChangePasswordForm";
import AddUserForm from "../components/AddUserForm";
import SetRoleForm from "../components/SetRoleForm";
import DeleteUserForm from "../components/DeleteUserForm";
import EditEmployeeForm from "../components/EditEmployeeForm";
import UserMenu from "../components/UserMenu";
import PieChart from "../components/PieChart";
import logo from "../pages/logo.png";


export default function InvalidDataPage({ user, onLogout }) {
  const [invalidData, setInvalidData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ isOpen: false });
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [invFilter, setInvFilter] = useState("all");
  const [departments, setDepartments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [weights, setWeights] = useState([]);
  const [showWeights, setShowWeights] = useState(false);

  const fetchInvalid = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://appraisalcalculationbackend.onrender.com/api/invalid");
      if (!res.ok) throw new Error("Failed to fetch invalid data");
      const data = await res.json();
      setInvalidData(data);
      // derive departments/grades from dataset
      setDepartments(
        [...new Set(data.map((d) => d.department).filter(Boolean))].sort(),
      );
      setGrades([...new Set(data.map((d) => d.grade).filter(Boolean))].sort());
    } catch (e) {
      console.error(e);
      setModal({ isOpen: true, title: "Error", content: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvalid();
  }, []);
  const navigate = useNavigate();

  const handleViewDetails = async (id) => {
    try {
      const res = await fetch(`https://appraisalcalculationbackend.onrender.com/api/employees/${id}/inputdetails`);
      if (!res.ok) throw new Error("Failed to fetch details");
      const details = await res.json();
      setModal({ isOpen: true, title: `Details: ${id}`, details });
    } catch (e) {
      setModal({ isOpen: true, title: "Error", content: e.message });
    }
  };


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
      const res = await fetch("https://appraisalcalculationbackend.onrender.com/api/users");
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
      const res = await fetch("https://appraisalcalculationbackend.onrender.com/api/users");
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

  const handleEdit = (employee) => {
    // sanitize to avoid null values in the form
    const sanitized = { ...employee };
    Object.keys(sanitized).forEach((k) => {
      if (sanitized[k] === null || sanitized[k] === undefined)
        sanitized[k] = "";
    });
    setModal({
      isOpen: true,
      title: `Edit: ${employee.id}`,
      form: { type: "edit-employee", data: sanitized, isInvalid: true },
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this invalid record?")) return;
    try {
      const res = await fetch(`https://appraisalcalculationbackend.onrender.com/api/invaliddata/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ actor: localStorage.getItem("user") }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchInvalid();
      setModal({ isOpen: false });
    } catch (e) {
      setModal({ isOpen: true, title: "Error", content: e.message });
    }
  };

  const handleCloseModal = () => setModal({ isOpen: false });

  const handleShowWeights = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://appraisalcalculationbackend.onrender.com/api/weights");
      if (!res.ok) throw new Error("Failed to fetch weights");
      const w = await res.json();
      setWeights(w);
      setShowWeights(true);
      setModal({ isOpen: true, title: "Weights" });
    } catch (e) {
      setModal({ isOpen: true, title: "Error", content: e.message });
    } finally {
      setLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Department",
      "Current Salary",
      "KPI",
      "Attendance",
      "Behavior",
      "Manager",
    ];
    const rows = filteredInvalid.map((i) => [
      i.id,
      i.name,
      i.department,
      i.currentsalary,
      i.kpiscore,
      i.attendance,
      i.behavioralrating,
      i.managerrating,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((c) => `"${c ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invalid.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // filtering + pagination
  const filteredInvalid = invalidData.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !String(item.id).toLowerCase().includes(q) &&
        !(item.name && item.name.toLowerCase().includes(q))
      )
        return false;
    }
    if (departmentFilter && item.department !== departmentFilter) return false;
    if (gradeFilter && item.grade !== gradeFilter) return false;
    // invalid-specific filter mode
    if (invFilter && invFilter !== "all") {
      const isEmpty = (v) =>
        v === null || v === undefined || String(v).trim() === "";
      const isNum = (v) => !isEmpty(v) && isFinite(Number(v));
      const outOfRange = (v) => isNum(v) && (Number(v) < 0 || Number(v) > 100);
      const numericOnly = (s) => /^\d+$/.test(String(s).trim());
      if (invFilter === "nulls") {
        if (
          ![
            item.id,
            item.name,
            item.department,
            item.currentsalary,
            item.kpiscore,
            item.attendance,
            item.behavioralrating,
            item.managerrating,
          ].some(isEmpty)
        )
          return false;
      } else if (invFilter === "range") {
        if (
          ![
            item.kpiscore,
            item.attendance,
            item.behavioralrating,
            item.managerrating,
          ].some(outOfRange)
        )
          return false;
      } else if (invFilter === "nonnumeric") {
        if (
          ![
            item.currentsalary,
            item.kpiscore,
            item.attendance,
            item.behavioralrating,
            item.managerrating,
          ].some((v) => !isNum(v))
        )
          return false;
      } else if (invFilter === "numericText") {
        if (!(numericOnly(item.name) || numericOnly(item.department)))
          return false;
      }
    }
    return true;
  });

  const paginated = filteredInvalid.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.max(1, Math.ceil(filteredInvalid.length / pageSize));

  if (loading)
    return <main style={{ padding: 20 }}>Loading invalid data...</main>;

  return (
    <>
      <header>
        <div className="logo-wrap">
          <img
            src={logo}
            alt="TecnoPrism"
            className="brand"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling &&
                (e.target.nextSibling.style.display = "inline-block");
            }}
          />
        </div>
        <h1>Invalid Data</h1>
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
            {departments.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
          <select
            id="grade"
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
          >
            <option value="">All Grades</option>
            {grades.map((g) => (
              <option key={g} value={g}>
                {g}
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
            id="increment"
            type="button"
            onClick={() => navigate("/")}
            style={{ color: "aliceblue" }}
          >
            Increment Details
          </button>
          <button
            id="export"
            type="button"
            onClick={handleExportCSV}
            style={{ color: "aliceblue" }}
          >
            Export CSV
          </button>

          <label
            id="invFilterWrap"
            className="inv-filter"
            style={{ marginLeft: "41px" }}
          >
            Invalid Filter:
            <select
              id="invFilter"
              value={invFilter}
              onChange={(e) => setInvFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="nulls">Null/Empty fields</option>
              <option value="range">Out of range (0–100)</option>
              <option value="nonnumeric">Non-numeric numeric fields</option>
              <option value="numericText">Numeric-only text fields</option>
            </select>
          </label>
          <span className="spacer"></span>
          <label>
            Rows:
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="25">25</option>
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
              Page {currentPage} of {totalPages}
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

        <Summary employees={paginated} />

        <EmployeeTable
          employees={paginated}
          onSort={() => {}}
          onEdit={handleEdit}
          onViewDetails={handleViewDetails}
          onDelete={handleDelete}
          sortKey={"id"}
          sortOrder={"asc"}
          showInvalid={true}
          showViewMore={false}
          perms={{ can_add: false, can_update: true, can_delete: true }}
        />
      </main>

      <Modal
        isOpen={modal.isOpen || showWeights}
        title={modal.title}
        onClose={() => {
          setShowWeights(false);
          handleCloseModal();
        }}
      >
        {showWeights && (
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
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

        {modal.content && <div style={{ padding: 12 }}>{modal.content}</div>}
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
