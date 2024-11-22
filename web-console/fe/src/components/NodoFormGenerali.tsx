/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: NodoFormGenerali.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { Badge, Col, Descriptions, Divider, Form, FormInstance, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import './NodoFormGenerali.css';
const { Text } = Typography;
const NodoFormGenerali = ({ form }: { form: FormInstance }) => {
  const t = useTranslations('NodoForm');

  const style = {
    width: '100%',
    maxWidth: '680px',
    margin: '0 auto',
    padding: '0 15px',
  };

  const containerStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    marginTop: '1.5rem',
  };

  const descriptionsStyle = {
    marginBottom: '1.5rem',
    width: '100%',
  };

  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong className="description-text">
      {value !== undefined ? String(value) : '-'}
    </Text>
  );

  const renderEnableField = (value: boolean | undefined) => {
    const isEnabled = value === true;
    return (
      <Descriptions column={1} bordered size="small" className="custom-descriptions">
        <Descriptions.Item
          label={
            <Text strong className="description-label">
              {isEnabled ? t('enabled') : t('disabled')}
            </Text>
          }
        >
          <Badge status={isEnabled ? 'success' : 'error'} />
        </Descriptions.Item>
      </Descriptions>
    );
  };

  return (
    <div style={containerStyle}>
      <Form form={form} layout="vertical" style={style}>
        <Form.Item name="id" noStyle>
          <input type="hidden" />
        </Form.Item>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Descriptions column={1} bordered size="small" className="custom-descriptions" style={descriptionsStyle}>
              <Descriptions.Item label={'SID'}>{renderField(form.getFieldValue('sid'))}</Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} sm={24} md={12}>
            <Descriptions column={1} bordered size="small" className="custom-descriptions" style={descriptionsStyle}>
              <Descriptions.Item label={'DIN'}>{renderField(form.getFieldValue('din'))}</Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider style={{ margin: '0.75rem 0' }} />

        <Row gutter={[8, 8]}>
          <Col xs={24} sm={24} md={12}>
            <Form.Item name="enable">{renderEnableField(form.getFieldValue('enable'))}</Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default NodoFormGenerali;
