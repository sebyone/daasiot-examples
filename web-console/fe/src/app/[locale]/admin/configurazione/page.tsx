/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: page.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
'use client';
import { useCustomNotification } from '@/hooks/useNotificationHook';
import ConfigService from '@/services/configService';
import { DinLocalDataType } from '@/types';
import { useTranslations } from 'next-intl';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const DataPanel = dynamic(() => import('@/components/DataPanel'), { ssr: false });
const ReceiversTable = dynamic(() => import('@/components/ReceiversTable'), { ssr: false });
const Panel = dynamic(() => import('@/components/Panel'), { ssr: false });
const PanelList = dynamic(() => import('@/components/PanelList'), { ssr: false });

export default function Configurazione() {
  const router = useRouter();
  const [receiversData, setReceiversData] = useState<DinLocalDataType[]>([]);
  const t = useTranslations('Configurazione');
  const { notify, contextHolder } = useCustomNotification();

  /* receiversData: DinLocalDataType[] = [
    {
      id: 1,
      title: 'dinLocal',
      sid: 1,
      din: 1,
      acpt_all: 'true',
      links: 'link',
      status: 'ok',
    },
  ];*/
  const fetchReceivers = async () => {
    try {
      const data = await ConfigService.getAll();
      const receivers = data.map((receiver) => ({
        id: receiver.id,
        title: receiver.title,
        sid: receiver.din.sid,
        din: receiver.din.din,
        acpt_all: receiver.acpt_all ? 'Yes' : 'No',
        links: receiver.links.length.toString(),
        status: '',
      }));
      setReceiversData(receivers);
    } catch (error) {
      notify('error', t('error'), t('errorGetReceivers'));
    }
  };

  useEffect(() => {
    fetchReceivers();
  }, []);

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
              items={receiversData}
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
