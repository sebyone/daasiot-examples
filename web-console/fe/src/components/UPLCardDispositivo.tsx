/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: UPLCardDispositivo.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { UPLDispositivoCardProps } from '@/types';
import { Slider, Switch } from 'antd';
import React from 'react';
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
