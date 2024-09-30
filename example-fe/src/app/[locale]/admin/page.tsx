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
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title="Receivers"
                value={receiversCount}
                prefix={<WifiOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: 290 }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title={t('managedNodes')}
                value={remotesCount}
                prefix={<ApiOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: 290 }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card hoverable>
              <Statistic
                title={t('messagesExchanged')}
                value={0}
                prefix={<MessageOutlined style={{ fontSize: '24px', color: '#faad14', marginRight: 290 }} />}
                className={styles.customStatistic}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <div className={styles.mobileMessage}>Questo contenuto non è disponibile sui dispositivi mobile.</div>
    </>
  );
}
