// src/components/MapComponent.jsx
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix default marker icon issue in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function MapComponent({ routes, selectedRouteId }) {
  // Extract geometries from routes and calculate center
  const allCoordinates = [];

  routes.forEach((route) => {
    if (route.start?.coordinates) {
      allCoordinates.push([route.start.coordinates[1], route.start.coordinates[0]]);
    }
    if (route.route_path?.geometries) {
      route.route_path.geometries.forEach((geom) => {
        if (geom.type === "Point") {
          allCoordinates.push([geom.coordinates[1], geom.coordinates[0]]);
        } else if (geom.type === "LineString") {
          geom.coordinates.forEach((coord) => {
            allCoordinates.push([coord[1], coord[0]]);
          });
        }
      });
    }
  });

  const defaultCenter = allCoordinates[0] || [45.89, 11.04];

  return (
    <div
      style={{
        width: "100%",
        height: "500px",
        maxWidth: "100vw",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={defaultCenter}
        zoom={13}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {routes.map((route) => {
          if (!route.route_path?.geometries) return null;

          const isSelected = selectedRouteId === route.id;
          const lineStrings = route.route_path.geometries.filter(
            (geom) => geom.type === "LineString"
          );
          const points = route.route_path.geometries.filter(
            (geom) => geom.type === "Point"
          );

          return (
            <div key={route.id}>
              {/* Render LineStrings as Polylines */}
              {lineStrings.map((geom, idx) => (
                <Polyline
                  key={`line-${route.id}-${idx}`}
                  positions={geom.coordinates.map((coord) => [coord[1], coord[0]])}
                  color={isSelected ? "#FF5722" : "#1976d2"}
                  weight={isSelected ? 6 : 4}
                  opacity={isSelected ? 1 : 0.5}
                >
                  <Popup>
                    <strong>{route.name}</strong>
                    <br />
                    {route.description && (
                      <>
                        {route.description}
                        <br />
                      </>
                    )}
                    <em>Type: {route.transportation_type}</em>
                    <br />
                    <em>Time: {route.estimated_time_minutes} min</em>
                    <br />
                    <strong>School: {route.school?.name}</strong>
                  </Popup>
                </Polyline>
              ))}

              {/* Render start marker */}
              {route.start?.coordinates && (
                <Marker
                  position={[route.start.coordinates[1], route.start.coordinates[0]]}
                >
                  <Popup>
                    <strong>{route.start_label || "Start Point"}</strong>
                    <br />
                    <em>Route: {route.name}</em>
                    <br />
                    <strong>To: {route.school?.name}</strong>
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
                    <strong>{route.name}</strong>
                    <br />
                    Point {idx + 1}
                  </Popup>
                </Marker>
              ))}
            </div>
          );
        })}
      </MapContainer>
    </div>
  );
}
