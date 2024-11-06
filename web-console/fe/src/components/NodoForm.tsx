/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: NodoForm.tsx
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
import { ConfigData, DataDevice, Dev, Device, DinLocalDataType, NodoFormProps } from '@/types';
import { Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useEffect, useState } from 'react';

const NodoForm = ({ form, onFinish, setIsDataSaved }: NodoFormProps) => {
  const marginBottom = { marginBottom: -22 };

  const t = useTranslations('NodoForm');
  const style = {
    minWidth: '550px',
    width: '100%',
    maxWidth: '680px',
    marginTop: -50,
    transform: 'scale(0.9)',
    marginLeft: -30,
  };
  const [deviceModels, setDeviceModels] = useState<Dev[]>([]);
  const [receiversData, setReceiversData] = useState<ConfigData[]>([]);
  const [selectedReceiverSid, setSelectedReceiverSid] = useState<string>('');
  const handleFinish = (values: DataDevice) => {
    onFinish(values);
    setIsDataSaved(true);
  };

  //const [maps, setMaps] = useState<DinDataType[]>([]);

  /*useEffect(() => {
    ConfigService
      .getMaps()
      .then((data) => setMaps(data))
      .catch((error) => console.error('Errore nel caricamento dei maps:', error));
  }, []);*/

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  useEffect(() => {
    const fetchDeviceModels = async () => {
      try {
        const response = await ConfigService.getDeviceModel(0, 100);
        setDeviceModels([
          {
            id: 0,
            device_group_id: 0,
            description: 'Device Model Default',
            serial: '',
          },
          ...response.data,
        ]);
      } catch (err) {
        console.error('Errore nel caricamento dei modelli:', err);
      }
    };
    fetchDeviceModels();
  }, []);

  useEffect(() => {
    const fetchReceivers = async () => {
      try {
        const data = await ConfigService.getReceivers();

        setReceiversData(data);
      } catch (error) {}
    };
    fetchReceivers();
  }, []);

  const handleReceiverChange = (receiverId: number) => {
    const selectedReceiver = receiversData.find((receiver) => receiver.id === receiverId);
    if (selectedReceiver?.din?.sid) {
      setSelectedReceiverSid(selectedReceiver.din.sid);
      form.setFieldsValue({ sid: selectedReceiver.din.sid });
    } else {
      setSelectedReceiverSid('');
      form.setFieldsValue({ sid: '' });
    }
  };

  return (
    <div
      style={{
        minWidth: '250px',
        width: '100%',
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'left',
        marginTop: '20px',
      }}
    >
      <Form
        form={form}
        layout="vertical"
        autoComplete="off"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        style={style}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={32} style={marginBottom}>
          <Col span={16}>
            <Form.Item name="denominazione" label={t('name')}>
              <Input name="denominazione" placeholder={t('name')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox style={{ marginTop: 26 }}>{t('enabled')}</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} style={marginBottom}>
          <Col span={16}>
            <Form.Item name="matricola" label={t('serialNumber')}>
              <Input name="matricola" placeholder={t('serialNumber')} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} style={marginBottom}>
          <Col span={16}>
            <Form.Item label={t('model')} name="modello">
              <Select
                placeholder="Modello"
                options={deviceModels.map((model) => ({
                  value: model.id,
                  label: model.description,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="receiver" label="Receivers">
              <Select
                placeholder="Receivers"
                options={receiversData.map((receiver) => ({
                  value: receiver.id,
                  label: receiver.title,
                }))}
                onChange={handleReceiverChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sid" label="SID">
              <Input name="sid" placeholder="SID" readOnly style={{ cursor: 'default' }} value={selectedReceiverSid} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="latitudine" label={t('latitude')}>
              <Input name="latitudine" placeholder={t('latitude')} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="longitudine" label={t('longitude')}>
              <Input name="longitudine" placeholder={t('longitude')} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoForm;
