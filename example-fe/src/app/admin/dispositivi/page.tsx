'use client';
import { useRef, useState } from 'react';
import { Layout, Input, List, Tabs, TabsProps,  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import {Icon} from "leaflet";
import 'leaflet/dist/leaflet.css';

const { Sider, Content } = Layout;

const mockDevices = [
  'Disposiitivo1',
  'Disposiitivo1',
  'Disposiitivo1',
  'Disposiitivo1',
  
];

const markers = [
  {
    id: 1,
    geocode: [39.3017,16.2537],
    popup: "marker1"
  },
  {
    id: 2,
    geocode: [39.2854,16.2619],
    popup: "marker2"
  },
  {
    id: 3,
    geocode: [39.3154,16.2426],
    popup: "marker3"
  },
]

const customIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/727/727606.png",
  iconSize: [38,38]
})




export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');
  const mapRef = useRef();
  const filteredDevices = mockDevices.filter(device => 
    device.toLowerCase().includes(searchTerm.toLowerCase())
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
        
          {markers.map(marker => (
            <Marker key={marker.id} position={marker.geocode} icon={customIcon} >
              <Popup>{marker.popup}</Popup>
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
              <span style={{ color: 'white' }}>{item}</span>
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