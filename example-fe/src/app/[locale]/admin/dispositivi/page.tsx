'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { default as ConfigService, default as configService } from '@/services/configService';
import { Device } from '@/types';
import { DeploymentUnitOutlined, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Layout, List, Modal, Table, Tabs, TabsProps } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from './Dispositivi.module.css';

const { Sider, Content } = Layout;

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const NodoForm = dynamic(() => import('@/components/NodoForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });
const PayloadContentViewer = dynamic(() => import('@/components/PayloadContentView'), { ssr: false });
const CardDispositivoFactory = dynamic(() => import('@/components/CardDispositivoFactory'), { ssr: false });

/*const devices = [
  {
    id: 1,
    name: 'Dispositivo1',
    latitudine: 39.3017,
    longitudine: 16.2537,
  },
  {
    id: 2,
    name: 'Dispositivo2',
    latitudine: 39.2854,
    longitudine: 16.2619,
  },
  {
    id: 3,
    name: 'Dispositivo3',
    latitudine: 39.3154,
    longitudine: 16.2426,
  },
];*/

export default function Dispositivi() {
  const router = useRouter();
  const t = useTranslations('Dispositivi');
  const [formDaasIoT] = Form.useForm();
  const [searchTerm, setSearchTerm] = useState('');
  const [devicesData, setDevicesData] = useState<Device[]>([]);
  const { notify, contextHolder } = useCustomNotification();
  const filteredDevices = devicesData.filter((device) => device.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [status, setStatus] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [ws, setSocket] = useState<WebSocket | null>(null);
  const [dinOptions, setDinOptions] = useState<number[]>([]);
  const [selectedDin, setSelectedDin] = useState<number | null>(null);
  const [showTestControl, setShowTestControl] = useState<boolean>(false);
  const [functions, setFunctions] = useState([]);
  const [availableFunctions, setAvailableFunctions] = useState([
    { id: 1, name: 'funzione1' },
    { id: 2, name: 'funzione2' },
  ]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeviceSelected, setIsDeviceSelected] = useState(false);
  const [isModalInfoEventVisible, setIsModalInfoEventVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const locale = useLocale();

  const handleTableChange = (pagination) => {
    //API
  };

  const columns = [
    {
      title: t('function'),
      dataIndex: 'name',
      key: 'name',
      render: (text, record, index) => {
        if (record.id === 'add') {
          return availableFunctions.length > 0 ? (
            <Button type="link" icon={<PlusOutlined />} onClick={() => setIsModalVisible(true)}>
              {t('addFunction')}
            </Button>
          ) : null;
        }
        return text;
        {
          /*(
          <Select style={{ width: '100%' }} value={text} onChange={(value) => handleFunctionChange(value, index)}>
            {availableFunctions.map((func) => (
              <Select.Option key={func.id} value={func.name}>
                {func.name}
              </Select.Option>
            ))}
          </Select>*/
        }
      },
    },
    { title: t('parameters'), dataIndex: 'parametri', key: 'parametri' },
    { title: t('input'), dataIndex: 'ingressi', key: 'ingressi' },
    { title: t('output'), dataIndex: 'uscite', key: 'uscite' },
  ];

  const handleViewClick = (record) => {
    setSelectedRow(record);
    setIsModalInfoEventVisible(true);
  };

  const handleModalClose = () => {
    setIsModalInfoEventVisible(false);
    setSelectedRow(null);
  };

  const columnsEvents = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Typeset',
      dataIndex: 'typeset',
      key: 'typeset',
    },
    {
      title: 'Payload Size',
      dataIndex: 'payloadSize',
      key: 'payloadSize',
    },
    {
      title: '',
      key: 'action',
      render: (text, record) => (
        <SearchOutlined style={{ cursor: 'pointer' }} onClick={() => handleViewClick(record)} />
      ),
    },
  ];

  const eventsData = [
    {
      key: '1',
      timestamp: '2024-09-30 11:00:00',
      typeset: 'typeset1',
      payloadSize: '6',
    },
    {
      key: '2',
      timestamp: '2024-09-30 11:05:00',
      typeset: 'typeset2',
      payloadSize: '10',
    },
  ];

  /*
  const addFunction = async (func) => {
    try {
      const functionDetails = await ConfigService.getFunctionDetails(func.id);
      setFunctions([...functions, {
        id: Date.now(),
        name: func.name,
        parameters: functionDetails.parameters,
        inputs: functionDetails.inputs,
        outputs: functionDetails.outputs
      }]);
      setIsModalVisible(false);
    } catch (error) {
    } 
  };

  */

  const addFunction = (func) => {
    setFunctions([...functions, { id: Date.now(), name: func.name }]);
    setAvailableFunctions(availableFunctions.filter((f) => f.id !== func.id));
    setIsModalVisible(false);
  };

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device);
    setIsDeviceSelected(true);
  };

  const ActionButtons = () => (
    <div style={{ marginTop: 16 }}>
      <Button style={{ marginRight: 8 }} type="primary">
        Recall
      </Button>
      <Button type="primary">{t('edit')}</Button>
    </div>
  );

  const ProgramButton = () => (
    <Button
      type="primary"
      onClick={() => {
        // SendProgram
      }}
      style={{ float: 'right', marginTop: 16 }}
    >
      {t('schedule')}
    </Button>
  );

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const data = await ConfigService.getDevices();
        const devices = data.map((device) => ({
          id: device.id,
          name: device.name,
          latitudine: device.latitude,
          longitudine: device.longitude,
        }));
        setDevicesData(devices);
      } catch (error) {
        notify('error', t('error'), t('errorGetDevices'));
      }
    };

    fetchDevices();
  }, []);

  useEffect(() => {
    if (selectedDevice) {
      configService.getDeviceById(selectedDevice.id).then((data) => {
        formDaasIoT.setFieldsValue({
          id: data.id,
          denominazione: data.name,
          matricola: data.device_model.serial,
          modello: data.device_model.description,
          sid: data.din.sid,
          din: data.din.din,
          latitudine: data.latitude,
          longitudine: data.longitude,
        });
      });
    }
  }, [selectedDevice, formDaasIoT]);

  const handleTest = () => {
    setShowTestComponent((prevState) => !prevState);
  };

  useEffect(() => {
    const socket = new WebSocket(`${process.env.NEXT_PUBLIC_API_BASE_URL}`);

    socket.onmessage = (event) => {
      console.log('Ricevuto messaggio', event.data);
      const data = JSON.parse(event.data);

      if (data.event === 'ddo') {
        setStatus(data.status);
        setValue(data.value);
      }
    };

    socket.onopen = () => {
      console.log('Connesso al server');
    };

    socket.onclose = () => {
      console.log('Disconnesso dal server');
    };

    setSocket(socket);

    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  const onChangeComplete = (value: number) => {
    setValue(value);
  };

  const onChange = (status: boolean) => {
    setStatus(status);
  };

  /*useEffect(() => {
    configService
      .getDinOptions()
      .then(setDinOptions)
      .catch((error) => {
        console.error('Errore:', error);
      });

    */

  const onSend = async () => {
    if (selectedDevice) {
      try {
        const device = await configService.getDeviceById(selectedDevice.id);
        const response = await configService.sendPayload(Number(device.din.din), status, value);
        console.log(response);
      } catch (error) {
        console.error('Errore:', error);
      }
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('general'),
      children: (
        <>
          <NodoForm form={formDaasIoT} onFinish={() => {}} setIsDataSaved={() => {}} readOnly={true} />
          <Button type="primary" onClick={handleTest} style={{ marginBottom: 20 }}>
            Test
          </Button>
          {showTestComponent && (
            <div style={{ marginTop: -40, marginLeft: 70 }}>
              <CardDispositivoFactory
                deviceType="UPL"
                deviceName="UPL Modello XX"
                dinOptions={dinOptions}
                selectedDin={selectedDin}
                setSelectedDin={setSelectedDin}
                onTest={handleTest}
                onSend={onSend}
                status={status}
                setStatus={onChange}
                value={value}
                setValue={onChangeComplete}
                showTestControl={showTestControl}
              />
            </div>
          )}
        </>
      ),
    },
    {
      key: '2',
      label: t('parameters'),
      children: (
        <div>
          <Table
            columns={columns}
            size="small"
            rowKey="id"
            dataSource={[...functions, ...(availableFunctions.length > 0 ? [{ id: 'add', name: 'add' }] : [])]}
            pagination={false}
          />
          <ActionButtons />
          <ProgramButton />

          <Modal title={t('addFunction')} open={isModalVisible} onCancel={() => setIsModalVisible(false)} footer={null}>
            <List
              dataSource={availableFunctions}
              renderItem={(item) => (
                <List.Item key={item.id} onClick={() => addFunction(item)} style={{ cursor: 'pointer' }}>
                  {item.name}
                </List.Item>
              )}
            />
          </Modal>
        </div>
      ),
    },
    {
      key: '3',
      label: t('events'),
      children: (
        <>
          <Table
            columns={columnsEvents}
            dataSource={eventsData}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            onChange={handleTableChange}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Button type="primary">{t('clearLog')}</Button>
          </div>
          <Modal title={t('details')} open={isModalInfoEventVisible} onCancel={handleModalClose} footer={null}>
            {selectedRow ? (
              <>
                <p>
                  <strong>Timestamp:</strong> {selectedRow.timestamp}
                </p>
                <p>
                  <strong>Typeset:</strong> {selectedRow.typeset}
                </p>
                <p>
                  <strong>Payload Size:</strong> {selectedRow.payloadSize}
                </p>
                <p style={{ marginTop: 10, fontSize: '1.1rem' }}>
                  <strong>Payload Content</strong>
                  <PayloadContentViewer payloadContent={'UHJvdmEgY29udmVyc2lvbmU='} />
                </p>
              </>
            ) : null}
          </Modal>
        </>
      ),
    },
  ];

  const handleAddDevice = () => {
    router.push(`/${locale}/admin/dispositivi/newDispositivo`);
  };

  const handleEditDispositivo = (e: React.MouseEvent, deviceId: number) => {
    e.stopPropagation();
    router.push(`/${locale}/admin/dispositivi/editDispositivo/${deviceId}`);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.container}>
        <Layout style={{ height: '100%' }}>
          <Sider
            width={250}
            theme="dark"
            style={{
              marginLeft: '-22px',
              marginTop: -2,
              maxHeight: '101%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div style={{ padding: '12px', borderBottom: '1px solid #303030' }}>
              <Button
                type="primary"
                onClick={handleAddDevice}
                style={{
                  width: '100%',
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                }}
              >
                {t('addDevice')}
              </Button>
              <br />
            </div>
            <div style={{ padding: '16px' }}>
              <Input
                placeholder={t('search')}
                onChange={(e) => setSearchTerm(e.target.value)}
                suffix={<SearchOutlined />}
                style={{ height: 25 }}
              />
            </div>
            <List
              dataSource={filteredDevices}
              renderItem={(item) => (
                <List.Item
                  style={{
                    borderBottom: '1px solid #303030',
                    padding: '8px 16px',
                    cursor: 'pointer',
                    backgroundColor: selectedDevice === item ? '#1677ff' : undefined,
                  }}
                  onClick={() => handleDeviceClick(item)}
                >
                  <div
                    style={{ width: '100%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
                  >
                    <span style={{ color: 'white' }}>{item.name}</span>
                    <EditFilled
                      style={{ color: '#8c8c8c', fontSize: 16, transition: 'color 0.3s' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#1890ff')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#8c8c8c')}
                      onClick={(e) => handleEditDispositivo(e, item.id)}
                    />
                  </div>
                </List.Item>
              )}
              style={{ height: '535px', overflowY: 'auto' }}
            />
          </Sider>
          <Layout>
            <Content style={{ padding: 0, background: '#fff', maxHeight: '100%' }}>
              {isDeviceSelected ? (
                <DataPanel title={selectedDevice?.name} showSemaphore={false} showLinkStatus showAlignmentStatus>
                  <Panel showSaveButtons={false} layoutStyle="devices">
                    <PanelView layoutStyle="devices">
                      <Tabs type="card" items={items} style={{ marginTop: -70, padding: 10 }} />
                    </PanelView>
                  </Panel>
                </DataPanel>
              ) : (
                <Empty
                  image={<DeploymentUnitOutlined style={{ fontSize: 60, color: '#1890ff' }} />}
                  imageStyle={{
                    height: 60,
                  }}
                  description={<span style={{ color: '#595959', fontSize: '16px' }}>{t('selectDevice')}</span>}
                ></Empty>
              )}
            </Content>
          </Layout>
        </Layout>
      </div>
      <div className={styles.mobileMessage}>{t('mobileMessage')}</div>
    </>
  );
}
