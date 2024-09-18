'use client';
import {
  DesktopOutlined,
  DeploymentUnitOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number] & { roles?: string[] };

const pathMap = {
  
  '/admin/configurazione': '/admin/configurazione',
  '/admin/dispositivi': '/admin/dispositivi',
  '/admin': '/admin',
};

const getSelectedKey = (pathname: string): string => {
  for (const [path, key] of Object.entries(pathMap)) {
    if (pathname.startsWith(path)) {
      return key;
    }
  }
  return '';
};

export default function NavMenu({ role }: { role: string }) {
  const pathname = usePathname();
  const [selectedKey, setSelectedKey] = useState<string>(getSelectedKey(pathname));

  const allMenuItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <DesktopOutlined /> ,
      label: <Link href={'/admin'}>Dashboard</Link>,
    },
    {
      key: '/admin/configurazione',
      icon: <SettingOutlined />,
      label: <Link href={'/admin/configurazione'}>Configurazione</Link>,
    },
    {
      key: '/admin/dispositivi',
      icon: <DeploymentUnitOutlined />,
      label: <Link href={'/admin/dispositivi'}>Dispositivi</Link>,
    },
  ];

  useEffect(() => {
    setSelectedKey(getSelectedKey(pathname));
  }, [pathname]);

  const menuItems = useMemo(() => {
    const roles = Array.isArray(role) ? role : [role];
    return allMenuItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.some((itemRole) => roles.includes(itemRole));
    });
  }, [role]);

  return (
    <Menu theme='dark' mode="inline" selectedKeys={[selectedKey]} style={{ height: '100%', borderRight: 0 }} items={menuItems} />
  );
}
