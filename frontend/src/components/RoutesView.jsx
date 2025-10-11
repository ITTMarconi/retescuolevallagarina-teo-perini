// src/components/RoutesView.jsx
import { useState } from "react";
import MapComponent from "./MapComponent.jsx";

export default function RoutesView({ routes }) {
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [showSchoolInfo, setShowSchoolInfo] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState(null);

  const handleRouteClick = (route) => {
    setSelectedRouteId(route.id);
    setSelectedSchool(route.school);
    setShowSchoolInfo(true);
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
        Clicca su un percorso per evidenziarlo sulla mappa e vedere i dettagli della scuola
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

      {showSchoolInfo && selectedSchool && (
        <div
          style={{
            marginTop: "1rem",
            padding: "1rem",
            background: "#fff",
            border: "1px solid #ddd",
            borderRadius: "8px",
          }}
        >
          <h4 style={{ marginTop: 0, color: "#1976d2" }}>
            {selectedSchool.name}
          </h4>
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>Indirizzo:</span>{" "}
            {selectedSchool.address || "N/D"}
          </div>
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>Telefono:</span>{" "}
            {selectedSchool.phone || "N/D"}
          </div>
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>Email:</span>{" "}
            {selectedSchool.email || "N/D"}
          </div>
          {selectedSchool.website_url && (
            <div style={{ margin: "0.5rem 0" }}>
              <span style={{ fontWeight: "bold", color: "#555" }}>
                Sito Web:
              </span>{" "}
              <a
                href={selectedSchool.website_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2" }}
              >
                {selectedSchool.website_url}
              </a>
            </div>
          )}
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>
              Codice MIUR:
            </span>{" "}
            {selectedSchool.miur_code || "N/D"}
          </div>
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>Mensa:</span>{" "}
            {selectedSchool.canteen ? "Sì" : "No"}
          </div>
          <div style={{ margin: "0.5rem 0" }}>
            <span style={{ fontWeight: "bold", color: "#555" }}>Convitto:</span>{" "}
            {selectedSchool.boarding ? "Sì" : "No"}
          </div>
          {selectedSchool.description && (
            <div style={{ margin: "0.5rem 0" }}>
              <span style={{ fontWeight: "bold", color: "#555" }}>
                Descrizione:
              </span>
              <p style={{ margin: "0.25rem 0 0 0" }}>
                {selectedSchool.description}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
