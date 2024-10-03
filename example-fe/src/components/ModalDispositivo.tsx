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
