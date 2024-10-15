/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ModalDispositivo.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ModalDispositivoProps } from '@/types';
import { Modal } from 'antd';
import React from 'react';
import CardDispositivo from './CardDispositivo';

const ModalDispositivo: React.FC<ModalDispositivoProps> = ({
  isVisible,
  onClose,
  data,
  status,
  setStatus,
  onChangeComplete,
  onChange,
  onSend,
}) => {
  return (
    <Modal title={`Dispositivo DIN: ${data.din}`} open={isVisible} onCancel={onClose} footer={null} width={350}>
      <CardDispositivo
        status={status}
        setStatus={setStatus}
        onChangeComplete={onChangeComplete}
        onChange={onChange}
        onSend={onSend}
      />
    </Modal>
  );
};

export default ModalDispositivo;
