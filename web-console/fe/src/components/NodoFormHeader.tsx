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
import { Card, Col, Form, FormInstance, Input, Row, Statistic } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import './NodoFormHeader.css';
const NodoFormHeader = ({ form }: { form: FormInstance }) => {
  const t = useTranslations('NodoForm');
  const style = {
    width: '100%',
    maxWidth: '680px',
    marginTop: '-55px',
    marginLeft: '25px',
    padding: '0 15px',
  };
  const renderField = (value: string | number | boolean | undefined) => (value !== undefined ? String(value) : '-');

  const formatMatricola = (value: string | number | undefined) => {
    if (value === undefined) return '-';
    return String(value).replace(/,/g, '');
  };
  return (
    <Form form={form} layout="vertical" style={style}>
      <Form.Item name="id" noStyle>
        <Input type="hidden" />
      </Form.Item>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={24} md={12}>
          <Card
            size="small"
            bordered={false}
            bodyStyle={{
              padding: '4px',
              minHeight: '20px',
            }}
            style={{ boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)', cursor: 'default' }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: '0.75rem',
                    marginBottom: '2px',
                  }}
                >
                  Modello
                </span>
              }
              value={renderField(form.getFieldValue('modello'))}
              valueStyle={{
                color: 'black',
                fontSize: '0.85rem',
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <Card
            size="small"
            bordered={false}
            bodyStyle={{
              padding: '4px',
              minHeight: '20px',
            }}
            style={{ boxShadow: '5px 8px 24px 5px rgba(208, 216, 243, 0.6)', cursor: 'default' }}
          >
            <Statistic
              title={
                <span
                  style={{
                    fontSize: '0.75rem',
                    marginBottom: '2px',
                  }}
                >
                  Matricola
                </span>
              }
              value={form.getFieldValue('serial')}
              formatter={formatMatricola}
              valueStyle={{
                color: 'black',
                fontSize: '0.85rem',
              }}
            />
          </Card>
        </Col>
      </Row>
    </Form>
  );
};
export default NodoFormHeader;
