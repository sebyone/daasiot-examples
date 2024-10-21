import ConfigService from '@/services/configService';
import { DataDevice, DeviceFunction, Function, Input as InputType, Parameter } from '@/types';
import { BellOutlined, ExportOutlined, ImportOutlined, SettingOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, List, message, Modal, Select, Space, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

const mockInputs: InputType[] = [
  { id: 1, title: 'Temperatura', options1: ['Option1', 'Option2'], options2: ['>', '>=', '<', '<=', '=='] },
  { id: 2, title: 'Comando ON/OFF', options1: ['Option1', 'Option2'], options2: ['true', 'false'] },
];

type SelectedItems = {
  [key: number]: {
    parametro?: { [key: number]: string };
    ingresso?: { [key: number]: { options1?: string; options2?: string } };
  };
};

export default function Component({ device }: { device: DataDevice | null }) {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<DeviceFunction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<DeviceFunction | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [checkedFunctions, setCheckedFunctions] = useState<number[]>([]);

  const fetchFunctions = useCallback(async () => {
    if (!device?.id) return;
    try {
      const response = await ConfigService.getFunctions(device.id);
      setFunctions([response]);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  }, [device?.id]);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  const fetchProgram = useCallback(async () => {
    if (!device?.id) return;

    try {
      const response = await ConfigService.getProgram(device.id);
      setSelectedFunctions([response]);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  }, [device?.id]);

  useEffect(() => {
    fetchProgram();
  }, [fetchProgram]);

  const handleSelectFunction = useCallback((functionId: number) => {
    setCheckedFunctions((prev) =>
      prev.includes(functionId) ? prev.filter((id) => id !== functionId) : [...prev, functionId]
    );
  }, []);

  const handleIconClick = useCallback((func: DeviceFunction, actionType: string) => {
    setCurrentFunction(func);
    setCurrentAction(actionType);
    setIsModalVisible(true);
  }, []);

  const handleAddFunction = useCallback(async (functionToAdd: Function) => {
    try {
      const response = await ConfigService.getFunctions(functionToAdd.id);

      const newDeviceFunction: DeviceFunction = {
        id: response.id,
        function: response,
      };

      setSelectedFunctions((prev) => {
        const newFunctions = [...prev, newDeviceFunction];
        return newFunctions;
      });
      setIsAddModalVisible(false);
      message.success(`Funzione "${response.name}" aggiunta con successo`);
    } catch (error) {
      message.error("Errore nell'aggiunta della funzione");
    }
  }, []);

  const handleDeleteFunctions = useCallback(() => {
    if (checkedFunctions.length === 0) {
      message.warning('Seleziona almeno una funzione da eliminare');
      return;
    }
    setSelectedFunctions((prev) => prev.filter((f) => !checkedFunctions.includes(f.id)));
    setCheckedFunctions([]);
    message.success('Funzioni eliminate con successo');
  }, [checkedFunctions]);

  const handleParameterChange = useCallback(
    (value: string) => {
      if (currentFunction) {
        setSelectedFunctions((prev) =>
          prev.map((func) =>
            func.id === currentFunction.id
              ? {
                  ...func,
                  function: {
                    ...func.function,
                    parameters: func.function.parameters.map((param, index) =>
                      index === 0 ? { ...param, value } : param
                    ),
                  },
                }
              : func
          )
        );
        setCurrentFunction((prev) =>
          prev
            ? {
                ...prev,
                function: {
                  ...prev.function,
                  parameters: prev.function.parameters.map((param, index) =>
                    index === 0 ? { ...param, value } : param
                  ),
                },
              }
            : null
        );
      }
    },
    [currentFunction]
  );

  const handleInputChange = useCallback(
    (inputId: number, field: 'options1' | 'options2', value: string) => {
      if (currentFunction) {
        setSelectedItems((prev) => ({
          ...prev,
          [currentFunction.id]: {
            ...prev[currentFunction.id],
            ingresso: {
              ...(prev[currentFunction.id]?.ingresso || {}),
              [inputId]: {
                ...(prev[currentFunction.id]?.ingresso?.[inputId] || {}),
                [field]: value,
              },
            },
          },
        }));
      }
    },
    [currentFunction]
  );

  const columns = [
    {
      title: '',
      dataIndex: 'select',
      render: (_: any, record: DeviceFunction) => (
        <Checkbox checked={checkedFunctions.includes(record.id)} onChange={() => handleSelectFunction(record.id)} />
      ),
    },
    { title: 'Funzione', dataIndex: ['function', 'name'], key: 'name' },
    {
      title: (
        <Space>
          <SlidersOutlined /> Parametri
        </Space>
      ),
      key: 'parameters',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.parameters.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.parameters[0].value || record.function.parameters[0].name}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'parametro')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <SettingOutlined disabled style={{ fontSize: '1rem', color: '#1890ff', cursor: 'not-allowed' }} />
        ),
    },
    {
      title: (
        <Space>
          <ImportOutlined /> Ingressi
        </Space>
      ),
      key: 'inputs',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.inputs.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.inputs.map((input) => input.name).join(', ')}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'ingresso')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <Button
            icon={<SettingOutlined style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }} />}
            disabled
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}
          />
        ),
    },
    {
      title: (
        <Space>
          <ExportOutlined /> Uscite
        </Space>
      ),
      key: 'outputs',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.outputs.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.outputs.map((output) => output.name).join(', ')}
          </div>
        ) : (
          <Button
            icon={<SettingOutlined style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }} />}
            disabled
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}
          />
        ),
    },
    {
      title: (
        <Space>
          <BellOutlined /> Notifiche
        </Space>
      ),
      key: 'notifications',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.notifications.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.notifications.map((notification) => notification.name).join(', ')}
          </div>
        ) : (
          <Button
            icon={<SettingOutlined style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }} />}
            disabled
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}
          />
        ),
    },
  ];

  const renderModalContent = () => {
    if (currentAction === 'parametro') {
      const selectedParam = currentFunction?.function.parameters[0];
      return (
        <Select
          style={{ width: '100%' }}
          placeholder="Seleziona un parametro"
          onChange={handleParameterChange}
          value={selectedParam?.value}
        >
          {currentFunction?.function.parameters.map((param) => (
            <Select.Option key={param.id} value={param.name}>
              {param.name}
            </Select.Option>
          ))}
        </Select>
      );
    } else if (currentAction === 'ingresso') {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {mockInputs.map((input) => (
            <Descriptions key={input.id} column={1} bordered>
              <Descriptions.Item label={input.title} labelStyle={{ fontWeight: 'bold' }}>
                <Space style={{ width: '100%' }}>
                  <Select
                    style={{ width: '50%' }}
                    placeholder="Seleziona"
                    onChange={(value) => handleInputChange(input.id, 'options1', value)}
                    value={selectedItems[currentFunction?.id]?.ingresso?.[input.id]?.options1}
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
                    value={selectedItems[currentFunction?.id]?.ingresso?.[input.id]?.options2}
                  >
                    {input.options2.map((option) => (
                      <Select.Option key={option} value={option}>
                        {option}
                      </Select.Option>
                    ))}
                  </Select>
                </Space>
              </Descriptions.Item>
            </Descriptions>
          ))}
        </Space>
      );
    }
    return null;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Table columns={columns} dataSource={selectedFunctions} rowKey="id" pagination={false} />
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Button onClick={() => setIsAddModalVisible(true)} type="primary">
            Aggiungi
          </Button>
          <Button onClick={handleDeleteFunctions} type="primary">
            Elimina
          </Button>
        </Space>
        <Space>
          <Button type="primary">Recall</Button>
          <Button type="primary">Programma</Button>
        </Space>
      </Space>
      <Modal
        title={`Seleziona ${currentAction}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => setIsModalVisible(false)}
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
    </Space>
  );
}
