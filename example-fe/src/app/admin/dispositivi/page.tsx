'use client';
import { useState } from 'react';
import { Layout, Input, List, Tabs, TabsProps,  } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const { Sider, Content } = Layout;
const { TabPane } = Tabs;

const mockDevices = [
  'Disposiitivo1',
  'Disposiitivo1',
  'Disposiitivo1',
  'Disposiitivo1',
  
];

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDevices = mockDevices.filter(device => 
    device.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Plant view',
      children: (
        <h2>Plant View Content</h2>
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