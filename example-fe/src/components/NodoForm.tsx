import ConfigService from '@/services/configService';
import { DinDataType, NodoFormProps } from '@/types';
import { Button, Checkbox, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const NodoForm = ({ form, onHideTestComponent }: NodoFormProps) => {
  const marginBottom = { marginBottom: -22 };
  const style = {
    minWidth: '550px',
    width: '100%',
    maxWidth: '680px',
    marginTop: -50,
    transform: 'scale(0.9)',
    marginLeft: -30,
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
      onHideTestComponent();
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
      <Form form={form} layout="vertical" autoComplete="off" onValuesChange={handleValuesChange} style={style}>
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={32} style={marginBottom}>
          <Col span={16}>
            <Form.Item name="denominazione" label="Denominazione">
              <Input name="denominazione" placeholder="Denominazione" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox style={{ marginTop: 26 }}>Enabled</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} style={marginBottom}>
          <Col span={16}>
            <Form.Item name="matricola" label="Matricola">
              <Input name="matricola" placeholder="Matricola" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={20} style={marginBottom}>
          <Col span={16}>
            <Form.Item label="Modello" name="modello">
              <Select placeholder="Modello">
                {/*models.map(model => (
                  <Select.Option key={model} value={model}>{model}</Select.Option>
                ))*/}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="sid" label="SID">
              <Input name="sid" placeholder="SID" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="din" label="DIN">
              <Input name="din" placeholder="DIN" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="latitudine" label="Latitudine">
              <Input name="latitudine" placeholder="Latitudine" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="longitudine" label="Longitudine">
              <Input name="longitudine" placeholder="Longitudine" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoForm;
