'use client';

import { Layout } from 'antd';
import Image from 'next/image';

const { Header, Sider, Content } = Layout;

import Loader from '@/components/base/Loader';
import NavMenu from '@/components/base/NavMenu';
import UserMenu from '@/components/base/UserMenu';
import { useSession } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status == 'loading') {
    return <Loader />;
  } else {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Sider width={200} style={{ height: '100vh', position: 'fixed', left: 0, background: '#001529' }}>
          <NavMenu role={session?.user?.role} />
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
              height: '20px'
            }}
          >
            <UserMenu />
          </Header>
          <Content
            style={{
              margin: '24px',
              padding: 24,
              minHeight: 380,
              background: 'white',
              borderRadius: '4px',
            }}
          >
            <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
            <div id="form-menu-portal" style={{ marginTop: -20 }}></div>
            {children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}