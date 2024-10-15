/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: BaseCardDispositivo.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { BaseCardDispositivoProps } from '@/types';
import { Button, Card } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

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
