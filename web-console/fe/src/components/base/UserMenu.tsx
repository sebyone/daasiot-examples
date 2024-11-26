import { DownOutlined, LogoutOutlined, SafetyCertificateOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, MenuProps, Space } from 'antd';
import React from 'react';
import styles from './UserMenu.module.css';

const items: MenuProps['items'] = [
  {
    label: <div>Profilo</div>,
    key: '0',
    disabled: true,
  },
  {
    type: 'divider',
  },
  {
    label: 'Log Out',
    icon: <LogoutOutlined />,
    key: 'logout',
    disabled: true,
  },
];

export default function UserMenu() {
  return (
    <>
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <Button onClick={(e) => e.preventDefault()} type="link" style={{ color: 'white' }}>
          <Space>
            <span className={styles.user}>{'Utente xxx'}</span>
            <Avatar icon={<UserOutlined style={{ color: 'white' }} />} />
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </>
  );
}
