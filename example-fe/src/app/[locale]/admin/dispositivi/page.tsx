'use client';
import CardDispositivoFactory from '@/components/CardDispositivoFactory';
import DataPanel from '@/components/DataPanel';
import NodoForm from '@/components/NodoForm';
import Panel from '@/components/Panel';
import PanelView from '@/components/PanelView';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { default as ConfigService, default as configService } from '@/services/configService';
import { Device } from '@/types';
import { DeploymentUnitOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Empty, Form, Input, Layout, List, Modal, Table, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import styles from './Dispositivi.module.css';

const { Sider, Content } = Layout;

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

const data = [
  {
    id: 1,
    name: 'Evento1',
  },
  {
    id: 2,
    name: 'Evento2',
  },
];

export default function Dispositivi() {
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
          latitudine: device.latitudine,
          longitudine: device.longitudine,
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
      formDaasIoT.setFieldsValue({
        id: selectedDevice.id,
        denominazione: selectedDevice.name,
        latitudine: selectedDevice.latitudine,
        longitudine: selectedDevice.longitudine,
      });
    }
  }, [selectedDevice, formDaasIoT]);

  const handleTest = () => {
    setShowTestComponent((prevState) => !prevState);
  };

  const hideTestComponent = () => {
    setShowTestComponent(false);
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

  const onSend = () => {
    configService
      .sendPayload(selectedDin, status, value)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error('Errore:', error);
      });
    /*setTest(false);
    setValue(0);
    setStatus(false);
    setSelectedDin(null);*/
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: t('general'),
      children: (
        <>
          <NodoForm form={formDaasIoT} onHideTestComponent={hideTestComponent} />
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              padding: '20px',
            }}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '500px',
                backgroundColor: '#f0f2f5',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
            >
              <List
                dataSource={data}
                renderItem={(item) => (
                  <List.Item style={{ borderBottom: '1px solid #7b97c1', padding: '12px 16px' }}>
                    <span>{item.name}</span>
                  </List.Item>
                )}
                style={{
                  height: '300px',
                  overflowY: 'auto',
                }}
              />
            </div>
            <Button type="primary" style={{ marginTop: '20px' }}>
              Clear Log
            </Button>
          </div>
        </>
      ),
    },
  ];

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
            <div style={{ borderBottom: '2px solid #fff' }}>
              <br />
              <br />
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
                  style={{ borderBottom: '1px solid #303030', padding: '8px 16px', cursor: 'pointer' }}
                  onClick={() => handleDeviceClick(item)}
                >
                  <span style={{ color: 'white' }}>{item.name}</span>
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
