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
  BulbOutlined,
  CloudDownloadOutlined,
  CloudUploadOutlined,
  ControlOutlined,
  DeleteOutlined,
  ExportOutlined,
  ImportOutlined,
  SettingOutlined,
  SlidersOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Descriptions, Input, List, message, Modal, Select, Space, Table } from 'antd';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import React, { useCallback, useEffect, useState } from 'react';
const CardDispositivoFactory = dynamic(() => import('@/components/CardDispositivoFactory'), { ssr: false });

export default function ParametersTab({ device }: { device: DataDevice | null }) {
  const t = useTranslations('ParametersTab');
  const [functions, setFunctions] = useState<Function[]>([]);
  const [selectedFunctions, setSelectedFunctions] = useState<DeviceFunction[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<DeviceFunction | null>(null);
  const [checkedFunctions, setCheckedFunctions] = useState<number[]>([]);
  const [tempParameters, setTempParameters] = useState<{ [key: number]: any }>({});
  const [tempInputs, setTempInputs] = useState<{ [key: number]: any }>({});
  const [tempOutputs, setTempOutputs] = useState<{ [key: number]: any }>({});
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState<boolean>(false);
  const [showTestComponent, setShowTestComponent] = useState(false);
  const [status, setStatus] = useState<boolean>(false);
  const [value, setValue] = useState<number>(0);
  const [ws, setSocket] = useState<WebSocket | null>(null);
  const [selectedDin, setSelectedDin] = useState<number | null>(null);
  const [showTestControl, setShowTestControl] = useState<boolean>(false);
  const [dinOptions, setDinOptions] = useState<number[]>([]);

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

  const onSend = async () => {
    if (device) {
      try {
        const dev = await ConfigService.getDeviceById(device.id);
        const response = await ConfigService.sendPayload(Number(dev.din.din), status, value);
        console.log(response);
      } catch (error) {
        console.error('Errore:', error);
      }
    }
  };

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

  const handleDeleteFunctions = useCallback(() => {
    if (!device?.id) {
      return;
    }

    if (checkedFunctions.length === 0) {
      message.warning('Seleziona una funzione da eliminare');
      return;
    }

    setIsDeleteConfirmVisible(true);
  }, [device?.id, checkedFunctions]);

  const confirmDelete = useCallback(async () => {
    setIsDeleteConfirmVisible(false);

    if (!device?.id) {
      return;
    }

    if (checkedFunctions.length === 0) {
      message.warning('Seleziona una funzione da eliminare');
      return;
    }

    const loadingMessage = message.loading('Eliminazione in corso...', 0);

    const results: { success: boolean; functionId: number; error?: any }[] = [];

    try {
      for (const functionId of checkedFunctions) {
        try {
          if (results.length > 0) {
            await new Promise((resolve) => setTimeout(resolve, 500));
          }

          await ConfigService.deleteFunction(device.id, functionId);
          results.push({ success: true, functionId });
        } catch (error: any) {
          if (error?.error_name === 'SequelizeTimeoutError' && error?.message?.includes('database is locked')) {
            try {
              await new Promise((resolve) => setTimeout(resolve, 1500));
              await ConfigService.deleteFunction(device.id, functionId);
              results.push({ success: true, functionId });
            } catch (retryError) {
              results.push({ success: false, functionId, error: retryError });
            }
          } else {
            results.push({ success: false, functionId, error });
          }
        }
      }

      loadingMessage();

      const successfulDeletes = results.filter((result) => result.success).map((result) => result.functionId);
      const failedDeletes = results.filter((result) => !result.success).map((result) => result.functionId);

      if (successfulDeletes.length > 0) {
        setSelectedFunctions((prev) => prev.filter((f) => !successfulDeletes.includes(f.id)));
        setCheckedFunctions((prev) => prev.filter((id) => !successfulDeletes.includes(id)));
      }

      if (successfulDeletes.length > 0) {
        message.success(
          successfulDeletes.length === 1
            ? 'Funzione eliminata con successo'
            : `${successfulDeletes.length} funzioni eliminate con successo`
        );
      }

      if (failedDeletes.length > 0) {
        message.error(
          failedDeletes.length === 1
            ? "Errore nell'eliminazione della funzione"
            : `Errore nell'eliminazione di ${failedDeletes.length} funzioni`
        );
      }
    } catch (error) {
      message.error("Si è verificato un errore durante l'eliminazione delle funzioni");
    } finally {
      loadingMessage();
    }
  }, [device?.id, checkedFunctions]);

  const handleParameterChange = useCallback((paramId: number, value: any) => {
    setTempParameters((prev) => ({ ...prev, [paramId]: value }));
  }, []);

  const handleInputChange = useCallback((inputId: number, field: 'options1' | 'options2', value: string) => {
    if (field === 'options2') {
      setTempInputs((prev) => ({
        ...prev,
        [inputId]: value,
      }));
    }
  }, []);

  const handleOutputChange = useCallback((outputId: number, field: 'options1' | 'options2', value: string) => {
    if (field === 'options2') {
      setTempOutputs((prev) => ({
        ...prev,
        [outputId]: value,
      }));
    }
  }, []);

  const handleModalOk = useCallback(async () => {
    if (currentFunction && device?.id) {
      try {
        let updatedFunction: DeviceFunction = { ...currentFunction };

        if (currentAction === 'parametro') {
          updatedFunction.parameters = updatedFunction.parameters.map((param) => ({
            ...param,
            value: tempParameters[param.property_id] || param.value,
          }));
        } else if (currentAction === 'ingresso') {
          updatedFunction.inputs = updatedFunction.inputs.map((input) => ({
            ...input,
            value: tempInputs[input.property_id] || input.value,
          }));
        } else if (currentAction === 'uscita') {
          updatedFunction.outputs = updatedFunction.outputs.map((output) => ({
            ...output,
            value: tempOutputs[output.property_id] || output.value,
          }));
        }

        await ConfigService.updateFunction(device.id, currentFunction.id, updatedFunction);

        setSelectedFunctions((prev) => prev.map((func) => (func.id === currentFunction.id ? updatedFunction : func)));

        setIsModalVisible(false);
        setTempParameters({});
        setTempInputs({});
        setTempOutputs({});

        message.success(`${currentAction} aggiornato correttamente`);
      } catch (error) {
        console.error(`Error updating ${currentAction}:`, error);
        message.error(`Errore nell'aggiornamento di ${currentAction}`);
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
                const deviceInput = record.inputs.find((i) => i.property_id === input.id);
                return `${input.name}: ${deviceInput ? deviceInput.value : ''}`;
              })
              .join(', ')}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'ingresso')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <SettingOutlined
            style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleIconClick(record, 'ingresso')}
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
            {record.function.outputs
              .map((output) => {
                const deviceOutput = record.outputs.find((o) => o.property_id === output.id);
                return `${output.name}: ${deviceOutput ? deviceOutput.value : ''}`;
              })
              .join(', ')}
            <SettingOutlined
              onClick={() => handleIconClick(record, 'uscita')}
              style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            />
          </div>
        ) : (
          <SettingOutlined
            style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleIconClick(record, 'uscita')}
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
          <SettingOutlined
            style={{ fontSize: '1rem', color: '#1890ff', cursor: 'pointer' }}
            onClick={() => handleIconClick(record, 'notifica')}
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
              <Select value={text} style={{ width: '100%' }}>
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
          render: (text: string, record: any) => {
            const deviceInput = currentFunction.inputs.find((i) => i.property_id === record.id);
            return (
              <Input
                value={tempInputs[record.id] ?? (deviceInput ? deviceInput.value : '')}
                onChange={(e) => handleInputChange(record.id, 'options2', e.target.value)}
                placeholder={t('insertValue')}
              />
            );
          },
        },
      ];

      const data = currentFunction.function.inputs.map((input) => {
        const deviceInput = currentFunction.inputs.find((i) => i.property_id === input.id);
        return {
          key: input.id,
          id: input.id,
          name: input.name,
          type: 'GPIO',
          value: deviceInput?.value || '',
        };
      });

      return <Table columns={columns} dataSource={data} pagination={false} />;
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
          render: (text: string) => (
            <Select value={text} style={{ width: '100%' }}>
              <Select.Option value="GPIO">GPIO</Select.Option>
            </Select>
          ),
        },
        {
          title: t('value'),
          dataIndex: 'value',
          key: 'value',
          render: (text: string, record: any) => {
            const deviceOutput = currentFunction.outputs.find((o) => o.property_id === record.id);
            return (
              <Input
                value={tempOutputs[record.id] ?? (deviceOutput ? deviceOutput.value : '')}
                onChange={(e) => handleOutputChange(record.id, 'options2', e.target.value)}
                placeholder={t('insertValue')}
              />
            );
          },
        },
      ];

      const data = currentFunction.function.outputs.map((output) => {
        const deviceOutput = currentFunction.outputs.find((o) => o.property_id === output.id);
        return {
          key: output.id,
          id: output.id,
          name: output.name,
          type: 'GPIO',
          value: deviceOutput?.value || '',
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
                <Descriptions.Item label={param.name} labelStyle={{ fontWeight: 'bold', width: '200px' }}>
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
      <Table columns={columns} dataSource={selectedFunctions} rowKey="id" pagination={false} scroll={{ y: 210 }} />
      <Space style={{ width: '100%', justifyContent: 'space-between' }}>
        <Space>
          <Button
            onClick={handleDeleteFunctions}
            type="primary"
            icon={<DeleteOutlined style={{ fontSize: '1.2rem' }} />}
          >
            {t('delete')}
          </Button>
          <Button
            onClick={() => setIsAddModalVisible(true)}
            type="primary"
            icon={<ControlOutlined style={{ fontSize: '1.2rem' }} />}
          >
            {t('addFunction')}
          </Button>
          <Button type="primary" onClick={handleTest} icon={<BulbOutlined style={{ fontSize: '1.2rem' }} />}>
            Test
          </Button>
        </Space>
        <Space>
          <Button type="primary" icon={<CloudDownloadOutlined style={{ fontSize: '1.2rem' }} />}>
            {t('recall')}
          </Button>
          <Button type="primary" icon={<CloudUploadOutlined style={{ fontSize: '1.2rem' }} />}>
            {t('schedule')}
          </Button>
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
      <Modal
        title="Conferma eliminazione"
        open={isDeleteConfirmVisible}
        onOk={confirmDelete}
        onCancel={() => setIsDeleteConfirmVisible(false)}
        okText="Elimina"
        cancelText="Annulla"
      >
        <p>
          Sei sicuro di voler eliminare{' '}
          {checkedFunctions.length === 1
            ? 'la funzione selezionata'
            : `le ${checkedFunctions.length} funzioni selezionate`}
          ?
        </p>
      </Modal>
      <Modal open={showTestComponent} onCancel={handleTest} width={370} footer={null}>
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
      </Modal>
      {/*showTestComponent && (
        <div style={{ marginLeft: 250 }}>
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
      )*/}
    </Space>
  );
}
