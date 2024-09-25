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
