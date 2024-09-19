'use client';
import { useRef, useState } from 'react';
import { Layout, Input, List, Tabs, TabsProps,  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {Icon} from "leaflet";
import 'leaflet/dist/leaflet.css';

const { Sider, Content } = Layout;

const devices = [
  {
    id: 1,
    name: "Dispositivo1",
    latitudine: 39.3017,
    longitudine: 16.2537,
  },
  {
    id: 2,
    name: "Dispositivo2",
    latitudine: 39.2854,
    longitudine: 16.2619,
  },
  {
    id: 3,
    name: "Dispositivo3",
    latitudine: 39.3154,
    longitudine: 16.2426,
  },
]

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/727/727606.png",
  iconSize: [38,38]
})


export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef();
  const filteredDevices = devices.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase())
  );


  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Plant view',
      children: (
        <div style={{height: '81vh', marginTop: 3}}>
        <MapContainer center={[39.298263, 16.253736]} zoom={13} ref={mapRef} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
        
          {devices.map(device => (
            <Marker key={device.id} position={[device.latitudine,device.longitudine]} icon={customIcon} >
              <Popup>{device.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Event view',
      children: (
        <h2>Event View Content</h2>
      ),
    },
  ];

  return (
    <Layout style={{ height: '85vh' }}>
      <Sider width={250} theme="dark" style={{marginLeft: -23, marginTop: -3, height: 625}}>
        <span style={{display: 'flex', justifyContent:'center', fontSize: 20, color: 'white'}}>Dispositivi</span>
        <div style={{ padding: '16px' }}>
          <Input
            placeholder="Cerca..."
            onChange={(e) => setSearchTerm(e.target.value)}
            suffix={<SearchOutlined />}
          />
        </div>
        <List
          dataSource={filteredDevices}
          renderItem={item => (
            <List.Item style={{ borderBottom: '1px solid #303030', padding: '8px 16px' }}>
              <span style={{ color: 'white' }}>{item.name}</span>
            </List.Item>
          )}
          style={{ height: '535px', overflowY: 'auto' }}
          
        />
      </Sider>
      <Layout>
        <Content style={{ padding: '24px', background: '#fff' }}>
          <Tabs defaultActiveKey="1" type='card' items={items} style={{marginTop: -25, marginLeft: -15}}/>
        </Content>
      </Layout>
    </Layout>
  );
}