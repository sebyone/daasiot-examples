'use client';
import { CardDispositivoProps } from '@/types';
import { Button, Card, Select, Slider, Switch } from 'antd';
import React from 'react';

const { Option } = Select;

const CardDispositivo = ({
  status,
  setStatus,
  onChangeComplete,
  onChange,
  onSend,
  dinOptions,
  selectedDin,
  setSelectedDin,
  onTest,
  test,
}: CardDispositivoProps) => {
  const marks = {
    0: '0',
    100: '100',
  };

  const handleTest = () => {
    onTest();
  };

  const options = [
    { label: '1234', value: '1234' },
    { label: '5678', value: '5678' },
    { label: '9101112', value: '9101112' },
  ];

  const disable = selectedDin === null;

  return (
    <Card title="Dispositivo" bordered={false} style={{ width: 300, backgroundColor: '#f0f0f0', padding: 0 }}>
      <span>Seleziona DIN:</span>
      <Select
        value={selectedDin}
        onChange={setSelectedDin}
        style={{ width: '100%', marginBottom: '25px' }}
        options={options}
      >
        {dinOptions.map((din) => (
          <Option key={din} value={din}>
            {din}
          </Option>
        ))}
      </Select>
      <Button type="primary" onClick={handleTest} disabled={disable} style={{ float: 'right', marginTop: '-10px' }}>
        TEST
      </Button>
      {test && (
        <div style={{ marginTop: '20px' }}>
          <span style={{ marginRight: '10px' }}>On/Off</span>
          <Switch checked={status} onChange={onChange} />
          <Slider defaultValue={0} onChangeComplete={onChangeComplete} marks={marks} />

          <Button type="primary" onClick={onSend}>
            Invia
          </Button>
        </div>
      )}
    </Card>
  );
};

export default CardDispositivo;
