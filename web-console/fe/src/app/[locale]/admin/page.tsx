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
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { ApiOutlined, MessageOutlined, WifiOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { notify, contextHolder } = useCustomNotification();
  const [remotesCount, setRemotesCount] = useState<number>(0);
  const [receiversCount, setReceiversCount] = useState<number>(0);
  const t = useTranslations('Dashboard');

  useEffect(() => {
    const fetchRemotesCount = async () => {
      try {
        const count = await ConfigService.getRemotesCount();
        setRemotesCount(count);
      } catch (error) {
        notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento del conteggio dei remotes');
        console.error('Errore nel caricamento del conteggio dei remotes:', error);
      }
    };
    const fetchReceiversCount = async () => {
      try {
        const count = await ConfigService.getReceiversCount();
        setReceiversCount(count);
      } catch (error) {
        notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento del conteggio dei receivers');
        console.error('Errore nel caricamento del conteggio dei receivers:', error);
      }
    };

    fetchRemotesCount();
    fetchReceiversCount();
  }, []);

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Row gutter={[30, 30]} style={{ width: '100%' }}>
          <Col xs={24} sm={24} md={8}>
            <Card hoverable style={{ width: '100%' }}>
              <Statistic
                title="Receivers"
                value={receiversCount}
                prefix={<WifiOutlined style={{ color: '#1890ff' }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card hoverable style={{ width: '100%' }}>
              <Statistic
                title={t('managedNodes')}
                value={remotesCount}
                prefix={<ApiOutlined style={{ color: '#52c41a' }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Card hoverable style={{ width: '100%' }}>
              <Statistic
                title={t('messagesExchanged')}
                value={0}
                prefix={<MessageOutlined style={{ color: '#faad14' }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}
