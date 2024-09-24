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
