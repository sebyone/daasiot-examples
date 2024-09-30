import { DinDataType, DinFormData, MapDataType, MapFormProps } from '@/types';
import { Button, Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';

const MapForm = ({ form, onFinish, setIsDataSaved }: MapFormProps) => {
  const t = useTranslations('MapForm');
  const handleFinish = (values: DinFormData) => {
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
        <Form.Item label="SID" name="sid" rules={[{ required: true, message: t('enterSID') }]}>
          <Input />
        </Form.Item>
        <Form.Item label="DIN" name="din" rules={[{ required: true, message: t('enterDIN') }]}>
          <Input />
        </Form.Item>
        <Form.Item label="P_RES" name="p_res" rules={[{ required: true, message: t('enterPRES') }]}>
          <Input />
        </Form.Item>
        <Form.Item label="SKey" name="skey" rules={[{ required: true, message: t('enterSkey') }]}>
          <Input />
        </Form.Item>
      </Form>
    </div>
  );
};

export default MapForm;
