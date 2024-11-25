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
import Settings from '@/components/base/Settings';
import DaaSIoTLogo from '@/components/DaaSIoTLogo';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useWindowSize } from '@/hooks/useWindowSize';
import { Footer } from 'antd/es/layout/layout';
import version from '../../../../version';
import styles from './Layout.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { width } = useWindowSize();
  const wh = width < 1024;
  return (
    <Layout style={{ height: '100vh', overflow: wh ? '' : 'hidden' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth="0"
        className={styles.siderCustom}
        style={{
          backgroundColor: '#001529',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div style={{ padding: '16px' }}>
          <DaaSIoTLogo />
        </div>
        <NavMenu />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: '#001529',
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            position: 'sticky',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <Settings />
            <LanguageSwitcher />
          </div>
        </Header>
        <Content
          style={{
            padding: 24,
            background: 'white',
          }}
        >
          <div id="form-menu-portal" style={{ marginTop: -20 }}></div>
          {children}
        </Content>
        <Footer
          style={{
            textAlign: 'left',
            backgroundColor: '#002140',
            height: '25px',
            position: 'fixed',
            bottom: '0',
            width: '100%',
            padding: '0 1rem',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ color: '#fff', fontSize: '0.8rem', lineHeight: 1 }}>DaaS-IoT NodeJs ver {version}</div>
        </Footer>
      </Layout>
    </Layout>
  );
}
/*<Layout style={{ minHeight: '100vh' }}>
      <Sider width={175} style={{ height: '100vh', position: 'fixed', left: 0, background: '#001529' }}>
        <div style={{ padding: '16px' }}>
          <DaaSIoTLogo />
        </div>
        <NavMenu role="" />
      </Sider>
      <Layout style={{ marginLeft: 155, background: '#001529' }}>
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
          <Settings />
          <LanguageSwitcher />
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
}*/
