'use client';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Drawer, Input, Layout, List, Table, Tabs, TabsProps } from 'antd';

import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { ColumnType, Device } from '@/types';
import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import styles from './Dispositivi.module.css';

const { Sider, Content } = Layout;

const Map = dynamic(() => import('../../../components/Map'), {
  ssr: false,
  loading: () => <p>Caricamento mappa...</p>,
});

/*const devices = [
  {
    id: 1,
    name: 'Dispositivo1',
    latitudine: 39.3017,
    longitudine: 16.2537,
  },
  {
    id: 2,
    name: 'Dispositivo2',
    latitudine: 39.2854,
    longitudine: 16.2619,
  },
  {
    id: 3,
    name: 'Dispositivo3',
    latitudine: 39.3154,
    longitudine: 16.2426,
  },
];*/

const columns: ColumnType[] = [
  {
    title: 'Funzione',
    dataIndex: 'funzione',
    key: 'funzione',
  },
  {
    title: 'Parametri',
    dataIndex: 'parametri',
    key: 'parametri',
  },
  {
    title: 'Ingressi',
    dataIndex: 'ingressi',
    key: 'ingressi',
  },
  {
    title: 'Uscite',
    dataIndex: 'uscite',
    key: 'uscite',
  },
];

const data = [
  {
    id: 1,
    name: 'Evento1',
  },
  {
    id: 2,
    name: 'Evento2',
  },
];

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [devicesData, setDevicesData] = useState<Device[]>([]);
  const { notify, contextHolder } = useCustomNotification();
  const filteredDevices = devicesData.filter((device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
  };

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

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Mappa',
      children: <Map devices={devicesData} />,
    },
    {
      key: '2',
      label: 'Programmazione',
      children: <Table columns={columns} size="small" rowKey={'parametri'} />,
    },
    {
      key: '3',
      label: 'Eventi',
      children: (
        <>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: '#f0f2f5',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
            >
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: '1px solid #7b97c1', padding: '12px 16px' }}>
                    <span>{item.name}</span>
                  </List.Item>
                )}
                style={{
                  height: '300px',
                  overflowY: 'auto',
                }}
              />
            </div>
            <Button type="primary" style={{ marginTop: '20px' }}>
              Clear Log
            </Button>
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Layout style={{ height: '100%' }}>
          <Sider
            width={250}
            theme="dark"
            style={{
              marginLeft: '-22px',
              marginTop: -2,
              maxHeight: '101%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ borderBottom: '2px solid #fff' }}>
              <br />
              <br />
              <br />
            </div>
            <span style={{ display: 'flex', justifyContent: 'center', fontSize: 20, color: 'white' }}>Dispositivi</span>
            <div style={{ padding: '16px' }}>
              <Input
                placeholder="Cerca..."
                onChange={(e) => setSearchTerm(e.target.value)}
                suffix={<SearchOutlined />}
              />
            </div>
            <List
              dataSource={filteredDevices}
              renderItem={(item) => (
                <List.Item
                  style={{ borderBottom: '1px solid #303030', padding: '8px 16px', cursor: 'pointer' }}
                  onClick={() => handleDeviceClick(item)}
                >
                  <span style={{ color: 'white' }}>{item.name}</span>
                </List.Item>
              )}
              style={{ height: '535px', overflowY: 'auto' }}
            />
          </Sider>
          <Drawer
            title="Informazioni dispositivo"
            placement="top"
            onClose={() => setSelectedDevice(null)}
            open={selectedDevice !== null}
            width={400}
          >
            {selectedDevice && (
              <div>
                <h2>{selectedDevice.name}</h2>
                <p>ID: {selectedDevice.id}</p>
                <p>Latitudine: {selectedDevice.latitudine}</p>
                <p>Longitudine: {selectedDevice.longitudine}</p>
              </div>
            )}
          </Drawer>
          <Layout>
            <Content style={{ padding: '24px', background: '#fff', maxHeight: '100%' }}>
              <Tabs defaultActiveKey="1" type="card" items={items} style={{ marginTop: -25, marginLeft: -15 }} />
            </Content>
          </Layout>
        </Layout>
      </div>
      <div className={styles.mobileMessage}>Questo contenuto non è disponibile sui dispositivi mobile.</div>
    </>
  );
}
