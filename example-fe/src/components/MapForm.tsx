import { DinDataType, MapDataType, MapFormProps } from '@/types';
import { Button, Form, Input } from 'antd';
import React from 'react';

const MapForm = ({ form, onFinish, setIsDataSaved }: MapFormProps) => {
  const handleFinish = (values: DinDataType) => {
    onFinish(values);
    setIsDataSaved(true);
  };

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
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
      </Form>
    </div>
  );
};

export default MapForm;
