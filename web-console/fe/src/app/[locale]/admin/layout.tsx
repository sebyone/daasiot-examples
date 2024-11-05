/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: layout.tsx
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

import { Layout } from 'antd';

const { Header, Sider, Content } = Layout;

import NavMenu from '@/components/base/NavMenu';
import DaaSIoTLogo from '@/components/DaaSIoTLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { Footer } from 'antd/es/layout/layout';
import version from '../../../../version';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ height: '100vh', position: 'fixed', left: 0, background: '#001529' }}>
        <div style={{ padding: '16px' }}>
          <DaaSIoTLogo />
        </div>
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
        >
          <LanguageSwitcher />
        </Header>
        <Content
          style={{
            margin: '24px',
            padding: 24,
            minHeight: 380,
            maxHeight: '90vh',
            background: 'white',
            borderRadius: '4px',
          }}
        >
          <div id="form-menu-portal" style={{ marginTop: -20 }}></div>
          {children}
        </Content>
      </Layout>
      <Footer
        style={{
          position: 'fixed',
          bottom: '0',
          width: '100%',
          textAlign: 'left',
          backgroundColor: '#002140',
          height: '25px',
          display: 'flex',
          alignItems: 'center',
          padding: '0 1rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ color: '#fff', fontSize: '0.8rem' }}>DaaS-IoT NodeJs ver {version}</div>
          <div></div>
          <div></div>
        </div>
      </Footer>
    </Layout>
  );
}
