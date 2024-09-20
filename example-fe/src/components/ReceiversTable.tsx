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
