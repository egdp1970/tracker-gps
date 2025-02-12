import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { RoutePoint } from '../types';

interface MapComponentProps {
  currentPosition: RoutePoint | null;
  routePoints: RoutePoint[];
}

export default function MapComponent({ currentPosition, routePoints }: MapComponentProps) {
  const [map, setMap] = useState<LeafletMap | null>(null);

  useEffect(() => {
    if (map && currentPosition) {
      map.setView([currentPosition.latitude, currentPosition.longitude]);
    }
  }, [map, currentPosition]);

  if (!currentPosition) {
    return <div>Cargando ubicación...</div>;
  }

  const routeCoordinates = routePoints.map(point => [point.latitude, point.longitude]);

  return (
    <MapContainer
      center={[currentPosition.latitude, currentPosition.longitude]}
      zoom={15}
      style={{ height: '100%', width: '100%' }}
      ref={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {currentPosition && (
        <Marker position={[currentPosition.latitude, currentPosition.longitude]} />
      )}
      {routeCoordinates.length > 0 && (
        <Polyline positions={routeCoordinates as [number, number][]} color="blue" />
      )}
    </MapContainer>
  );
}