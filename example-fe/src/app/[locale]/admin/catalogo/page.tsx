'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { Dev, DeviceGroup, DeviceModel, DeviceModelGroup } from '@/types';
import { SearchOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Empty, Input, Layout, List, Menu, Pagination, Row, Typography } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Catalogo.module.css';

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

interface DeviceGroupData {
  id: number;
  title: string;
}

export default function Catalogo() {
  const t = useTranslations('Catalogo');
  const [selectedGroup, setSelectedGroup] = useState<DeviceGroupData | null>(null);
  const [selectedModel, setSelectedModel] = useState<Dev | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { notify, contextHolder } = useCustomNotification();
  const locale = useLocale();
  const router = useRouter();

  const [groups, setGroups] = useState<DeviceGroup | null>(null);
  const [deviceModels, setDeviceModels] = useState<DeviceModel | null>(null);
  const [groupsPagination, setGroupsPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [modelsPagination, setModelsPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  useEffect(() => {
    fetchDeviceModelGroups(groupsPagination.current, groupsPagination.pageSize);
  }, [groupsPagination.current, groupsPagination.pageSize]);

  const fetchDeviceModelGroups = async (page: number, pageSize: number) => {
    try {
      const offset = (page - 1) * pageSize;
      const response = await ConfigService.getDeviceModelGroups(offset, pageSize);
      setGroups(response);
      setGroupsPagination((prev) => ({ ...prev, total: response.pagination.total }));
    } catch (error) {
      notify('error', t('error'), t('errorGetDevices'));
    }
  };

  const handleGroupSelect = async (groupId: number, groupTitle: string) => {
    setSelectedGroup({ id: groupId, title: groupTitle });
    setSelectedModel(null);
    fetchDeviceModels(groupId, modelsPagination.current, modelsPagination.pageSize);
  };

  const fetchDeviceModels = async (groupId: number, page: number, pageSize: number) => {
    try {
      const offset = (page - 1) * pageSize;
      const response = await ConfigService.getDeviceModelByModelGroupId(groupId, offset, pageSize);
      setDeviceModels(response);
      setModelsPagination((prev) => ({ ...prev, total: response.pagination.total }));
    } catch (error) {
      notify('error', t('error'), t('errorGetModels'));
    }
  };

  const handleGroupsPaginationChange = (page: number, pageSize?: number) => {
    setGroupsPagination((prev) => ({ ...prev, current: page, pageSize: pageSize || prev.pageSize }));
  };
  const handleModelsPaginationChange = (page: number, pageSize?: number) => {
    setModelsPagination((prev) => ({ ...prev, current: page, pageSize: pageSize || prev.pageSize }));
    if (selectedGroup) {
      fetchDeviceModels(selectedGroup.id, page, pageSize || modelsPagination.pageSize);
    }
  };

  const handleModelSelect = (model: Dev) => {
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
                  {groups?.data ? (
                    <Menu
                      mode="vertical"
                      selectedKeys={selectedGroup?.title ? [selectedGroup.title] : []}
                      onClick={({ key }) => {
                        const group = groups.data.find((g) => g.title === key);
                        if (group) {
                          handleGroupSelect(group.id, group.title);
                        }
                      }}
                    >
                      {groups.data.map((group) => (
                        <Menu.Item key={group.title}>{group.title}</Menu.Item>
                      ))}
                      <Pagination
                        current={groupsPagination.current}
                        pageSize={groupsPagination.pageSize}
                        pageSizeOptions={['10', '20', '50', '100']}
                        total={groupsPagination.total}
                        onChange={handleGroupsPaginationChange}
                        showSizeChanger
                        showQuickJumper
                      />
                    </Menu>
                  ) : (
                    <Empty description={t('noGroupsAvailable')} />
                  )}
                </Card>
              </Col>
              <Col span={8}>
                <Card title={selectedGroup?.title || t('modelsGroup')} style={{ height: '100%' }}>
                  {selectedGroup ? (
                    deviceModels?.data ? (
                      <List
                        dataSource={deviceModels.data}
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
                                backgroundColor: selectedModel?.id === model.id ? '#e6f7ff' : undefined,
                                color: selectedModel?.id === model.id ? '#1890ff' : undefined,
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 50 }}>
                                {model.link_image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={model.link_image}
                                    alt={model.description}
                                    style={{ width: '20%', height: '20%' }}
                                  />
                                )}
                                <span>{model.description}</span>
                              </div>
                            </Card>
                          </List.Item>
                        )}
                      />
                    ) : (
                      <Empty description={t('noModelsAvailable')} />
                    )
                  ) : (
                    <Empty
                      image={<UnorderedListOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
                      description={t('selectGroupModel')}
                    />
                  )}
                  <Pagination
                    current={modelsPagination.current}
                    pageSize={modelsPagination.pageSize}
                    pageSizeOptions={['10', '20', '50', '100']}
                    total={modelsPagination.total}
                    onChange={handleModelsPaginationChange}
                    showSizeChanger
                    showQuickJumper
                  />
                </Card>
              </Col>
              <Col span={8}>
                {selectedModel && (
                  <Card title={selectedModel.description}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: '20px',
                      }}
                    >
                      <div style={{ width: '50%', height: '150px', backgroundColor: '#f0f0f0' }}>
                        {selectedModel.link_image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={selectedModel.link_image}
                            alt={selectedModel.description}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <Button type="primary" style={{ marginRight: '8px' }}>
                        {t('order')}
                      </Button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                      <section style={{ width: '50%' }}>
                        <p>
                          {t('serialNumber')} {selectedModel.serial}
                        </p>
                        <p>
                          {t('ModelGroupID')} {selectedModel.device_group_id}
                        </p>
                      </section>
                      <Divider type="vertical" style={{ height: 'auto' }} />
                      <section style={{ marginLeft: 10 }}>
                        <Title level={5}>{t('documents')}</Title>
                        {selectedModel.link_datasheet && (
                          <Text>
                            <a href={selectedModel.link_datasheet} target="_blank" rel="noopener noreferrer">
                              Datasheet
                            </a>
                          </Text>
                        )}
                        {selectedModel.link_userguide && (
                          <Text>
                            <a href={selectedModel.link_userguide} target="_blank" rel="noopener noreferrer">
                              User Guide
                            </a>
                          </Text>
                        )}
                      </section>
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
