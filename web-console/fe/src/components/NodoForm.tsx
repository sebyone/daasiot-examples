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
import { CreateDevice, DataDevice, NodoFormProps } from '@/types';
import { Button, Checkbox, Col, Form, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';

const NodoForm = ({
  form,
  onFinish,
  setIsDataSaved,
  deviceModels,
  receiversData,
  selectedReceiverSid,
  onReceiverChange,
  onOpenModal,
}: NodoFormProps) => {
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

  const handleFinish = (values: CreateDevice) => {
    onFinish(values);
    setIsDataSaved(true);
  };

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  const handleOpenModal = () => {
    onOpenModal();
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
            <Form.Item name="id" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="din_id" noStyle>
              <Input type="hidden" />
            </Form.Item>
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
                onChange={onReceiverChange}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sid" label="SID">
              <Input name="sid" placeholder="SID" readOnly style={{ cursor: 'default' }} value={selectedReceiverSid} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24} style={marginBottom}>
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
          <Col span={8}>
            <Button type="primary" style={{ marginTop: 20 }} onClick={onOpenModal}>
              Map
            </Button>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoForm;
