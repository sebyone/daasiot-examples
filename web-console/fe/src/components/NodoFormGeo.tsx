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
import { Col, Descriptions, Divider, Form, FormInstance, Row, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import './NodoFormGeo.css';
const { Text } = Typography;
const NodoFormGeo = ({ form }: { form: FormInstance }) => {
  const t = useTranslations('NodoForm');
  const style = {
    width: '100%',
    maxWidth: '680px',
    marginTop: '30px',
    padding: '0 15px',
  };
  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong className="geo-field">
      {value !== undefined ? String(value) : '-'}
    </Text>
  );
  return (
    <div className="form-geo-container">
      <Form form={form} layout="vertical" style={style}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={8}>
            <Descriptions column={1} bordered className="custom-descriptions geo-descriptions" size="small">
              <Descriptions.Item label={t('latitude')}>
                {renderField(form.getFieldValue('latitudine'))}
              </Descriptions.Item>
            </Descriptions>
          </Col>
          <Col xs={24} sm={24} md={8}>
            <Descriptions column={1} bordered className="custom-descriptions geo-descriptions" size="small">
              <Descriptions.Item label={t('longitude')}>
                {renderField(form.getFieldValue('longitudine'))}
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
        <Divider className="geo-divider" />
      </Form>
    </div>
  );
};
export default NodoFormGeo;
