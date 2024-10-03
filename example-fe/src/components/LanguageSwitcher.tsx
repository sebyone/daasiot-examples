'use client';
import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const changeLanguage = (locale: string) => {
    const currentLocale = pathname.split('/')[1];
    const newPath = pathname.replace(`/${currentLocale}`, `/${locale}`);
    router.push(newPath);
  };

  const menuItems = [
    {
      key: 'it',
      label: 'Italiano',
      onClick: () => changeLanguage('it'),
    },
    {
      key: 'en',
      label: 'English',
      onClick: () => changeLanguage('en'),
    },
  ];

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button
        icon={<GlobalOutlined />}
        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', marginTop: 20, marginRight: 20 }}
      />
    </Dropdown>
  );
};

export default LanguageSwitcher;
