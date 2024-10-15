/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: CardDispositivo.tsx
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
import { CardDispositivoProps } from '@/types';
import { Button, Card, Slider, Switch } from 'antd';
import React from 'react';

const CardDispositivo = ({ status, setStatus, onChangeComplete, onChange, onSend }: CardDispositivoProps) => {
  const marks = {
    0: '0',
    100: '100',
  };
  return (
    <Card title="UPL Modello XX" bordered={false} style={{ width: 300, backgroundColor: '#f0f0f0' }}>
      <div>
        <span style={{ marginRight: '10px' }}>On/Off</span>
        <Switch checked={status} onChange={onChange} />
        <Slider defaultValue={0} onChangeComplete={onChangeComplete} marks={marks} />
        <Button type="primary" onClick={onSend}>
          Invia
        </Button>
      </div>
    </Card>
  );
};

export default CardDispositivo;
