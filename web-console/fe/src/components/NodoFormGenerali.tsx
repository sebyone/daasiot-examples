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
import { Badge, Col, Divider, Form, FormInstance, Row, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const { Text } = Typography;

const NodoFormGenerali = ({ form }: { form: FormInstance }) => {
  const marginBottom = { marginBottom: -22 };
  const t = useTranslations('NodoForm');
  const style = {
    minWidth: '550px',
    width: '50%',
    maxWidth: '680px',
    marginLeft: 30,
    marginTop: -30,
  };

  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong style={{ fontSize: '0.8rem' }}>
      {value !== undefined ? String(value) : '-'}
    </Text>
  );

  const renderEnableField = (value: boolean | undefined) => {
    const isEnabled = value === true;
    return (
      <Space>
        <Text strong style={{ fontSize: '0.8rem' }}>
          {isEnabled ? t('enabled') : t('disabled')}
        </Text>
        <Badge status={isEnabled ? 'success' : 'error'} />
      </Space>
    );
  };
  return (
    <div
      style={{
        minWidth: '250px',
        width: '100%',
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'left',
        marginTop: '25px',
      }}
    >
      <Form form={form} layout="vertical" style={style}>
        <Form.Item name="id" noStyle>
          <input type="hidden" />
        </Form.Item>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Form.Item name="sid" label="SID">
              {renderField(form.getFieldValue('sid'))}
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="din" label="DIN">
              {renderField(form.getFieldValue('din'))}
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0' }} />

        <Row gutter={8}>
          <Col span={8}>
            <Form.Item name="enable">{renderEnableField(form.getFieldValue('enable'))}</Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default NodoFormGenerali;
