'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import { DinLocalDataType } from '@/types';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const ReceiversTable = dynamic(() => import('@/components/ReceiversTable'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelList = dynamic(() => import('@/components/PanelList'), { ssr: false });

export default function Dispositivi() {
  const router = useRouter();
  //const [dinLocalData, setDinLocalData] = useState<DinLocalDataType[]>([]);
  const { notify, contextHolder } = useCustomNotification();

  const dinLocalData: DinLocalDataType[] = [
    {
      id: 1,
      title: 'dinLocal',
      sid: 1,
      din: 1,
      acp_all: 'true',
      links: 'link',
      status: 'ok',
    },
  ];

  const handleRowClick = (dinLocal: DinLocalDataType) => {
    if (!dinLocal?.id) return;
    router.push(`./configurazione/editDinLocal/${dinLocal.id}`);
  };

  const handleDelete = async (dinLocal: DinLocalDataType) => {
    /*if (!edificio?.id) return;
    try {
      await edificiService.delete(edificio.id);
      fetchEdifici();
      notify('success', 'Operazione riuscita', 'Edificio eliminato con successo');
    } catch (error) {
      notify('error', 'Qualcosa non ha funzionato', "Errore nell'eliminazione dell'edificio");
      console.error("Errore nell'eliminazione dell'edificio:", error);
    }*/
  };

  return (
    <>
      {contextHolder}
      <DataPanel title={'Receivers'} isEditing={true} showSemaphore={false}>
        <Panel showAddButton={false} layoutStyle="singleTable">
          <PanelList layoutStyle="singleTable">
            <ReceiversTable
              items={dinLocalData}
              showButton={false}
              rowKey="id"
              route={router}
              confirm={handleDelete}
              onRowClick={handleRowClick}
              onEditClick={handleRowClick}
            />
          </PanelList>
        </Panel>
      </DataPanel>
    </>
  );
}
