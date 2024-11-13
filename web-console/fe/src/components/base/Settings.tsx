/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: Settings.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { SettingOutlined } from '@ant-design/icons';
import { Button, Dropdown, MenuProps, Space } from 'antd';
import React from 'react';

const items: MenuProps['items'] = [
  {
    label: <div>Riordina periodicamente map-entries dei receivers</div>,
    key: '0',
  },
];

export default function Settings() {
  return (
    <Space size="middle">
      <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight">
        <Button
          type="text"
          icon={<SettingOutlined />}
          style={{
            backgroundColor: 'transparent',
            border: 'none',
            color: 'white',
            marginTop: 20,
            marginRight: 20,
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
          }}
        />
      </Dropdown>
    </Space>
  );
}
