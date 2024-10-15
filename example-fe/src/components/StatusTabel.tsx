/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: StatusTable.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ColumnType, StatusDataType } from '@/types';
import GenericTable from './generics/GenericTable';

const defaultColumns: ColumnType[] = [
  {
    title: 'Last Time',
    dataIndex: 'lasttime',
    key: 'lasttime',
  },
  {
    title: 'HW Version',
    dataIndex: 'hwver',
    key: 'hwver',
  },
  {
    title: 'Linked',
    dataIndex: 'linked',
    key: 'linked',
  },
  {
    title: 'Sync',
    dataIndex: 'sync',
    key: 'sync',
  },
  {
    title: 'Lock',
    dataIndex: 'lock',
    key: 'lock',
  },
  {
    title: 'SK Length',
    dataIndex: 'sklen',
    key: 'sklen',
  },
  {
    title: 'SKey',
    dataIndex: 'skey',
    key: 'skey',
  },
  {
    title: 'Form',
    dataIndex: 'form',
    key: 'form',
  },
  {
    title: 'Codec',
    dataIndex: 'codec',
    key: 'codec',
  },
];

class StatusTable extends GenericTable<StatusDataType> {
  getDefaultColumns(): ColumnType[] {
    return defaultColumns;
  }
}

export default StatusTable;
