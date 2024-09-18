'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { default as ConfigService, default as configService } from '@/services/configService';
import { LinkDataType } from '@/types';
import { Form, Modal, notification } from 'antd';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const LinkForm = dynamic(() => import('@/components/LinkForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const EditLink = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const { notify, contextHolder } = useCustomNotification();
  const [title, setTitle] = useState('New Link');
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [networkTech, setNetworkTech] = useState<number | null>(null);
  const [link, setLink] = useState<string>();
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    ConfigService.getLinkById(id)
      .then((data) => {
        setNetworkTech(data.link);
        if (data.link === 2) {
          const [ipAddress, port] = data.url.split(':');

          form.setFieldsValue({
            ...data,
            ipAddress,
            port,
          });
        } else {
          form.setFieldsValue(data);
        }
        setLink(data.url);
      })
      .catch((error) => {
        notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento dei dati del link');
        console.error('Errore:', error);
      });
  }, []);

  const onFinish = async (values: LinkDataType) => {
    try {
      let updatedValues = { ...values };
      if (values.link === 2) {
        if (values.ipAddress && values.port) {
          updatedValues.url = `${values.ipAddress}:${values.port}`;
        }
        delete updatedValues.ipAddress;
        delete updatedValues.port;
      }
      await configService.updateLink(id, updatedValues);
      notify('success', 'Operazione riuscita', 'Operazione avvenuta con successo');
    } catch {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'aggiornamento' del link");
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
      <DataPanel title={link} isEditing={isDataSaved} showSemaphore={true}>
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

export default EditLink;
