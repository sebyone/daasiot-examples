/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ParametersTab.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import ConfigService from '@/services/configService';
import { DataDevice, DeviceFunction, Function, FunctionParameter } from '@/types';
import {
  BellOutlined,
  ControlOutlined,
  ExportOutlined,
  ImportOutlined,
  SettingOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Input, List, message, Modal, Select, Space, Table } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useState } from 'react';

//const mockInputs: InputType[] = [];

type SelectedItems = {
  [key: number]: {
    parametro?: { [key: number]: string };
    ingresso?: { [key: number]: { options1?: string; options2?: string } };
  };
};

export default function ParametersTab({ device }: { device: DataDevice | null }) {
  const t = useTranslations('ParametersTab');
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
  const [tempOutputs, setTempOutputs] = useState<{ [key: number]: any }>({});

  const fetchFunctions = useCallback(async () => {
    if (!device?.id) return;
    try {
      const response = await ConfigService.getFunctions(device.device_model_id);
      setFunctions(response);
    } catch (error) {
      console.error('Error fetching functions:', error);
    }
  }, [device?.id, device?.device_model_id]);

  useEffect(() => {
    fetchFunctions();
  }, [fetchFunctions]);

  const fetchProgram = useCallback(async () => {
    if (!device?.id) return;
    try {
      const response = await ConfigService.getProgram(device.id);
      setSelectedFunctions(response);
      setCheckedFunctions(response.filter((func) => func.enabled).map((func) => func.id));
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

  const handleAddFunction = useCallback(
    async (functionToAdd: Function) => {
      if (!device?.id) return;
      try {
        const response = await ConfigService.addFunction(device.id, functionToAdd.id);

        setSelectedFunctions((prevFunctions) => [...prevFunctions, response]);
        setIsAddModalVisible(false);
        message.success('Funzione aggiunta con successo');
      } catch (error) {
        message.error('Errore');
      }
      fetchProgram();
    },

    [device?.id, fetchProgram]
  );

  const handleDeleteFunctions = useCallback(async () => {
    if (!device?.id) {
      return;
    }

    if (checkedFunctions.length === 0) {
      message.warning('Seleziona una funzione da eliminare');
      return;
    }

    try {
      for (const functionId of checkedFunctions) {
        await ConfigService.deleteFunction(device.id, functionId);
      }

      setSelectedFunctions((prev) => prev.filter((f) => !checkedFunctions.includes(f.id)));
      setCheckedFunctions([]);
      message.success('Funzione eliminata con successo');
    } catch (error) {
      message.error("Si è verificato un errore durante l'eliminazione della funzione");
    }
  }, [device?.id, checkedFunctions]);

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
                      parameters: func.parameters.some((p) => p.property_id === Number(paramId))
                        ? func.parameters.map((param) =>
                            param.property_id === Number(paramId) ? { ...param, value } : param
                          )
                        : [
                            ...func.parameters,
                            {
                              id: Date.now(),
                              property_id: Number(paramId),
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
        } else if (currentAction === 'uscita') {
          for (const [outputId, outputData] of Object.entries(tempOutputs)) {
            const updateData = {
              param_id: Number(outputId),
              function_id: currentFunction.function.id,
              value: outputData.options1,
            };

            setSelectedFunctions((prev) =>
              prev.map((func) =>
                func.id === currentFunction.id
                  ? {
                      ...func,
                      outputs: func.outputs.some((i) => i.param_id === Number(outputId))
                        ? func.outputs.map((output) =>
                            output.param_id === Number(outputId) ? { ...output, value: outputData.options1 } : output
                          )
                        : [
                            ...func.outputs,
                            {
                              id: Date.now(),
                              param_id: Number(outputId),
                              device_function_id: func.id,
                              value: outputData.options1,
                              parameter_template: currentFunction.function.outputs.find(
                                (o) => o.id === Number(outputId)
                              )!,
                            },
                          ],
                    }
                  : func
              )
            );
          }
          setTempOutputs({});
        }

        setIsModalVisible(false);

        //message.success(`${currentAction === 'parametro' ? 'Parametri' : 'Ingressi'} aggiornati correttamente`);
      } catch (error) {
        console.error(`Error updating ${currentAction === 'parametro' ? 'parameters' : 'inputs'}:`, error);
        //message.error(`Errore nell'aggiornamento dei ${currentAction === 'parametro' ? 'parametri' : 'ingressi'}`);
      }
    }
  }, [currentFunction, device?.id, tempParameters, tempInputs, tempOutputs, currentAction]);

  const columns = [
    {
      title: '',
      dataIndex: 'select',
      render: (_: any, record: DeviceFunction) => (
        <Checkbox checked={checkedFunctions.includes(record.id)} onChange={() => handleSelectFunction(record.id)} />
      ),
    },
    {
      title: (
        <Space>
          <ControlOutlined style={{ fontSize: '1.2rem' }} /> {t('function')}
        </Space>
      ),
      dataIndex: ['function', 'name'],
      key: 'name',
    },
    {
      title: (
        <Space>
          <SlidersOutlined style={{ fontSize: '1.2rem' }} /> {t('parameters')}
        </Space>
      ),
      key: 'parameters',
      render: (_: any, record: DeviceFunction) =>
        record.function.parameters.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.parameters
              .map((param) => {
                const deviceParam = record.parameters.find((p) => p.property_id === param.id);
                if (param.name === 'delay' && (!deviceParam || !deviceParam.value)) {
                  return null;
                }
                return `${param.name}: ${deviceParam ? deviceParam.value : ''}`;
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
          <ImportOutlined style={{ fontSize: '1.2rem' }} /> {t('inputs')}
        </Space>
      ),
      key: 'inputs',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.inputs.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.inputs
              .map((input) => {
                const deviceInput = record.inputs.find((i) => i.param_id === input.id);
                return `${input.name}`;
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
          <ExportOutlined style={{ fontSize: '1.2rem' }} /> {t('outputs')}
        </Space>
      ),
      key: 'outputs',
      render: (_: any, record: DeviceFunction) =>
        record?.function?.outputs.length > 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {record.function.outputs.map((output) => output.name).join(', ')}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'uscita')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
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
          <BellOutlined style={{ fontSize: '1.2rem' }} /> {t('notifications')}
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
      const columns = [
        {
          title: t('name'),
          dataIndex: 'name',
          key: 'name',
          render: (text: string) => text,
        },
        {
          title: t('type'),
          dataIndex: 'type',
          key: 'type',
          render: (text: string, record: any) => {
            const options = ['GPIO', 'DIN'];
            return (
              <Select
                value={tempInputs[record.id]?.options1 ?? text}
                onChange={(value) => handleInputChange(record.id, 'options1', value)}
                style={{ width: '100%' }}
              >
                {options.map((option) => (
                  <Select.Option key={option} value={option}>
                    {option}
                  </Select.Option>
                ))}
              </Select>
            );
          },
        },
        {
          title: t('value'),
          dataIndex: 'value',
          key: 'value',
          render: (text: string, record: any) => (
            <Input
              value={tempInputs[record.id]?.options2 ?? ''}
              onChange={(e) => handleInputChange(record.id, 'options2', e.target.value)}
              placeholder={t('insertValue')}
            />
          ),
        },
      ];

      const data = currentFunction.function.inputs.map((input) => {
        const deviceInput = currentFunction.inputs.find((i) => i.param_id === input.id);
        return {
          key: input.id,
          id: input.id,
          name: input.name,
          type: deviceInput ? deviceInput.value : 'GPIO',
          value: deviceInput?.value,
        };
      });

      return <Table columns={columns} dataSource={data} pagination={false} />;
    } else if (currentAction === 'parametro' && currentFunction) {
      return (
        <Space direction="vertical" style={{ width: '100%' }}>
          {currentFunction.function.parameters.map((param: FunctionParameter) => {
            const deviceParam = currentFunction.parameters.find((p) => p.property_id === param.id);
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
      const columns = [
        {
          title: t('name'),
          dataIndex: 'name',
          key: 'name',
          render: (text: string) => text,
        },
        {
          title: t('type'),
          dataIndex: 'type',
          key: 'type',
          render: (text: string, record: any) => {
            return <Select style={{ width: '100%' }}></Select>;
          },
        },
        {
          title: t('value'),
          dataIndex: 'value',
          key: 'value',
          render: (text: string, record: any) => <Input placeholder={t('insertValue')} />,
        },
      ];

      const data = currentFunction.function.outputs.map((output) => {
        const deviceOutput = currentFunction.outputs.find((o) => o.param_id === output.id);
        return {
          key: output.id,
          id: output.id,
          name: output.name,
          type: deviceOutput ? deviceOutput.value : 'GPIO',
          value: deviceOutput?.value,
        };
      });

      return <Table columns={columns} pagination={false} />;
    } else if (currentAction === 'notifica' && currentFunction) {
      const columns = [
        {
          title: t('name'),
          dataIndex: 'name',
          key: 'name',
          render: (text: string) => text,
        },
        {
          title: t('type'),
          dataIndex: 'type',
          key: 'type',
          render: (text: string, record: any) => {
            return <Select style={{ width: '100%' }}></Select>;
          },
        },
        {
          title: t('value'),
          dataIndex: 'value',
          key: 'value',
          render: (text: string, record: any) => <Input placeholder={t('insertValue')} />,
        },
      ];

      return <Table columns={columns} pagination={false} />;
    }
    return null;
  };

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Table columns={columns} dataSource={selectedFunctions} rowKey="id" pagination={false} />
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Button onClick={handleDeleteFunctions} type="primary">
            {t('delete')}
          </Button>
          <Button onClick={() => setIsAddModalVisible(true)} type="primary">
            {t('add')}
          </Button>
        </Space>
        <Space>
          <Button type="primary">Recall</Button>
          <Button type="primary">{t('schedule')}</Button>
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
        title={t('addFunction')}
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
