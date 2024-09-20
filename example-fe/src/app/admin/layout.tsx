'use client';

import { Layout } from 'antd';

const { Header, Sider, Content } = Layout;

import NavMenu from '@/components/base/NavMenu';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ height: '100vh', position: 'fixed', left: 0, background: '#001529' }}>
        <NavMenu role="" />
      </Sider>
      <Layout style={{ marginLeft: 200, background: '#001529' }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            background: '#001529',
            padding: '0 1rem',
            height: '20px',
          }}
        ></Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 380,
            background: 'white',
            borderRadius: '4px',
          }}
        >
          <div id="form-menu-portal" style={{ marginTop: -20 }}></div>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
