// src/components/MapComponent.jsx
import React from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./MapComponent.module.css";

// Fix default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Create custom red school icon to make it more visible
const schoolIcon = L.divIcon({
  className: 'custom-school-icon',
  html: `<div style="
    background-color: #e53935;
    width: 30px;
    height: 30px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 3px solid white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
  ">
    <div style="
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(45deg);
      color: white;
      font-size: 16px;
      font-weight: bold;
    ">🏫</div>
  </div>`,
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30]
});

export default function MapComponent({ routes, selectedRouteId }) {
  // Extract geometries from routes and calculate center
  const allCoordinates = [];

  routes.forEach((route) => {
    // Add start point coordinates
    if (route.start?.coordinates) {
      allCoordinates.push([route.start.coordinates[1], route.start.coordinates[0]]);
    }

    // Add school location coordinates (position field)
    if (route.school?.position?.coordinates) {
      allCoordinates.push([route.school.position.coordinates[1], route.school.position.coordinates[0]]);
    }

    // Handle route_path - could be GeometryCollection or direct LineString
    if (route.route_path) {
      if (route.route_path.type === "GeometryCollection" && route.route_path.geometries) {
        // Handle GeometryCollection format
        route.route_path.geometries.forEach((geom) => {
          if (geom.type === "Point") {
            allCoordinates.push([geom.coordinates[1], geom.coordinates[0]]);
          } else if (geom.type === "LineString") {
            geom.coordinates.forEach((coord) => {
              allCoordinates.push([coord[1], coord[0]]);
            });
          }
        });
      } else if (route.route_path.type === "LineString" && route.route_path.coordinates) {
        // Handle direct LineString format
        route.route_path.coordinates.forEach((coord) => {
          allCoordinates.push([coord[1], coord[0]]);
        });
      }
    }
  });

  const defaultCenter = allCoordinates[0] || [45.89, 11.04];

  // Get unique schools from routes for school markers
  const schoolsMap = new Map();
  routes.forEach((route) => {
    if (route.school?.id && route.school?.position?.coordinates) {
      schoolsMap.set(route.school.id, route.school);
    }
  });
  const uniqueSchools = Array.from(schoolsMap.values());

  // Debug: log school data
  // console.log("Routes with schools:", routes.map(r => ({
  //   routeName: r.name,
  //   schoolId: r.school?.id,
  //   schoolName: r.school?.name,
  //   hasPosition: !!r.school?.position,
  //   positionCoords: r.school?.position?.coordinates
  // })));
  // console.log("Unique schools to render:", uniqueSchools.length);

  return (
    <div className={styles.mapContainer}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        className={styles.leafletMap}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render all routes */}
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          let lineStrings = [];
          let points = [];

          // Extract geometries based on route_path format
          if (route.route_path) {
            if (route.route_path.type === "GeometryCollection" && route.route_path.geometries) {
              // GeometryCollection format
              lineStrings = route.route_path.geometries.filter((geom) => geom.type === "LineString");
              points = route.route_path.geometries.filter((geom) => geom.type === "Point");
            } else if (route.route_path.type === "LineString" && route.route_path.coordinates) {
              // Direct LineString format
              lineStrings = [route.route_path];
            }
          }

          return (
            <React.Fragment key={route.id}>
              {/* Render LineStrings as Polylines */}
              {lineStrings.map((geom, idx) => (
                <React.Fragment key={`line-fragment-${route.id}-${idx}`}>
                  {/* Invisible wider polyline for easier clicking */}
                  <Polyline
                    key={`line-clickable-${route.id}-${idx}`}
                    positions={geom.coordinates.map((coord) => [coord[1], coord[0]])}
                    color="transparent"
                    weight={15}
                    opacity={0}
                    interactive={true}
                  >
                    <Popup>
                      <div className={styles.popupContent}>
                        <div className={styles.popupTitle}>{route.name}</div>
                        {route.description && (
                          <div
                            className={styles.popupDescription}
                            dangerouslySetInnerHTML={{ __html: route.description }}
                          />
                        )}
                        <div>
                          <em>Tipo: {route.transportation_type}</em>
                          <br />
                          <em>Tempo: {route.estimated_time_minutes} min</em>
                          <br />
                          <strong>Scuola: {route.school?.name}</strong>
                        </div>
                      </div>
                    </Popup>
                  </Polyline>

                  {/* Visible polyline */}
                  <Polyline
                    key={`line-visible-${route.id}-${idx}`}
                    positions={geom.coordinates.map((coord) => [coord[1], coord[0]])}
                    color={isSelected ? "#FF5722" : "#1976d2"}
                    weight={isSelected ? 6 : 5}
                    opacity={isSelected ? 1 : 0.7}
                    interactive={false}
                  />
                </React.Fragment>
              ))}

              {/* Render start marker */}
              {route.start?.coordinates && (
                <Marker
                  key={`start-${route.id}`}
                  position={[route.start.coordinates[1], route.start.coordinates[0]]}
                >
                  <Popup>
                    <div className={styles.popupContent}>
                      <div className={styles.popupTitle}>
                        {route.start_label || "Punto di Partenza"}
                      </div>
                      <div>
                        <em>Percorso: {route.name}</em>
                        <br />
                        <strong>Verso: {route.school?.name}</strong>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Render additional points from GeometryCollection */}
              {points.map((geom, idx) => (
                <Marker
                  key={`point-${route.id}-${idx}`}
                  position={[geom.coordinates[1], geom.coordinates[0]]}
                >
                  <Popup>
                    <div className={styles.popupContent}>
                      <div className={styles.popupTitle}>Cambio di modalità</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </React.Fragment>
          );
        })}

        {/* Render school location markers */}
        {uniqueSchools.map((school) => (
          <Marker
            key={`school-${school.id}`}
            position={[school.position.coordinates[1], school.position.coordinates[0]]}
            icon={schoolIcon}
          >
            <Popup>
              <div className={styles.popupContent}>
                <div className={styles.popupTitle}>🏫 {school.name}</div>
                {school.short_name && (
                  <div>
                    <em>{school.short_name}</em>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
