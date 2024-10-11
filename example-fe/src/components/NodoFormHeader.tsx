import { Card, Col, Form, FormInstance, Input, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const { Text } = Typography;

const NodoFormHeader = ({ form }: { form: FormInstance }) => {
  const marginBottom = { marginBottom: -22 };
  const t = useTranslations('NodoForm');
  const style = {
    minWidth: '550px',
    width: '100%',
    maxWidth: '680px',
    marginTop: -50,
    marginLeft: 25,
    marginBottom: -20,
  };

  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong style={{ fontSize: '0.8rem' }}>
      {value !== undefined ? String(value) : '-'}
    </Text>
  );

  return (
    <>
      <Form form={form} layout="vertical" style={style}>
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Row gutter={24} style={marginBottom}>
          <Col span={12}>
            <Form.Item label={t('model')} name="modello">
              {renderField(form.getFieldValue('modello'))}
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="matricola" label={t('serialNumber')}>
              {renderField(form.getFieldValue('matricola'))}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default NodoFormHeader;
