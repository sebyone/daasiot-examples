/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: page.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
'use client';
import DataPanel from '@/components/DataPanel';
import { SyncOutlined } from '@ant-design/icons';
import { Alert, Button, Card } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';

const CaricaFirmware = () => {
  const t = useTranslations('CaricaFirmware');
  const locale = useLocale();
  return (
    <>
      <DataPanel title={t('uploadFirmware')} isEditing={false} showSemaphore={false}>
        <Button type="primary" icon={<SyncOutlined />} style={{ marginBottom: 20 }}>
          <Link href="https://test.daasiot.net/flashtool/">DaaS Updater for ESP32</Link>
        </Button>

        <Card title={t('infoFirmware')} style={{ marginBottom: 20 }}>
          <p>
            <strong>{t('currentVersion')}</strong> v1.0.0
          </p>
          <p>
            <strong>{t('lastUpdateDate')}</strong> 16/10/2024
          </p>
        </Card>

        <Alert
          message={t('importantNotes')}
          description={t('note')}
          type="warning"
          showIcon
          style={{ marginBottom: 20 }}
        />
      </DataPanel>
    </>
  );
};

export default CaricaFirmware;
