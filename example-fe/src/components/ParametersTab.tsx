import ConfigService from '@/services/configService';
import { Function } from '@/types';
import { BellOutlined, ExportOutlined, ImportOutlined, SettingOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Input, List, message, Modal, Select, Space, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

/*const mockFunctions = [
  { id: 1, name: 'funzione1' },
  { id: 2, name: 'funzione2' },
  { id: 3, name: 'funzione3' },
  { id: 4, name: 'funzione4' },
  { id: 5, name: 'funzione5' },
];*/

const mockParameters = [
  { id: 1, title: 'Parametro1', options: ['Opzione1', 'Opzione2', 'Opzione3'] },
  { id: 2, title: 'Parametro2', options: ['Opzione4', 'Opzione5', 'Opzione6'] },
];

const mockInputs = [
  { id: 1, title: 'Temperatura', options1: ['Option1', 'Option2'], options2: ['>', '>=', '<', '<=', '=='] },
  { id: 2, title: 'Comando ON/OFF', options1: ['Option1', 'Option2'], options2: ['true', 'false'] },
];

const ParametersTab = () => {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<Array<{ id: number; name: string }>>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: { [key: string]: any };
  }>({});
  const [checkedFunctions, setCheckedFunctions] = useState<number[]>([]);

  const fetchFunctions = async () => {
    try {
      const response = await ConfigService.getFunctionsByDeviceId(1);
      console.log(response);
      setFunctions([response]);
    } catch (error) {
      console.log('Errore');
    }
  };

  useEffect(() => {
    fetchFunctions();
  }, []);

  const handleSelectFunction = (functionId: number) => {
    setCheckedFunctions((prev) =>
      prev.includes(functionId) ? prev.filter((id) => id !== functionId) : [...prev, functionId]
    );
  };

  const handleIconClick = (functionId: number, actionType: string) => {
    setCurrentFunction(functionId);
    setCurrentAction(actionType);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleAddFunction = (functionToAdd: { id: number; name: string }) => {
    if (!selectedFunctions.some((f) => f.id === functionToAdd.id)) {
      setSelectedFunctions((prev) => [...prev, functionToAdd]);
      setIsAddModalVisible(false);
      message.success(`Funzione "${functionToAdd.name}" aggiunta con successo`);
    } else {
      message.warning('Questa funzione è già stata aggiunta');
    }
  };

  const handleDeleteFunctions = () => {
    if (checkedFunctions.length === 0) {
      message.warning('Seleziona almeno una funzione da eliminare');
      return;
    }
    setSelectedFunctions((prev) => prev.filter((f) => !checkedFunctions.includes(f.id)));
    setCheckedFunctions([]);
    message.success('Funzioni eliminate con successo');
  };

  const handleParameterChange = (parameterId: number, value: string) => {
    if (currentFunction) {
      setSelectedItems((prev) => ({
        ...prev,
        [currentFunction]: {
          ...prev[currentFunction],
          parametro: {
            ...(prev[currentFunction]?.parametro || {}),
            [parameterId]: value,
          },
        },
      }));
    }
  };

  const handleInputChange = (inputId: number, field: 'options1' | 'options2', value: string) => {
    if (currentFunction) {
      setSelectedItems((prev) => ({
        ...prev,
        [currentFunction]: {
          ...prev[currentFunction],
          ingresso: {
            ...(prev[currentFunction]?.ingresso || {}),
            [inputId]: {
              ...(prev[currentFunction]?.ingresso?.[inputId] || {}),
              [field]: value,
            },
          },
        },
      }));
    }
  };

  const handleSendProgram = () => {
    console.log(selectedItems);
  };

  const columns = [
    {
      title: '',
      dataIndex: 'select',
      render: (_, record) => (
        <Checkbox checked={checkedFunctions.includes(record.id)} onChange={() => handleSelectFunction(record.id)} />
      ),
    },
    {
      title: 'Funzione',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<SlidersOutlined />} Parametri</span>,
      key: 'parameters',
      render: (_, record) =>
        selectedItems[record.id]?.parametro ? (
          Object.keys(selectedItems[record.id].parametro)
            .map((key) => mockParameters.find((p) => p.id.toString() === key)?.title)
            .join(', ')
        ) : (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <SettingOutlined
              onClick={() => handleIconClick(record.id, 'parametro')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </span>
        ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<ImportOutlined />} Ingressi</span>,
      key: 'inputs',
      render: (_, record) =>
        selectedItems[record.id]?.ingresso ? (
          Object.keys(selectedItems[record.id].ingresso)
            .map((key) => mockInputs.find((i) => i.id.toString() === key)?.title)
            .join(', ')
        ) : (
          <span style={{ display: 'flex', justifyContent: 'center' }}>
            <SettingOutlined
              onClick={() => handleIconClick(record.id, 'ingresso')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </span>
        ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<ExportOutlined />} Uscite</span>,
      key: 'outputs',
      render: (_, record) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <SettingOutlined
            onClick={() => handleIconClick(record.id, 'uscita')}
            style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
          />
        </span>
      ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<BellOutlined />} Notifiche</span>,
      key: 'notifications',
      render: (_, record) => (
        <span style={{ display: 'flex', justifyContent: 'center' }}>
          <SettingOutlined
            onClick={() => handleIconClick(record.id, 'notifica')}
            style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
          />
        </span>
      ),
    },
  ];

  const renderModalContent = () => {
    if (currentAction === 'parametro') {
      return (
        <div>
          {mockParameters.map((param) => (
            <div key={param.id} style={{ marginBottom: '10px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label={<>{param.title}</>} labelStyle={{ fontWeight: 'bold' }}>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Seleziona"
                      onChange={(value) => handleParameterChange(param.id, value)}
                      value={selectedItems[currentFunction!]?.parametro?.[param.id] || undefined}
                    >
                      {param.options.map((option) => (
                        <Select.Option key={option} value={option}>
                          {option}
                        </Select.Option>
                      ))}
                    </Select>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </div>
          ))}
        </div>
      );
    } else if (currentAction === 'ingresso') {
      return (
        <div>
          {mockInputs.map((input) => (
            <div key={input.id} style={{ marginBottom: '10px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label={<>{input.title}</>} labelStyle={{ fontWeight: 'bold' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 5 }}>
                      <Select
                        style={{ width: '50%' }}
                        placeholder="Seleziona"
                        onChange={(value) => handleInputChange(input.id, 'options1', value)}
                        value={selectedItems[currentFunction!]?.ingresso?.[input.id]?.options1 || undefined}
                      >
                        {input.options1.map((option) => (
                          <Select.Option key={option} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                      <Select
                        style={{ width: '50%' }}
                        placeholder="Seleziona"
                        onChange={(value) => handleInputChange(input.id, 'options2', value)}
                        value={selectedItems[currentFunction!]?.ingresso?.[input.id]?.options2 || undefined}
                      >
                        {input.options2.map((option) => (
                          <Select.Option key={option} value={option}>
                            {option}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  </Descriptions.Item>
                </Descriptions>
              </Space>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <Table columns={columns} dataSource={selectedFunctions} rowKey="id" pagination={false} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button onClick={() => setIsAddModalVisible(true)} style={{ marginRight: 8 }} type="primary">
            Aggiungi
          </Button>
          <Button onClick={handleDeleteFunctions} type="primary">
            Elimina
          </Button>
        </div>
        <div>
          <Button style={{ marginRight: 8 }} type="primary">
            Recall
          </Button>
          <Button type="primary">Programma</Button>
        </div>
      </div>
      <Modal
        title={`Seleziona ${currentAction}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleModalOk}
        width={600}
      >
        {renderModalContent()}
      </Modal>
      <Modal
        title="Aggiungi Funzione"
        open={isAddModalVisible}
        onCancel={() => setIsAddModalVisible(false)}
        footer={null}
        width={400}
      >
        <List
          dataSource={functions}
          renderItem={(item) => (
            <List.Item key={item.id} onClick={() => handleAddFunction(item)} style={{ cursor: 'pointer' }}>
              {item.name}
            </List.Item>
          )}
        />
      </Modal>
    </div>
  );
};

export default ParametersTab;
