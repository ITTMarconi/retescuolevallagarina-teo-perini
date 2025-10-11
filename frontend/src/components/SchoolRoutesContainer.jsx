// src/components/SchoolRoutesContainer.jsx
import { useState } from "react";
import RoutesView from "./RoutesView.jsx";

export default function SchoolRoutesContainer({ schools, routes }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    schools[0]?.id || null
  );

  // Filter routes based on selected school
  const filteredRoutes = selectedSchoolId
    ? routes.filter((route) => route.school?.id === selectedSchoolId)
    : routes;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1rem",
        minHeight: "100vh",
      }}
      className="routes-container-wrapper"
    >
      <aside
        style={{
          width: "250px",
          background: "#f8f8f8",
          padding: "1rem",
        }}
        className="sidebar-wrapper"
      >
        <h2 style={{ fontSize: "1.2rem" }}>Scuole</h2>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {schools.map((school) => (
            <li key={school.id} style={{ marginBottom: "0.5rem" }}>
              <button
                onClick={() => setSelectedSchoolId(school.id)}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  border: "none",
                  background:
                    selectedSchoolId === school.id ? "#1976d2" : "#e0e0e0",
                  color: selectedSchoolId === school.id ? "#fff" : "#000",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (selectedSchoolId !== school.id) {
                    e.currentTarget.style.background = "#d0d0d0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSchoolId !== school.id) {
                    e.currentTarget.style.background = "#e0e0e0";
                  }
                }}
              >
                {school.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main
        style={{
          flex: 1,
          padding: "1rem",
        }}
        className="main-content-wrapper"
      >
        <RoutesView routes={filteredRoutes} />
      </main>
    </div>
  );
}
