import ConfigService from '@/services/configService';
import DispositiviService from '@/services/dispositiviService';
import { ConfigFormData, DinLocalFormProps, StatusDataType } from '@/types';
import { Button, Card, Checkbox, Col, Form, Input, List, Row, Select, Switch, Table } from 'antd';
import React, { useState } from 'react';
import StatusTable from './StatusTabel';

const DinLocalForm = ({
  form,
  onFinish,
  onStart,
  setIsDataSaved,
  autoStart,
  setAutoStart,
  showEnabledCheckBox,
  showAcceptAllCheckBox,
  showPowerActions,
  showSaveButton,
  showStatus,
  statusData,
}: DinLocalFormProps) => {
  const tipologiaOptions = [{ value: '0' }, { value: '1' }];
  const marginBottom = { marginBottom: -8 };
  const style = { minWidth: '550px', width: '100%', maxWidth: '680px', marginTop: -35 };

  const handleFinish = (values: ConfigFormData) => {
    if (onFinish) {
      onFinish(values);
    }
    setIsDataSaved(true);
  };

  const handleValuesChange = () => {
    if (form.isFieldsTouched()) {
      setIsDataSaved(false);
    }
  };

  const handleStart = () => {
    if (onStart) {
      onStart();
    }
  };

  const handleAutoStartChange = (checked: boolean) => {
    if (setAutoStart) {
      setAutoStart(checked);
    }
  };

  return (
    <div
      style={{
        minWidth: '250px',
        width: '100%',
        display: 'flex',
        justifyItems: 'center',
        justifyContent: 'left',
        marginTop: '20px',
      }}
    >
      <Form
        layout="vertical"
        form={form}
        autoComplete="off"
        onFinish={handleFinish}
        onValuesChange={handleValuesChange}
        style={style}
      >
        <Row gutter={16} style={marginBottom}>
          <Col span={20}>
            <Form.Item name="id" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="din_id" noStyle>
              <Input type="hidden" />
            </Form.Item>
            <Form.Item name="_id" noStyle>
              <Input type="hidden" />
            </Form.Item>

            <Form.Item label="Title" name="title">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={10}>
            <Form.Item label="SID" name="sid">
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="DIN" name="din">
              <Input />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={12}>
            <Form.Item label="Profile R (Realability)" name="profileR">
              <Select options={tipologiaOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={12}>
            <Form.Item label="Profile E (Efficiency)" name="profileE">
              <Select options={tipologiaOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={12}>
            <Form.Item label="Profile S (Privacy)" name="profileS">
              <Select options={tipologiaOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16} style={marginBottom}>
          <Col span={20}>
            <Form.Item label="SKey" name="skey">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16} style={marginBottom}>
          {showEnabledCheckBox && (
            <Form.Item name="enable" valuePropName="checked">
              <Checkbox>Enabled</Checkbox>
            </Form.Item>
          )}
          {showAcceptAllCheckBox && (
            <Form.Item name="acpt_all" valuePropName="checked">
              <Checkbox>Accept all</Checkbox>
            </Form.Item>
          )}
        </Row>

        {showSaveButton && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button type="primary" htmlType="submit">
              Salva
            </Button>
          </div>
        )}
      </Form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px' }}>
        {showPowerActions && (
          <div style={{ height: 50, marginBottom: 30 }}>
            <Card bordered={false} style={{ width: 400, backgroundColor: '#f0f0f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-around', gap: 15 }}>
                <span>Avvio Automatico:</span>
                <Switch checked={autoStart} onChange={handleAutoStartChange} />

                <Button type="primary" onClick={handleStart}>
                  Avvia
                </Button>
                <Button type="primary" onClick={() => {}}>
                  Riavvia
                </Button>
              </div>
            </Card>
          </div>
        )}
        {showStatus && (
          <Card title="Status" bordered={false} style={{ width: '100%', backgroundColor: '#f0f0f0' }}>
            {statusData ? (
              <List
                size="small"
                dataSource={[
                  { key: 'lasttime', label: 'Last Time', value: statusData.lasttime },
                  { key: 'hwver', label: 'HW Version', value: statusData.hwver },
                  { key: 'linked', label: 'Linked', value: statusData.linked },
                  { key: 'sync', label: 'Sync', value: statusData.sync },
                  { key: 'lock', label: 'Lock', value: statusData.lock },
                ]}
                renderItem={(item) => (
                  <List.Item>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <span>{item.label}:</span>
                      <span>{item.value}</span>
                    </div>
                  </List.Item>
                )}
              />
            ) : null}
          </Card>
        )}
      </div>
    </div>
  );
};

export default DinLocalForm;
