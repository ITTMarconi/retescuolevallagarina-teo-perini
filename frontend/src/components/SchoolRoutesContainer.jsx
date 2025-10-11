// src/components/SchoolRoutesContainer.jsx
import { useState } from "react";
import RoutesView from "./RoutesView.jsx";
import styles from "./SchoolRoutesContainer.module.css";

export default function SchoolRoutesContainer({ schools, routes }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(
    schools[0]?.id || null
  );

  // Filter routes based on selected school
  const filteredRoutes = selectedSchoolId
    ? routes.filter((route) => route.school?.id === selectedSchoolId)
    : routes;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h2 className={styles.sidebarTitle}>Scuole</h2>
        <ul className={styles.schoolList}>
          {schools.map((school) => (
            <li key={school.id} className={styles.schoolListItem}>
              <button
                onClick={() => setSelectedSchoolId(school.id)}
                className={`${styles.schoolButton} ${
                  selectedSchoolId === school.id ? styles.active : ""
                }`}
              >
                {school.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <RoutesView routes={filteredRoutes} />
      </main>
    </div>
  );
}
