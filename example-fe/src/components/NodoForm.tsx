import ConfigService from '@/services/configService';
import { DinDataType, NodoFormProps } from '@/types';
import { Button, Checkbox, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

const NodoForm = ({ form, setIsDataSaved, onMapClick, onHideTestComponent }: NodoFormProps) => {
  const marginBottom = { marginBottom: -8 };
  const style = { minWidth: '550px', width: '100%', maxWidth: '680px', marginTop: -35 };
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
      <Form layout="vertical" onValuesChange={handleValuesChange} form={form} autoComplete="off" style={style}>
        <Row gutter={16} style={marginBottom}>
          <Col span={10}>
            <Form.Item label="SID" name="sid">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom} align="bottom">
          <Col span={10}>
            <Form.Item label="DIN" name="din">
              <Select />
              {/*
                <Select placeholder="Seleziona din">
              {maps.length > 0 ? (
                maps.map((map) => (
                  <Select.Option key={map.din} value={map.din}>
                    {map.din}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Nessun din disponibile
                </Select.Option>
              )}
            </Select>
              */}
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item>
              <Button type="primary" onClick={onMapClick}>
                Map
              </Button>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={10}>
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox>Enabled</Checkbox>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoForm;
