import { BaseCardDispositivoProps } from '@/types';
import { Button, Card, Select } from 'antd';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('BaseCardDispositivo');
  return (
    <Card title={deviceName} bordered={false} style={{ width: 300, backgroundColor: '#f0f0f0', padding: 0 }}>
      {children}
      <Button type="primary" onClick={onSend}>
        {t('send')}
      </Button>
    </Card>
  );
};

export default BaseCardDispositivo;
