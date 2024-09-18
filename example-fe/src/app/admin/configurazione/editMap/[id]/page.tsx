'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import configService from '@/services/configService';
import { DinDataType, LinkDataType, MapDataType } from '@/types';
import { Form, Modal, notification } from 'antd';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const MapForm = dynamic(() => import('@/components/MapForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const EditMap = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify, contextHolder } = useCustomNotification();
  const [title, setTitle] = useState('');
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [map, setMap] = useState<string>();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    configService
      .getMapById(id)
      .then((data) => {
        form.setFieldsValue(data);
        setMap(data.din);
      })
      .catch((error) => {
        notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento dei dati del map');
        console.error('Errore:', error);
      });
  }, []);

  const onFinish = async (values: DinDataType) => {
    try {
      await configService.updateMap(id, values);
      notify('success', 'Operazione riuscita', 'Operazione avvenuta con successo');
    } catch {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'aggiornamento  del map");
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
          router.push('/admin/configurazione');
        },
      });
      return;
    }

    router.push('/admin/configurazione');
  };

  const handleSave = () => {
    form.submit();
  };

  return (
    <>
      {contextHolder}
      <DataPanel title={map} isEditing={isDataSaved} showSemaphore={true}>
        <Panel handleGoBack={handleGoBack} handleSave={handleSave} showSaveButtons={true} layoutStyle="singleTable">
          <PanelView layoutStyle="singleTable">
            <MapForm form={form} onFinish={onFinish} setIsDataSaved={setIsDataSaved} />
          </PanelView>
        </Panel>
      </DataPanel>
    </>
  );
};

export default EditMap;
