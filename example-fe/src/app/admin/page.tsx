'use client';
import ConfigService from '@/services/configService';
import { ApiOutlined, MessageOutlined, WifiOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';
export default function Admin() {
  const [remotesCount, setRemotesCount] = useState<number>(0);

  useEffect(() => {
    const fetchReceiversCount = async () => {
      try {
        const count = await ConfigService.getRemotesCount();
        setRemotesCount(count);
      } catch (error) {
        console.error('Errore nel recupero del conteggio dei receivers:', error);
      }
    };

    fetchReceiversCount();
  }, []);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '24px',
      }}
    >
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Receivers"
              value={0}
              prefix={<WifiOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: 290 }} />}
              className={styles.customStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Nodi Gestiti"
              value={remotesCount}
              prefix={<ApiOutlined style={{ fontSize: '24px', color: '#52c41a', marginRight: 290 }} />}
              className={styles.customStatistic}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card hoverable>
            <Statistic
              title="Messaggi Scambiati"
              value={0}
              prefix={<MessageOutlined style={{ fontSize: '24px', color: '#faad14', marginRight: 290 }} />}
              className={styles.customStatistic}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
