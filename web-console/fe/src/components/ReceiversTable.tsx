/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ReceiversTable.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ColumnType, DinLocalDataType } from '@/types';
import GenericTable from './generics/GenericTable';

const defaultColumns: ColumnType[] = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
  },
  {
    title: 'SID',
    dataIndex: 'sid',
    key: 'sid',
  },
  {
    title: 'DIN',
    dataIndex: 'din',
    key: 'din',
  },
  {
    title: 'Acp. All',
    dataIndex: 'acpt_all',
    key: 'acpt_all',
  },
  {
    title: 'Links',
    dataIndex: 'links',
    key: 'links',
    render: (links: string) => links,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
];

class ReceiversTable extends GenericTable<DinLocalDataType> {
  getDefaultColumns(): ColumnType[] {
    return defaultColumns;
  }
}

export default ReceiversTable;
