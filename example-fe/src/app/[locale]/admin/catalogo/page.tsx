'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Col, Empty, Layout, List, Menu, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import styles from './Catalogo.module.css';
const { Content, Sider } = Layout;
const { Title } = Typography;

export default function Catalogo() {
  const t = useTranslations('Catalogo');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const { notify, contextHolder } = useCustomNotification();
  const groups = ['ModelGroup1', 'ModelGroup2'];
  const models = {
    ModelGroup1: ['DispositivoModel1', 'DispositivoModel2'],
    ModelGroup2: ['DispositivoModel3', 'DispositivoModel4'],
  };

  const handleGroupSelect = (group: string) => {
    setSelectedGroup(group);
    setSelectedModel(null);
  };
  const handleModelSelect = (model: string) => {
    setSelectedModel(model);
  };
  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Layout style={{ minHeight: '85vh' }}>
          <Sider width={250} theme="light">
            <div style={{ padding: '16px' }}>
              <Menu
                mode="inline"
                selectedKeys={selectedGroup ? [selectedGroup] : []}
                onClick={({ key }) => handleGroupSelect(key)}
              >
                {groups.map((group) => (
                  <Menu.Item key={group}>{group}</Menu.Item>
                ))}
              </Menu>
            </div>
          </Sider>
          <Layout style={{ backgroundColor: 'white' }}>
            <Content style={{ padding: '24px' }}>
              <Row gutter={24}>
                <Col span={12}>
                  {selectedGroup && (
                    <>
                      <Title level={4}>{selectedGroup}</Title>
                      <List
                        dataSource={models[selectedGroup]}
                        renderItem={(model) => (
                          <List.Item
                            onClick={() => handleModelSelect(model)}
                            style={{
                              cursor: 'pointer',
                            }}
                          >
                            <Card
                              hoverable
                              style={{
                                width: '100%',
                                backgroundColor: selectedModel === model ? '#e6f7ff' : undefined,
                              }}
                            >
                              <span>{model}</span>
                            </Card>
                          </List.Item>
                        )}
                      />
                    </>
                  )}
                  {!selectedGroup && (
                    <Empty
                      image={<UnorderedListOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
                      description={t('selectGroupModel')}
                    />
                  )}
                </Col>
                <Col span={12}>
                  {selectedModel && (
                    <Card title={selectedModel}>
                      <p>Dettagli del dispositivo {selectedModel}</p>
                      <Button type="primary" style={{ marginRight: '8px' }}>
                        {t('order')}
                      </Button>
                      <Button type="primary">{t('loadFW')}</Button>
                    </Card>
                  )}
                </Col>
              </Row>
            </Content>
          </Layout>
        </Layout>
      </div>
      <div className={styles.mobileMessage}>{t('mobileMessage')}</div>
    </>
  );
}
