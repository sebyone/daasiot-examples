'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import configService from '@/services/configService';
import { LinkDataType } from '@/types';
import { Form, Modal, notification } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const LinkForm = dynamic(() => import('@/components/LinkForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const NewLink = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify, contextHolder } = useCustomNotification();
  const [title, setTitle] = useState('New Link');
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [networkTech, setNetworkTech] = useState<number | null>(null);

  const onFinish = async (values: LinkDataType) => {
    try {
      await configService.createLink(values);
      notify('success', 'Operazione riuscita', 'Operazione avvenuta con successo');
    } catch {
      notify('error', 'Qualcosa non ha funzionato', 'Errore nella creazione del link');
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
      <DataPanel title={'New Link'} isEditing={isDataSaved} showSemaphore={true}>
        <Panel handleGoBack={handleGoBack} handleSave={handleSave} showSaveButtons={true} layoutStyle="singleTable">
          <PanelView layoutStyle="singleTable">
            <LinkForm
              form={form}
              onFinish={onFinish}
              setIsDataSaved={setIsDataSaved}
              networkTech={networkTech}
              setNetworkTech={setNetworkTech}
            />
          </PanelView>
        </Panel>
      </DataPanel>
    </>
  );
};

export default NewLink;
