'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { Device } from '@/types';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const Mappa = () => {
  const MapComponent = dynamic(() => import('../../../components/Map'), {
    ssr: false,
    loading: () => <p>Caricamento mappa...</p>,
  });
  const { notify, contextHolder } = useCustomNotification();
  const [devicesData, setDevicesData] = useState<Device[]>([]);
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await ConfigService.getDevices();
        const devices = data.map((device) => ({
          id: device.id,
          name: device.name,
          latitudine: device.latitudine,
          longitudine: device.longitudine,
        }));
        setDevicesData(devices);
      } catch (error) {
        notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento dei dispositivi');
      }
    };

    fetchDevices();
  }, []);
  return (
    <>
      {contextHolder}
      <MapComponent devices={devicesData} />
    </>
  );
};

export default Mappa;
