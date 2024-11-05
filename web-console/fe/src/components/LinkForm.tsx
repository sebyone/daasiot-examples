/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: LinkForm.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { LinkDataType, LinkFormProps } from '@/types';
import { Form, Input, Select } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const LinkForm = ({ form, onFinish, setIsDataSaved, networkTech, setNetworkTech }: LinkFormProps) => {
  const t = useTranslations('LinkForm');
  const tipologiaOptions = [
    { label: 'INET4', value: 2 },
    { label: 'RS232', value: 'RS232', disabled: true },
    { label: 'MQTT5', value: 'MQTT5', disabled: true },
    { label: 'MBUS', value: 'MBUS', disabled: true },
    { label: 'BLT52', value: 3 },
    { label: 'USB30', value: 'USB30', disabled: true },
  ];
  const handleFinish = (values: LinkDataType) => {
    if (networkTech === 2) {
      values.url = `${values.ipAddress}:${values.port}`;
      delete values.ipAddress;
      delete values.port;
    }
    onFinish(values);
    setIsDataSaved(true);
  };

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  const handleNetworkChange = (value: number) => {
    setNetworkTech(value);
  };

  return (
    <div style={{ width: '40%' }}>
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="din_id_din" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item label="Link" name="link" rules={[{ required: true, message: t('selectLink') }]}>
          <Select options={tipologiaOptions} onChange={handleNetworkChange} />
        </Form.Item>

        {networkTech === 2 && (
          <>
            <Form.Item label={t('ipAddress')} name="ipAddress" rules={[{ required: true, message: t('enterIP') }]}>
              <Input placeholder={t('ipAddress')} />
            </Form.Item>
            <Form.Item label={t('port')} name="port" rules={[{ required: true, message: t('enterPort') }]}>
              <Input placeholder={t('port')} />
            </Form.Item>
          </>
        )}

        {networkTech === 3 && (
          <Form.Item
            name="macAddress"
            label={t('macAddress')}
            rules={[
              {
                required: true,
                message: t('enterMAC'),
              },
            ]}
          >
            <Input placeholder={t('macAddress')} />
          </Form.Item>
        )}
      </Form>
    </div>
  );
};

export default LinkForm;
