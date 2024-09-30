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

  const menu = (
    <Menu>
      <Menu.Item key="it" onClick={() => changeLanguage('it')}>
        Italiano
      </Menu.Item>
      <Menu.Item key="en" onClick={() => changeLanguage('en')}>
        English
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} placement="bottomRight">
      <Button
        icon={<GlobalOutlined />}
        style={{ backgroundColor: 'transparent', border: 'none', color: 'white', marginTop: 20, marginRight: 20 }}
      ></Button>
    </Dropdown>
  );
};

export default LanguageSwitcher;
