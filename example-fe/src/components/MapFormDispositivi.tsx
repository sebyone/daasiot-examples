import { DinDataType, MapDataType, MapDispositiviFormProps, MapFormProps } from '@/types';
import { Button, Form, Input } from 'antd';
import React, { useEffect } from 'react';

const MapFormDispositivi = ({ form, onFinish, sid }: MapDispositiviFormProps) => {
  useEffect(() => {
    form.setFieldsValue({ sid });
  }, []);
  const handleFinish = (values: DinDataType) => {
    onFinish(values);
  };

  return (
    <div style={{ width: '40%' }}>
      <Form layout="vertical" form={form} autoComplete="off" onFinish={handleFinish} initialValues={{ sid }}>
        <Form.Item label="SID" name="sid" rules={[{ required: true, message: 'Inserisci un SID' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="DIN" name="din" rules={[{ required: true, message: 'Inserisci un DIN' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="P_RES" name="p_res" rules={[{ required: true, message: 'Inserisci P_RES' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="SKey" name="skey" rules={[{ required: true, message: 'Inserisci una SKey' }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit">
          Conferma
        </Button>
      </Form>
    </div>
  );
};

export default MapFormDispositivi;
