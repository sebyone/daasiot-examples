'use client';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Layout, List, Tabs, TabsProps } from 'antd';

import 'leaflet/dist/leaflet.css';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';

const { Sider, Content } = Layout;

const Map = dynamic(() => import('../../../components/Map'), {
  ssr: false,
  loading: () => <p>Caricamento mappa...</p>,
});

const devices = [
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
];

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef();
  const filteredDevices = devices.filter((device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Plant view',
      children: <Map devices={devices} />,
    },
    {
      key: '2',
      label: 'Event view',
      children: <h2>Event View Content</h2>,
    },
  ];

  return (
    <Layout style={{ height: '85vh' }}>
      <Sider width={250} theme="dark" style={{ marginLeft: -23, marginTop: -3, height: 625 }}>
        <span style={{ display: 'flex', justifyContent: 'center', fontSize: 20, color: 'white' }}>Dispositivi</span>
        <div style={{ padding: '16px' }}>
          <Input placeholder="Cerca..." onChange={(e) => setSearchTerm(e.target.value)} suffix={<SearchOutlined />} />
        </div>
        <List
          dataSource={filteredDevices}
          renderItem={(item) => (
            <List.Item style={{ borderBottom: '1px solid #303030', padding: '8px 16px' }}>
              <span style={{ color: 'white' }}>{item.name}</span>
            </List.Item>
          )}
          style={{ height: '535px', overflowY: 'auto' }}
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Tabs defaultActiveKey="1" type="card" items={items} style={{ marginTop: -25, marginLeft: -15 }} />
        </Content>
      </Layout>
    </Layout>
  );
}
