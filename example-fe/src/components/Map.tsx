'use client';
import { Device } from '@/types';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function MapComponent({ device }: { device: Device }) {
  const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/727/727606.png',
    iconSize: [38, 38],
  });

  return (
    <div style={{ height: '100%', marginTop: 3 }}>
      <MapContainer center={[39.298263, 16.253736]} zoom={13} style={{ height: '100%', width: '100%', marginTop: 30 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker key={device.id} position={[device.latitudine, device.longitudine]} icon={customIcon}>
          <Popup>{device.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
