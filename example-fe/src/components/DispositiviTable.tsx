import { ColumnType, DispositiviDataType } from '@/types';
import GenericTable from './generics/GenericTable';

const defaultColumns: ColumnType[] = [
  {
    title: 'Codice',
    dataIndex: 'codice',
    key: 'codice',
  },
  {
    title: 'Modello',
    dataIndex: 'modello',
    key: 'modello',
  },
  {
    title: 'Stato',
    dataIndex: 'stato',
    key: 'stato',
  },
];

class DispositiviTable extends GenericTable<DispositiviDataType> {
  getDefaultColumns(): ColumnType[] {
    return defaultColumns;
  }
}

export default DispositiviTable;
