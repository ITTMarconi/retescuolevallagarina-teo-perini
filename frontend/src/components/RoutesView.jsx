// src/components/RoutesView.jsx
import { useState, useEffect } from "react";
import MapComponent from "./MapComponent.jsx";
import styles from "./RoutesView.module.css";

export default function RoutesView({ routes }) {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Reset selection when routes change (e.g., when school filter changes)
  useEffect(() => {
    setSelectedRouteId(null);
    setSelectedRoute(null);
  }, [routes]);

  const handleRouteClick = (route) => {
    setSelectedRouteId(route.id);
    setSelectedRoute(route);
  };

  return (
    <div className={styles.container}>
      <MapComponent
        key={`map-${routes.length}-${selectedRouteId}`}
        routes={routes}
        selectedRouteId={selectedRouteId}
      />

      <h3 className={styles.title}>Percorsi di Trasporto</h3>
      <p className={styles.subtitle}>
        Clicca su un percorso per evidenziarlo sulla mappa e vedere i dettagli
      </p>

      <ul className={styles.routesList}>
        {routes.map((route) => (
          <li
            key={route.id}
            onClick={() => handleRouteClick(route)}
            className={`${styles.routeItem} ${
              selectedRouteId === route.id ? styles.selected : ""
            }`}
          >
            <div className={styles.routeHeader}>
              <span className={styles.routeName}>{route.name}</span>
              {route.start_label && (
                <span className={styles.routeStart}>
                  • Da: {route.start_label}
                </span>
              )}
            </div>
            <div className={styles.routeMeta}>
              <span className={styles.transportationType}>
                {route.transportation_type}
              </span>
              {" • "}
              {route.estimated_time_minutes} min
              {route.school?.short_name && (
                <span> • Verso: {route.school.short_name}</span>
              )}
            </div>
          </li>
        ))}
      </ul>

      {selectedRoute && selectedRoute.description && (
        <div className={styles.detailsBox}>
          <h4 className={styles.detailsTitle}>
            Dettagli Percorso: {selectedRoute.name}
          </h4>
          <div
            className={styles.detailsContent}
            dangerouslySetInnerHTML={{ __html: selectedRoute.description }}
          />
        </div>
      )}
    </div>
  );
}
