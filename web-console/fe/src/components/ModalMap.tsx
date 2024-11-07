/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ModalMap.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { useCustomNotification } from '@/hooks/useNotificationHook';
import configService from '@/services/configService';
import { DinFormData, ModalMapProps } from '@/types';
import { Form, Modal } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import MapForm from './MapForm';

const ModalMap: React.FC<ModalMapProps> = ({ isVisible, onClose, sid }) => {
  const [form] = Form.useForm();
  const { notify, contextHolder } = useCustomNotification();
  const [isDataSaved, setIsDataSaved] = useState(true);
  const [disableSid, setDisableSid] = useState(false);
  const t = useTranslations('EditMap');
  const params = useParams();
  const id = Number(params.id);

  useEffect(() => {
    form.setFieldsValue({
      sid: sid,
    });
    setDisableSid(true);
  });
  /*useEffect(() => {
    configService
      .getMapById(id)
      .then((data) => {
        const firstLink = data.cdin.links?.[0];
        form.setFieldsValue({
          id: data.cdin.id,
          sid: sid,
          links: firstLink?.id || null,
          address: firstLink?.url || null,
          receiver: null,
          profileR: data.cdin.p_res.charAt(0),
          profileE: data.cdin.p_res.charAt(1),
          profileS: data.cdin.p_res.charAt(2),
          skey: data.cdin.skey,
        });
      })
      .catch((error) => {
        notify('error', t('error'), t('errorGetMap'));
        console.error('Errore:', error);
      });
  }, []);*/

  const onFinish = async (values: DinFormData) => {
    try {
      const formattedValues: DinFormData = {
        din: {
          sid: values.sid,
          din: values.din,
          p_res: `${values.profileR}${values.profileE}${values.profileS}` || '',
          skey: values.skey || '',
          links: values.links || [],
          receiver: values.receiver || null,
        },
      };
      await configService.updateMap(id, formattedValues);
      notify('success', t('success'), t('successSave'));
    } catch {
      notify('error', t('error'), t('errorUpdateMap'));
    }
  };

  const handleSave = () => {
    form.submit();
  };
  return (
    <Modal open={isVisible} onOk={handleSave} onCancel={onClose} width={900}>
      <MapForm form={form} setIsDataSaved={setIsDataSaved} onFinish={onFinish} disableSid={disableSid} />
    </Modal>
  );
};

export default ModalMap;
