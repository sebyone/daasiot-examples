'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { Device } from '@/types';
import 'leaflet/dist/leaflet.css';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';

const Mappa = () => {
  const t = useTranslations('Mappa');
  const MapComponent = dynamic(() => import('@/components/Map'), {
    ssr: false,
    loading: () => <p>{t('loading')}</p>,
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
          latitudine: device.latitude,
          longitudine: device.longitude,
        }));
        setDevicesData(devices);
      } catch (error) {
        notify('error', t('error'), t('errorGetDevices'));
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
