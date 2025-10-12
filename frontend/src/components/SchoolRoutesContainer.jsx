// src/components/SchoolRoutesContainer.jsx
import { useState } from "react";
import RoutesView from "./RoutesView.jsx";
import styles from "./SchoolRoutesContainer.module.css";

export default function SchoolRoutesContainer({ schools, routes, apiUrl }) {
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
        <ul className={styles.schoolList}>
          {schools.map((school) => (
            <li key={school.id} className={styles.schoolListItem}>
              <button
                onClick={() => setSelectedSchoolId(school.id)}
                className={`${styles.schoolButton} ${
                  selectedSchoolId === school.id ? styles.active : ""
                }`}
              >
                {school.logo?.id && (
                  <img
                    src={`${apiUrl}/assets/${school.logo.id}`}
                    alt={school.logo.title || school.name}
                    className={styles.schoolLogo}
                  />
                )}
                <div>{school.name}</div>
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main className={styles.mainContent}>
        <RoutesView routes={filteredRoutes} apiUrl={apiUrl} />
      </main>
    </div>
  );
}
