import { BaseCardDispositivoProps } from '@/types';
import { Button, Card, Select } from 'antd';
import React, { ReactNode } from 'react';

const BaseCardDispositivo = ({
  deviceName,
  status,
  setStatus,
  value,
  setValue,
  onSend,
  children,
}: BaseCardDispositivoProps) => {
  return (
    <Card title={deviceName} bordered={false} style={{ width: 300, backgroundColor: '#f0f0f0', padding: 0 }}>
      {children}
      <Button type="primary" onClick={onSend}>
        Invia
      </Button>
    </Card>
  );
};

export default BaseCardDispositivo;
