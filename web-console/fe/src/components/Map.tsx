/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: Map.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
'use client';
import { DataDevice, Device } from '@/types';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

export default function MapComponent({ device }: { device: DataDevice }) {
  const customIcon = new Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/727/727606.png',
    iconSize: [38, 38],
  });

  return (
    <div style={{ height: '100%', marginTop: 3 }}>
      <MapContainer center={[39.298263, 16.253736]} zoom={13} style={{ height: '100%', width: '100%', marginTop: 30 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Marker key={device.id} position={[device.latitude, device.longitude]} icon={customIcon}>
          <Popup>{device.name}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
