import { ColumnType, DinDataType, MapDataType } from '@/types';
import GenericTable from './generics/GenericTable';

const defaultColumns: ColumnType[] = [
  {
    title: 'DIN',
    dataIndex: 'din',
    key: 'din',
  },
  {
    title: 'Tech',
    dataIndex: 'tech',
    key: 'tech',
  },
];

class MapTable extends GenericTable<MapDataType> {
  getDefaultColumns(): ColumnType[] {
    return defaultColumns;
  }
}

export default MapTable;
