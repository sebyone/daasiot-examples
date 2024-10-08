'use client';
import {
  DeploymentUnitOutlined,
  DesktopOutlined,
  EnvironmentOutlined,
  SettingOutlined,
  ShoppingOutlined,
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type MenuItem = Required<MenuProps>['items'][number] & { roles?: string[] };

const getPathMap = (locale: string) => ({
  [`/${locale}/admin/configurazione`]: '/admin/configurazione',
  [`/${locale}/admin/dispositivi`]: '/admin/dispositivi',
  [`/${locale}/admin/catalogo`]: '/admin/catalogo',
  [`/${locale}/admin`]: '/admin',
});

const getSelectedKey = (pathname: string, locale: string): string => {
  const pathMap = getPathMap(locale);
  for (const [path, key] of Object.entries(pathMap)) {
    if (pathname.startsWith(path)) {
      return key;
    }
  }
  return '';
};

export default function NavMenu({ role }: { role: string }) {
  const pathname = usePathname();
  const t = useTranslations('NavMenu');
  const locale = useLocale();

  const [selectedKey, setSelectedKey] = useState<string>(getSelectedKey(pathname, locale));

  const allMenuItems: MenuItem[] = [
    {
      key: '/admin',
      icon: <DesktopOutlined />,
      label: <Link href={`/${locale}/admin`}>{t('dashboard')}</Link>,
    },
    {
      key: '/admin/configurazione',
      icon: <SettingOutlined />,
      label: <Link href={`/${locale}/admin/configurazione`}>{t('configuration')}</Link>,
    },
    {
      key: '/admin/dispositivi',
      icon: <DeploymentUnitOutlined />,
      label: <Link href={`/${locale}/admin/dispositivi`}>{t('devices')}</Link>,
    },
    {
      key: '/admin/catalogo',
      icon: <ShoppingOutlined />,
      label: <Link href={`/${locale}/admin/catalogo`}>{t('catalog')}</Link>,
    },
  ];

  useEffect(() => {
    setSelectedKey(getSelectedKey(pathname, locale));
  }, [pathname]);

  const menuItems = useMemo(() => {
    const roles = Array.isArray(role) ? role : [role];
    return allMenuItems.filter((item) => {
      if (!item.roles) return true;
      return item.roles.some((itemRole) => roles.includes(itemRole));
    });
  }, [role]);

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      style={{ height: '100%', borderRight: 0 }}
      items={menuItems}
    />
  );
}
