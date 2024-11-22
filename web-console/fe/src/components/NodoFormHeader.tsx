/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: NodoFormHeader.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { Col, Descriptions, Form, FormInstance, Input, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import './NodoFormHeader.css';
const { Text } = Typography;
const NodoFormHeader = ({ form }: { form: FormInstance }) => {
  const t = useTranslations('NodoForm');
  const style = {
    width: '100%',
    maxWidth: '680px',
    marginTop: '-55px',
    marginLeft: '25px',
    padding: '0 15px',
  };
  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong className="header-field">
      {value !== undefined ? String(value) : '-'}
    </Text>
  );
  return (
    <Form form={form} layout="vertical" style={style}>
      <Form.Item name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Descriptions column={1} bordered className="custom-descriptions header-descriptions" size="small">
            <Descriptions.Item label={t('model')}>{renderField(form.getFieldValue('modello'))}</Descriptions.Item>
          </Descriptions>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Descriptions column={1} bordered className="custom-descriptions header-descriptions" size="small">
            <Descriptions.Item label={t('serialNumber')}>{renderField(form.getFieldValue('serial'))}</Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Form>
  );
};
export default NodoFormHeader;
