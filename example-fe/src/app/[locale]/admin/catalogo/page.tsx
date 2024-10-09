'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Input, Layout, List, Menu, Row, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from './Catalogo.module.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

export default function Catalogo() {
  const t = useTranslations('Catalogo');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { notify, contextHolder } = useCustomNotification();
  const locale = useLocale();
  const router = useRouter();

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

  const handleLoadFW = () => {
    router.push(`/${locale}/admin/catalogo/ESPtool`);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Layout style={{ minHeight: '85vh' }}>
          <Content style={{ padding: '24px', backgroundColor: 'white' }}>
            <Row gutter={24}>
              <Col span={24} style={{ marginBottom: '20px' }}>
                <Input
                  placeholder={t('searchDevice')}
                  prefix={<SearchOutlined />}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Col>
            </Row>
            <Row gutter={24}>
              <Col span={8}>
                <Card title={t('devicesGroup')} style={{ marginBottom: '20px' }}>
                  <Menu
                    mode="vertical"
                    selectedKeys={selectedGroup ? [selectedGroup] : []}
                    onClick={({ key }) => handleGroupSelect(key)}
                  >
                    {groups.map((group) => (
                      <Menu.Item key={group}>{group}</Menu.Item>
                    ))}
                  </Menu>
                </Card>
              </Col>
              <Col span={8}>
                <Card title={selectedGroup || t('modelsGroup')} style={{ height: '100%' }}>
                  {selectedGroup ? (
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
                              color: selectedModel === model ? '#1890ff' : undefined,
                            }}
                          >
                            <span>{model}</span>
                          </Card>
                        </List.Item>
                      )}
                    />
                  ) : (
                    <Empty
                      image={<UnorderedListOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
                      description={t('selectGroupModel')}
                    />
                  )}
                </Card>
              </Col>
              <Col span={8}>
                {selectedModel && (
                  <Card title={selectedModel}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ width: '50%', height: '150px', backgroundColor: '#f0f0f0' }} />
                      <Button type="primary" style={{ marginRight: '8px' }}>
                        {t('order')}
                      </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <section style={{ width: '50%' }}>Dettagli del dispositivo {selectedModel} </section>
                      <hr />
                      <section style={{ marginLeft: 10 }}>Documenti</section>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'right',
                        marginTop: '20px',
                      }}
                    >
                      <Button type="primary" onClick={handleLoadFW}>
                        {t('loadFW')}
                      </Button>
                    </div>
                  </Card>
                )}
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
      <div className={styles.mobileMessage}>{t('mobileMessage')}</div>
    </>
  );
}
