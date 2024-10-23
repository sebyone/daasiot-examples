import ConfigService from '@/services/configService';
import { DataDevice, DeviceFunction, DeviceFunctionParameter, Function, FunctionParameter } from '@/types';
import { BellOutlined, ExportOutlined, ImportOutlined, SettingOutlined, SlidersOutlined } from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Input, List, message, Modal, Select, Space, Table } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

//const mockInputs: InputType[] = [];

type SelectedItems = {
  [key: number]: {
    parametro?: { [key: number]: string };
    ingresso?: { [key: number]: { options1?: string; options2?: string } };
  };
};

export default function ParametersTab({ device }: { device: DataDevice | null }) {
  const [functions, setFunctions] = useState<Function[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<DeviceFunction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<DeviceFunction | null>(null);
  const [selectedItems, setSelectedItems] = useState<SelectedItems>({});
  const [checkedFunctions, setCheckedFunctions] = useState<number[]>([]);
  const [tempParameters, setTempParameters] = useState<{ [key: number]: any }>({});
  const [tempInputs, setTempInputs] = useState<{ [key: number]: any }>({});

  const fetchFunctions = useCallback(async () => {
    if (!device?.id) return;
    try {
      const response = await ConfigService.getFunctions(device.id);
      setFunctions(response);
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
      setSelectedFunctions(Array.isArray(response) ? response : [response]);
    } catch (error) {
      console.error('Error fetching program:', error);
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

      const newDeviceFunctions: DeviceFunction[] = Array.isArray(response)
        ? response.map((func) => ({ id: func.id, function: func, parameters: [], inputs: [] }))
        : [{ id: response.id, function: response, parameters: [], inputs: [] }];

      setSelectedFunctions((prev) => {
        const newFunctions = [...prev, ...newDeviceFunctions];
        return newFunctions;
      });
      setIsAddModalVisible(false);
      message.success('Funzione aggiunta con successo');
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

  const handleParameterChange = useCallback((paramId: number, value: any) => {
    setTempParameters((prev) => ({ ...prev, [paramId]: value }));
  }, []);

  const handleInputChange = useCallback((inputId: number, field: 'options1' | 'options2', value: string) => {
    setTempInputs((prev) => ({
      ...prev,
      [inputId]: {
        ...prev[inputId],
        [field]: value,
      },
    }));
  }, []);

  const handleModalOk = useCallback(async () => {
    if (currentFunction && device?.id) {
      try {
        if (currentAction === 'parametro') {
          for (const [paramId, value] of Object.entries(tempParameters)) {
            const updateData = {
              param_id: Number(paramId),
              function_id: currentFunction.function.id,
              value: value,
            };

            setSelectedFunctions((prev) =>
              prev.map((func) =>
                func.id === currentFunction.id
                  ? {
                      ...func,
                      parameters: func.parameters.some((p) => p.param_id === Number(paramId))
                        ? func.parameters.map((param) =>
                            param.param_id === Number(paramId) ? { ...param, value } : param
                          )
                        : [
                            ...func.parameters,
                            {
                              id: Date.now(),
                              param_id: Number(paramId),
                              device_function_id: func.id,
                              value,
                              parameter_template: currentFunction.function.parameters.find(
                                (p) => p.id === Number(paramId)
                              )!,
                            },
                          ],
                    }
                  : func
              )
            );
          }
          setTempParameters({});
        } else if (currentAction === 'ingresso') {
          for (const [inputId, inputData] of Object.entries(tempInputs)) {
            const updateData = {
              param_id: Number(inputId),
              function_id: currentFunction.function.id,
              value: inputData.options1,
            };

            setSelectedFunctions((prev) =>
              prev.map((func) =>
                func.id === currentFunction.id
                  ? {
                      ...func,
                      inputs: func.inputs.some((i) => i.param_id === Number(inputId))
                        ? func.inputs.map((input) =>
                            input.param_id === Number(inputId) ? { ...input, value: inputData.options1 } : input
                          )
                        : [
                            ...func.inputs,
                            {
                              id: Date.now(),
                              param_id: Number(inputId),
                              device_function_id: func.id,
                              value: inputData.options1,
                              parameter_template: currentFunction.function.inputs.find(
                                (i) => i.id === Number(inputId)
                              )!,
                            },
                          ],
                    }
                  : func
              )
            );
          }
          setTempInputs({});
        }

        setIsModalVisible(false);

        //message.success(`${currentAction === 'parametro' ? 'Parametri' : 'Ingressi'} aggiornati correttamente`);
      } catch (error) {
        console.error(`Error updating ${currentAction === 'parametro' ? 'parameters' : 'inputs'}:`, error);
        //message.error(`Errore nell'aggiornamento dei ${currentAction === 'parametro' ? 'parametri' : 'ingressi'}`);
      }
    }
  }, [currentFunction, device?.id, tempParameters, tempInputs, currentAction]);

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
        record.function.parameters.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.parameters
              .map((param) => {
                const deviceParam = record.parameters.find((p) => p.param_id === param.id);
                if (param.name === 'delay' && (!deviceParam || !deviceParam.value)) {
                  return null;
                }
                return `${param.name}: ${deviceParam ? deviceParam.value : 'Not set'}`;
              })
              .filter(Boolean)
              .join(', ')}
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
            {record.function.inputs
              .map((input) => {
                const deviceInput = record.inputs.find((i) => i.param_id === input.id);
                return `${input.name}: ${deviceInput ? deviceInput.value : 'Not set'}`;
              })
              .join(', ')}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'ingresso')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <Button
            icon={<SettingOutlined style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }} />}
            onClick={() => handleIconClick(record, 'ingresso')}
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
            onClick={() => handleIconClick(record, 'uscita')}
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
            onClick={() => handleIconClick(record, 'notifica')}
            style={{ border: 'none', outline: 'none', backgroundColor: 'transparent' }}
          />
        ),
    },
  ];

  const renderModalContent = () => {
    if (currentAction === 'ingresso' && currentFunction) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentFunction.function.inputs.map((input) => {
            const deviceInput = currentFunction.inputs.find((i) => i.param_id === input.id);
            return (
              <Descriptions key={input.id} column={1} bordered>
                <Descriptions.Item label={'Nome'} labelStyle={{ fontWeight: 'bold' }}>
                  <Input />
                </Descriptions.Item>
                <Descriptions.Item label={'Tipo'} labelStyle={{ fontWeight: 'bold' }}>
                  <Input />
                </Descriptions.Item>
                <Descriptions.Item label={'Valore'} labelStyle={{ fontWeight: 'bold' }}>
                  <Input />
                </Descriptions.Item>
                {/*<Descriptions.Item label={input.name} labelStyle={{ fontWeight: 'bold' }}>
                  <Space style={{ width: '100%' }}>
                    <Input
                      value={tempInputs[input.id]?.options1 ?? (deviceInput ? deviceInput.value : '')}
                      onChange={(e) => handleInputChange(input.id, 'options1', e.target.value)}
                      placeholder={`Inserisci ${input.name} (1)`}
                    />
                    <Input
                      value={tempInputs[input.id]?.options2 ?? ''}
                      onChange={(e) => handleInputChange(input.id, 'options2', e.target.value)}
                      placeholder={`Inserisci ${input.name} (2)`}
                    />
                  </Space>
                </Descriptions.Item>*/}
              </Descriptions>
            );
          })}
        </Space>
      );
    } else if (currentAction === 'parametro' && currentFunction) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentFunction.function.parameters.map((param: FunctionParameter) => {
            const deviceParam = currentFunction.parameters.find((p) => p.param_id === param.id);
            return (
              <Descriptions key={param.id} column={1} bordered>
                <Descriptions.Item label={param.name} labelStyle={{ fontWeight: 'bold' }}>
                  {param.name === 'mode' ? (
                    <Select
                      value={tempParameters[param.id] ?? (deviceParam ? deviceParam.value : undefined)}
                      onChange={(value) => handleParameterChange(param.id, value)}
                      placeholder={`Select ${param.name}`}
                      style={{ width: '100%' }}
                    >
                      <Select.Option value={1}>Mode 1</Select.Option>
                      <Select.Option value={2}>Mode 2</Select.Option>
                      <Select.Option value={3}>Mode 3</Select.Option>
                    </Select>
                  ) : (
                    <Input
                      value={tempParameters[param.id] ?? (deviceParam ? deviceParam.value : '')}
                      onChange={(e) => handleParameterChange(param.id, e.target.value)}
                      placeholder={`Enter ${param.name}`}
                    />
                  )}
                </Descriptions.Item>
              </Descriptions>
            );
          })}
        </Space>
      );
    } else if (currentAction === 'uscita' && currentFunction) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Descriptions key={6} column={1} bordered>
            <Descriptions.Item label={'Nome'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
            <Descriptions.Item label={'Tipo'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
            <Descriptions.Item label={'Valore'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
          </Descriptions>
        </Space>
      );
    } else if (currentAction === 'notifica' && currentFunction) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          <Descriptions key={6} column={1} bordered>
            <Descriptions.Item label={'Nome'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
            <Descriptions.Item label={'Tipo'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
            <Descriptions.Item label={'Valore'} labelStyle={{ fontWeight: 'bold' }}>
              <Input />
            </Descriptions.Item>
          </Descriptions>
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
          <Button onClick={handleDeleteFunctions} type="primary">
            Elimina
          </Button>
          <Button onClick={() => setIsAddModalVisible(true)} type="primary">
            Aggiungi
          </Button>
        </Space>
        <Space>
          <Button type="primary">Recall</Button>
          <Button type="primary">Programma</Button>
        </Space>
      </Space>
      <Modal
        title={`Modifica ${currentAction}`}
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
    </Space>
  );
}
