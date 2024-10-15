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
import { BellOutlined, ExportOutlined, ImportOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons';
import { Button, Checkbox, Modal, Select, Table } from 'antd';
import React, { useEffect, useState } from 'react';

const functions = [
  { id: 1, name: 'funzione1' },
  { id: 2, name: 'funzione2' },
  { id: 3, name: 'funzione3' },
];

const items = {
  parametro: ['Param1', 'Param2', 'Param3'],
  ingresso: ['Input1', 'Input2', 'Input3'],
  uscita: ['Output1', 'Output2', 'Output3'],
  notifica: ['Notifica1', 'Notifica2', 'Notifica3'],
};

const ParametersTab = () => {
  const [selectedFunctions, setSelectedFunctions] = useState<number[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentAction, setCurrentAction] = useState<string | null>(null);
  const [currentFunction, setCurrentFunction] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<{
    [key: number]: { [key: string]: string | null };
  }>({});
  const [modalSelectedItem, setModalSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    setModalSelectedItem(null);
  }, [currentAction]);

  const handleSelectFunction = (functionId: number) => {
    setSelectedFunctions((prevSelected) =>
      prevSelected.includes(functionId) ? prevSelected.filter((id) => id !== functionId) : [...prevSelected, functionId]
    );
  };

  const handleIconClick = (functionId: number, actionType: string) => {
    setCurrentFunction(functionId);
    setCurrentAction(actionType);
    setIsModalVisible(true);
  };

  const handleModalItemSelect = (value: string) => {
    setModalSelectedItem(value);
  };

  const handleModalOk = () => {
    if (modalSelectedItem && currentFunction && currentAction) {
      setSelectedItems((prevItems) => ({
        ...prevItems,
        [currentFunction]: {
          ...(prevItems[currentFunction] || {}),
          [currentAction]: modalSelectedItem,
        },
      }));
      setIsModalVisible(false);
      setModalSelectedItem(null);
    }
  };

  const columns = [
    {
      title: '',
      dataIndex: 'select',
      render: (_, record) => (
        <Checkbox
          style={{ fontSize: '1.1rem' }}
          checked={selectedFunctions.includes(record.id)}
          onChange={() => handleSelectFunction(record.id)}
        />
      ),
    },
    {
      title: 'Funzione',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<SettingOutlined />} Parametri</span>,
      key: 'parameters',
      render: (_, record) =>
        selectedItems[record.id]?.parametro ? (
          selectedItems[record.id].parametro
        ) : (
          <PlusOutlined
            onClick={() => handleIconClick(record.id, 'parametro')}
            style={{ fontSize: '0.8rem', color: '#1890ff', cursor: 'pointer' }}
          />
        ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<ImportOutlined />} Ingressi</span>,
      key: 'inputs',
      render: (_, record) =>
        selectedItems[record.id]?.ingresso ? (
          selectedItems[record.id].ingresso
        ) : (
          <PlusOutlined
            onClick={() => handleIconClick(record.id, 'ingresso')}
            style={{ fontSize: '0.8rem', color: '#1890ff', cursor: 'pointer' }}
          />
        ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<ExportOutlined />} Uscite</span>,
      key: 'outputs',
      render: (_, record) =>
        selectedItems[record.id]?.uscita ? (
          selectedItems[record.id].uscita
        ) : (
          <PlusOutlined
            onClick={() => handleIconClick(record.id, 'uscita')}
            style={{ fontSize: '0.8rem', color: '#1890ff', cursor: 'pointer' }}
          />
        ),
    },
    {
      title: <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{<BellOutlined />} Notifiche</span>,
      key: 'notifications',
      render: (_, record) =>
        selectedItems[record.id]?.notifica ? (
          selectedItems[record.id].notifica
        ) : (
          <PlusOutlined
            onClick={() => handleIconClick(record.id, 'notifica')}
            style={{ fontSize: '0.8rem', color: '#1890ff', cursor: 'pointer' }}
          />
        ),
    },
  ];

  return (
    <div>
      <Table columns={columns} dataSource={functions} rowKey="id" pagination={false} />
      <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Button style={{ marginRight: 8 }} type="primary">
            Recall
          </Button>
          <Button type="primary">Modifica</Button>
        </div>
        <Button type="primary">Programma</Button>
      </div>
      <Modal
        title={`Seleziona ${currentAction}`}
        open={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          setModalSelectedItem(null);
        }}
        onOk={handleModalOk}
      >
        <Select
          style={{ width: '100%' }}
          placeholder={`Seleziona ${currentAction}`}
          value={modalSelectedItem}
          onChange={handleModalItemSelect}
        >
          {currentAction &&
            items[currentAction as keyof typeof items]?.map((item, index) => (
              <Select.Option key={index} value={item}>
                {item}
              </Select.Option>
            ))}
        </Select>
      </Modal>
    </div>
  );
};

export default ParametersTab;
