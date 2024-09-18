'use client';
import LinkTable from '@/components/LinkTable';
import MapTable from '@/components/MapTable';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { default as ConfigService, default as configService } from '@/services/configService';
import { ConfigData, ConfigFormData, LinkDataType, MapDataType, StatusDataType } from '@/types';
import { Button, Form, Modal, Tabs, TabsProps } from 'antd';
import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const DinLocalForm = dynamic(() => import('@/components/DinLocalForm'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelView = dynamic(() => import('@/components/PanelView'), { ssr: false });

const EditDinLocal = () => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [autoStart, setAutoStart] = useState(false);
  const [title, setTitle] = useState('');
  const [dinLocal, setDinLocal] = useState<string>();
  const { notify, contextHolder } = useCustomNotification();
  const [linksData, setLinksData] = useState<LinkDataType[]>([]);
  const [mapsData, setMapsData] = useState<MapDataType[]>([]);
  const [statusData, setStatusData] = useState<StatusDataType | null>(null);

  const handleEditLink = (data: LinkDataType) => {
    router.push(`/admin/configurazione/editLink/${data.id}`);
  };

  const handleEditMap = (data: MapDataType) => {
    router.push(`/admin/configurazione/editMap/${data.id}`);
  };

  const fetchLinks = async () => {
    try {
      await ConfigService.getLinks().then((data) => {
        const links = data.map((link) => ({
          id: link.id,
          link: link.link,
          url: link.url,
        }));
        setLinksData(links);
      });
    } catch {
      notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento dei links');
    }
  };

  const fetchMaps = async () => {
    try {
      await ConfigService.getMaps().then((data) => {
        const maps = data.map((map) => ({
          id: map.id,
          din: map.din,
          tech: map.tech,
        }));
        setMapsData(maps);
      });
    } catch {
      notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento del map');
    }
  };

  const fetchStatus = async () => {
    try {
      const data = await ConfigService.getStatus();
      setStatusData(data);
    } catch (error) {
      notify('error', 'Qualcosa non ha funzionato', 'Errore nel caricamento dello stato');
      console.error('Errore nel caricamento dello stato:', error);
    }
  };

  useEffect(() => {
    fetchStatus();
    /*const intervalId = setInterval(fetchStatus, 5000);

    return () => clearInterval(intervalId);*/
  }, []);

  const handleAddLink = () => {
    router.push(`/admin/configurazione/newLink`);
  };

  const handleAddMap = () => {
    router.push(`/admin/configurazione/newMap`);
  };

  const onFinish = async (values: ConfigFormData) => {
    try {
      await configService.update(values);

      notify('success', 'Salvataggio riuscito', 'Operazione avvenuta con successo');
    } catch {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'aggiornamento del din local");
    }
  };

  useEffect(() => {
    configService
      .getDinLocal()
      .then((data) => {
        form.setFieldsValue({
          id: data.id,
          din_id: data.din_id,
          _id: data.din.id,
          title: data.title,
          sid: data.din.sid,
          din: data.din.din,
          profileR: data.din.p_res.charAt(0),
          profileE: data.din.p_res.charAt(1),
          profileS: data.din.p_res.charAt(2),
          skey: data.din.skey,
          enable: data.enable || false,
          acpt_all: data.acpt_all || false,
        });
        setDinLocal(data.title);
      })
      .catch((error) => {
        console.error('Errore:', error);
      });
  }, [form]);

  const onStart = () => {
    configService
      .start()
      .then(() => {
        console.log('Nodo locale avviato.');
      })
      .catch((error) => {
        console.error('Errore:', error);
      });
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

  const handleDeleteLink = async (link: LinkDataType) => {
    if (!link?.id) return;
    try {
      await ConfigService.deleteLink(link.id);
      fetchLinks();
      notify('success', 'Operazione riuscita', 'Link eliminato con successo');
    } catch (error) {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'eliminazione del link");
      console.error("Errore nell'eliminazione del link:", error);
    }
  };

  const handleDeleteMap = async (map: MapDataType) => {
    if (!map?.id) return;
    try {
      await ConfigService.deleteMap(map.id);
      fetchMaps();
      notify('success', 'Operazione riuscita', 'Map eliminato con successo');
    } catch (error) {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'eliminazione del map");
      console.error("Errore nell'eliminazione del map:", error);
    }
  };

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Domotica',
      children: (
        <DinLocalForm
          form={form}
          onFinish={onFinish}
          onStart={onStart}
          setIsDataSaved={setIsDataSaved}
          autoStart={autoStart}
          setAutoStart={setAutoStart}
          showEnabledCheckBox={true}
          showAcceptAllCheckBox={true}
          showPowerActions={true}
          showSaveButton={false}
          showStatus={true}
          statusData={statusData}
        />
      ),
    },
    {
      key: '2',
      label: 'Links',
      children: (
        <LinkTable
          items={linksData}
          handleClick={handleAddLink}
          showButton={true}
          rowKey="id"
          route={router}
          confirm={handleDeleteLink}
          onRowClick={handleEditLink}
          onEditClick={handleEditLink}
        />
      ),
    },
    {
      key: '3',
      label: 'Map',
      children: (
        <MapTable
          items={mapsData}
          handleClick={handleAddMap}
          showButton={true}
          rowKey="din"
          route={router}
          confirm={handleDeleteMap}
          onRowClick={handleEditMap}
          onEditClick={handleEditMap}
        />
      ),
    },
  ];

  const handleTabChange = (key: string) => {
    switch (key) {
      case '1':
        break;
      case '2':
        setTitle('Links');
        fetchLinks();
        break;
      case '3':
        setTitle('Map');
        fetchMaps();
        break;
    }
  };

  return (
    <>
      {contextHolder}
      <DataPanel title={dinLocal} isEditing={isDataSaved} showSemaphore={true}>
        <Panel handleGoBack={handleGoBack} handleSave={handleSave} showSaveButtons={true} layoutStyle="singleTable">
          <PanelView layoutStyle="singleTable">
            <Tabs
              defaultActiveKey="1"
              items={items}
              type="card"
              onChange={handleTabChange}
              style={{ marginTop: -55, padding: 0 }}
            />
          </PanelView>
        </Panel>
      </DataPanel>
    </>
  );
};

export default EditDinLocal;
