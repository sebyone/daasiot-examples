import { UPLDispositivoCardProps } from '@/types';
import { Slider, Switch } from 'antd';
import React, { useState } from 'react';
import BaseCardDispositivo from './generics/BaseCardDispositivo';

const UPLCardDispositivo = ({
  status,
  setStatus,
  value,
  setValue,
  showTestControl,
  ...baseProps
}: UPLDispositivoCardProps) => {
  const marks = {
    0: '0',
    100: '100',
  };

  const options = [
    { label: '102', value: 102 },
    { label: '5678', value: 5678 },
    { label: '9101112', value: 9101112 },
  ];

  return (
    <BaseCardDispositivo
      {...baseProps}
      options={options}
      showTestControl={showTestControl}
      status={status}
      setStatus={setStatus}
      value={value}
      setValue={setValue}
    >
      <div style={{ marginTop: -30 }}>
        <span style={{ marginRight: '10px' }}>On/Off</span>
        <Switch checked={status} onChange={setStatus} />
        <Slider value={value} onChange={setValue} marks={marks} />
      </div>
    </BaseCardDispositivo>
  );
};

export default UPLCardDispositivo;
