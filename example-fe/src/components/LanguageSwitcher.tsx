'use client';
import { GlobalOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';
import { usePathname, useRouter } from 'next/navigation';

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split('/')[1];

  const changeLanguage = (locale: string) => {
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

  const getCurrentLanguageLabel = () => {
    return menuItems.find((item) => item.key === currentLocale)?.label || '';
  };

  return (
    <Dropdown menu={{ items: menuItems }} placement="bottomRight">
      <Button
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          color: 'white',
          marginTop: 20,
          marginRight: 20,
          padding: '4px 8px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Space>
          <GlobalOutlined />
          <span>{getCurrentLanguageLabel()}</span>
        </Space>
      </Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
