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
import { Col, Form, FormInstance, Input, Row, Typography } from 'antd';
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
            <Form.Item name="serial" label={t('serialNumber')}>
              {renderField(form.getFieldValue('serial'))}
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default NodoFormHeader;
