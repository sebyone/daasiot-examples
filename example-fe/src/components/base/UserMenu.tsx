import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Space } from 'antd';
import { signOut, useSession } from 'next-auth/react';
import React from 'react';

export default function UserMenu() {
  const { data: session, status } = useSession();

  if (status == 'loading') {
    return <div className="my-3">Loading...</div>;
  } else if (session) {
    return (
      
        <Button 
          onClick={async () => await signOut({ callbackUrl: '/' })} 
          style={{
            backgroundColor: 'rgb(0, 21, 41)', 
            color: 'white', 
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 20,
          }}
        >
          Logout <LogoutOutlined  />
        </Button>
        
    );
  }
  return (
    <>
      <Avatar icon={<UserOutlined />} />
    </>
  );
}