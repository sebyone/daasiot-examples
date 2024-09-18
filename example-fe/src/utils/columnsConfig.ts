import { ColumnType } from '@/types';

export const columnsByPage: { [key: string]: ColumnType[] } = {
  NewAmbiente: [
    { title: 'Elemento (modello)', dataIndex: 'modello', key: 'modello' },
    { title: 'Impianto', dataIndex: 'impianto', key: 'impianto' },
    { title: 'Dispositivi', dataIndex: 'dispositivi', key: 'dispositivi' },
  ],
  Dispositivo: [
    {
      title: '#',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Modello',
      dataIndex: 'modello',
      key: 'modello',
    },
    {
      title: 'Din',
      dataIndex: 'din',
      key: 'din',
    },
    {
      title: 'Elementi',
      dataIndex: 'elementi',
      key: 'elementi',
    },
  ],
};
