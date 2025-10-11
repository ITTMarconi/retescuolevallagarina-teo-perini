// src/components/RoutesView.jsx
import { useState, useEffect } from "react";
import MapComponent from "./MapComponent.jsx";

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
    <div>
      <MapComponent
        key={`map-${routes.length}-${selectedRouteId}`}
        routes={routes}
        selectedRouteId={selectedRouteId}
      />

      <h3 style={{ marginTop: "1rem" }}>Percorsi di Trasporto</h3>
      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        Clicca su un percorso per evidenziarlo sulla mappa e vedere i dettagli
      </p>

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "1rem 0",
        }}
      >
        {routes.map((route) => (
          <li
            key={route.id}
            onClick={() => handleRouteClick(route)}
            style={{
              padding: "0.75rem",
              marginBottom: "0.5rem",
              background:
                selectedRouteId === route.id ? "#e3f2fd" : "#f5f5f5",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "all 0.2s",
              border:
                selectedRouteId === route.id
                  ? "2px solid #1976d2"
                  : "2px solid transparent",
            }}
            onMouseEnter={(e) => {
              if (selectedRouteId !== route.id) {
                e.currentTarget.style.background = "#e8e8e8";
              }
            }}
            onMouseLeave={(e) => {
              if (selectedRouteId !== route.id) {
                e.currentTarget.style.background = "#f5f5f5";
              }
            }}
          >
            <div>
              <strong>{route.name}</strong>
              {route.start_label && (
                <span style={{ color: "#666" }}>
                  {" "}
                  • Da: {route.start_label}
                </span>
              )}
            </div>
            <div
              style={{
                fontSize: "0.9rem",
                color: "#666",
                marginTop: "0.25rem",
              }}
            >
              <span style={{ textTransform: "capitalize" }}>
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
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff3e0",
            border: "1px solid #ff9800",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ marginTop: 0, color: "#f57c00" }}>
            Dettagli Percorso: {selectedRoute.name}
          </h4>
          <div
            style={{ margin: "0.5rem 0", lineHeight: "1.6" }}
            dangerouslySetInnerHTML={{ __html: selectedRoute.description }}
          />
        </div>
      )}
    </div>
  );
}
