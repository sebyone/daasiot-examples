'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import configService from '@/services/configService';
import { DinDataType, LinkDataType, MapDataType } from '@/types';
import { Form, Modal, notification } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const MapForm = dynamic(() => import('@/components/MapForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const NewMap = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify, contextHolder } = useCustomNotification();
  const [title, setTitle] = useState('New Map');
  const [isDataSaved, setIsDataSaved] = useState(true);

  const onFinish = async (values: DinDataType) => {
    try {
      await configService.createMap(values);
      notify('success', 'Operazione riuscita', 'Map creato con successo');
      setIsDataSaved(true);
      router.push('/admin/configurazione');
    } catch (error) {
      notify('error', 'Qualcosa non ha funzionato', 'Errore nella creazione del map');
    }
  };

  const handleGoBack = () => {
    if (!isDataSaved) {
      notify('warning', 'Dati non salvati', 'Operazione non riuscita, salva prima di uscire');
      Modal.confirm({
        title: 'Sei sicuro?',
        content: 'I dati non salvati verranno persi. Vuoi continuare?',
        okText: 'Ok',
        cancelText: 'Annulla',
        onOk: () => {
          router.push('/admin/configurazione/editDinLocal/1');
        },
      });
      return;
    }

    router.push('/admin/configurazione/editDinLocal/1');
  };

  const handleSave = () => {
    form.submit();
  };

  return (
    <>
      {contextHolder}
      <DataPanel title={'New Map'} isEditing={isDataSaved} showSemaphore={true}>
        <Panel handleGoBack={handleGoBack} handleSave={handleSave} showSaveButtons={true} layoutStyle="singleTable">
          <PanelView layoutStyle="singleTable">
            <MapForm form={form} onFinish={onFinish} setIsDataSaved={setIsDataSaved} />
          </PanelView>
        </Panel>
      </DataPanel>
    </>
  );
};

export default NewMap;
