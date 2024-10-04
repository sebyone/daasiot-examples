'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { Device } from '@/types';
import { Form, Modal } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const NodoForm = dynamic(() => import('@/components/NodoForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const EditDispositivo = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify, contextHolder } = useCustomNotification();
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [device, setDevice] = useState<string>();
  const t = useTranslations('EditDispositivo');
  const tBack = useTranslations('handleGoBack');
  const locale = useLocale();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    ConfigService.getDeviceById(id).then((data) => {
      form.setFieldsValue({
        id: data.id,
        denominazione: data.name,
        matricola: data.device_model.serial,
        modello: data.device_model.description,
        sid: data.din.sid,
        din: data.din.din,
        latitudine: data.latitude,
        longitudine: data.longitude,
      });
      setDevice(data.name);
    });
  });

  const onFinish = async (values: Device) => {};

  const handleGoBack = () => {
    if (!isDataSaved) {
      notify('warning', tBack('warning'), tBack('warningContent'));
      Modal.confirm({
        title: tBack('title'),
        content: tBack('content'),
        okText: 'Ok',
        cancelText: tBack('cancelText'),
        onOk: () => {
          router.push(`/${locale}/admin/dispositivi`);
        },
      });
      return;
    }

    router.push(`/${locale}/admin/dispositivi`);
  };

  const handleSave = () => {
    form.submit();
  };
  return (
    <>
      {contextHolder}
      <DataPanel title={device} isEditing={isDataSaved} showSemaphore={true}>
        <Panel handleGoBack={handleGoBack} handleSave={handleSave} showSaveButtons={true} layoutStyle="singleTable">
          <PanelView layoutStyle="singleTable">
            <NodoForm form={form} onFinish={onFinish} setIsDataSaved={setIsDataSaved} readOnly={false} />
          </PanelView>
        </Panel>
      </DataPanel>
    </>
  );
};

export default EditDispositivo;
