import { ColumnType, LinkDataType } from '@/types';
import GenericTable from './generics/GenericTable';

const defaultColumns: ColumnType[] = [
  {
    title: 'Link',
    dataIndex: 'link',
    key: 'link',
  },
  {
    title: 'URI',
    dataIndex: 'url',
    key: 'url',
  },
];

class LinkTable extends GenericTable<LinkDataType> {
  getDefaultColumns(): ColumnType[] {
    return defaultColumns;
  }
}

export default LinkTable;
