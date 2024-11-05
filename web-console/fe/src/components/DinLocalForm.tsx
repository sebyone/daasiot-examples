/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: DinLocalForm.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ConfigFormData, DinLocalFormProps } from '@/types';
import { Button, Card, Checkbox, Col, Form, Input, List, Row, Select, Switch } from 'antd';
import { useTranslations } from 'next-intl';
import React, { useState } from 'react';

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
  showPowerActionsProcessor,
  showSaveButton,
  showStatus,
  statusData,
}: DinLocalFormProps) => {
  const tipologiaOptions = [{ value: '0' }, { value: '1' }];
  const marginBottom = { marginBottom: -8 };
  const style = { minWidth: '550px', width: '100%', maxWidth: '680px', marginTop: -35 };
  const t = useTranslations('DinLocalForm');

  const [processorAutoStart, setProcessorAutoStart] = useState(false);
  const handleReceiverAutoStartChange = (checked: boolean) => {
    if (setAutoStart) {
      setAutoStart(checked);
    }
  };
  const handleProcessorAutoStartChange = (checked: boolean) => {
    setProcessorAutoStart(checked);
  };
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
            <Form.Item label="Network Identifier (SID)" name="sid">
              <Input />
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item label="Node Identifier (DIN)" name="din">
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
        <Row gutter={24} style={marginBottom}>
          <Col span={16}>
            <Form.Item label="SKey" name="skey">
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Button style={{ marginTop: 20 }} type="primary">
              Generate
            </Button>
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
      </Form>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '400px', marginTop: -15 }}>
        {showPowerActions && (
          <Card title="Receiver" bordered={false} style={{ width: 400, backgroundColor: '#f0f0f0' }} size="small">
            <span style={{ marginRight: 10 }}>Avvio Automatico:</span>
            <Switch checked={autoStart} onChange={handleReceiverAutoStartChange} />
          </Card>
        )}
        {showStatus && (
          <>
            <Card title="Status" bordered={false} style={{ width: '100%', backgroundColor: '#f0f0f0' }}>
              {statusData ? (
                <List
                  size="small"
                  dataSource={[
                    { key: 'lasttime', label: 'Start Time', value: statusData.lasttime },
                    { key: 'hwver', label: 'DaaS Version', value: statusData.hwver },
                    { key: 'linked', label: 'Links', value: statusData.linked },
                    { key: 'sync', label: 'Map Size', value: statusData.sync },
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
            <Button style={{ width: '20%', marginTop: -10, marginLeft: 'auto', display: 'block' }} type="primary">
              Restart
            </Button>
          </>
        )}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxWidth: '400px',
          marginTop: -15,
          marginLeft: 15,
        }}
      >
        {showPowerActionsProcessor && (
          <Card title="Processor" bordered={false} style={{ width: 400, backgroundColor: '#f0f0f0' }} size="small">
            <span style={{ marginRight: 10 }}>Avvio Automatico:</span>
            <Switch checked={processorAutoStart} onChange={handleProcessorAutoStartChange} />
          </Card>
        )}
        {showStatus && (
          <>
            <Card title="Statistics" bordered={false} style={{ width: '100%', backgroundColor: '#f0f0f0' }}>
              {statusData ? (
                <List
                  size="small"
                  dataSource={[
                    { key: 'lasttime', label: 'Zero Time', value: statusData.lasttime },
                    { key: 'hwver', label: 'Received (DDO)', value: statusData.hwver },
                    { key: 'linked', label: 'Processed', value: statusData.linked },
                    { key: 'sync', label: 'Rate', value: statusData.sync },
                    { key: 'lock', label: 'Free mem', value: statusData.lock },
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
            <Button style={{ width: '30%', marginTop: -10, marginLeft: 'auto', display: 'block' }} type="primary">
              Reset statistics
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default DinLocalForm;
