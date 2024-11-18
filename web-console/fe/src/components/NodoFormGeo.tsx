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
import { Badge, Col, Descriptions, Divider, Form, FormInstance, Row, Space, Typography } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const { Text } = Typography;

const NodoFormGeo = ({ form }: { form: FormInstance }) => {
  const marginBottom = { marginBottom: -30 };
  const t = useTranslations('NodoForm');
  const style = {
    minWidth: '550px',
    width: '100%',
    maxWidth: '680px',
    marginTop: 30,
  };

  const renderField = (value: string | number | boolean | undefined) => (
    <Text strong style={{ fontSize: '0.8rem' }}>
      {value !== undefined ? String(value) : '-'}
    </Text>
  );

  return (
    <div>
      <Form form={form} layout="vertical" style={style}>
        <Row gutter={16} style={marginBottom}>
          <Col span={8}>
            <Space>
              <Descriptions
                column={1}
                bordered
                className="custom-descriptions"
                size="small"
                style={{ marginBottom: 25 }}
              >
                <Descriptions.Item label={t('latitude')} labelStyle={{ fontWeight: 'bold' }}>
                  {renderField(form.getFieldValue('latitudine'))}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Col>
          <Col span={8}>
            <Space>
              <Descriptions
                column={1}
                bordered
                className="custom-descriptions"
                size="small"
                style={{ marginBottom: 25 }}
              >
                <Descriptions.Item label={t('longitude')} labelStyle={{ fontWeight: 'bold' }}>
                  {renderField(form.getFieldValue('longitudine'))}
                </Descriptions.Item>
              </Descriptions>
            </Space>
          </Col>
        </Row>
        <Divider style={{ margin: '12px 0', width: '100%' }} />
      </Form>
    </div>
  );
};

export default NodoFormGeo;
