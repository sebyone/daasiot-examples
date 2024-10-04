import { DeviceComponentsRegistry } from '@/utils/deviceComponentsRegistry';
import { FormInstance } from 'antd';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import React from 'react';

export type TableDataType = LinkDataType | MapDataType | DinLocalDataType | StatusDataType;

export interface DinLocalDataType {
  id?: number;
  title: string;
  sid: string | number;
  din: string | number;
  acpt_all: string;
  links: string;
  status: string;
}
export interface ActionsButtonProps {
  data: any;
  onEdit: (data: any) => void;

  onDelete: (data: any) => void;
  onOpenModal?: (data: any) => void;
  showOpenModal?: boolean;
}

export interface ColumnType<T = any> {
  title: string;
  dataIndex: string;
  key: string;
  render?: (value: any, record: T) => React.ReactNode;
  width?: number;
}

export interface GenericTableProps<T> {
  items: T[];
  columns?: ColumnType[];
  excludeColumns?: string[];
  handleClick?: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  showButton: boolean;
  rowKey: string;
  route?: AppRouterInstance;
  searchText?: string;
  handleSearchChange?: (value: string) => void;
  handleEventSearchChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  confirm: (data: any) => void;
  onRowClick: (data: T) => void;
  onEditClick: (data: any) => void;
  onOpenModal?: (data: T) => void;
  showOpenModal?: boolean;
}

export interface FormMenuProps {
  onSave?: () => void;
  onEdit?: () => void;
  onGoBack?: () => void;
  onAdd?: () => void;
  onDelete?: () => void;
  showAddButton?: boolean;
  showDetailButtons?: boolean;
  showSaveButton?: boolean;
}

export interface PanelViewProps {
  children: React.ReactNode;
  layoutStyle?: 'default' | 'singleTable' | 'formAndTable' | 'devices';
}

export interface DataPanelProps {
  title: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
  isEditing?: boolean;
  showSemaphore?: boolean;
  showLinkStatus?: boolean;
  showAlignmentStatus?: boolean;
}

export interface PanelProps {
  showAddButton?: boolean;
  showDetailButtons?: boolean;
  showSaveButtons?: boolean;
  handleAdd?: () => void;
  handleDelete?: () => void;
  handleGoBack?: () => void;
  handleEdit?: () => void;
  handleSave?: () => void;
  children: React.ReactNode;
  layoutStyle?: 'default' | 'singleTable' | 'formAndTable' | 'devices';
  form?: FormInstance;
}

export interface FormSemaphoreProps {
  isDataSaved?: boolean;
}

export interface PanelListProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  layoutStyle?: 'default' | 'singleTable' | 'formAndTable';
}

export interface DinLocalFormProps {
  form: FormInstance;
  onFinish?: (values: ConfigFormData) => void;
  onStart?: () => void;
  setIsDataSaved: (status: boolean) => void;
  autoStart?: boolean;
  setAutoStart?: (checked: boolean) => void;
  showEnabledCheckBox: boolean;
  showAcceptAllCheckBox: boolean;
  showPowerActions: boolean;
  showSaveButton: boolean;
  showStatus: boolean;
  statusData?: StatusDataType | null;
}
export interface ConfigFormData {
  id: number;
  title: string;
  din_id: string;
  acpt_all: boolean;
  enable: boolean;
  sid: string;
  din: string;
  profileR: string;
  profileE: string;
  profileS: string;
  skey: string;
  links: LinkDataType[];
  maps: MapDataType[];
}

export interface ConfigData {
  id: number;
  title: string;
  din_id: string;
  acpt_all: boolean;
  enable: boolean;
  din: {
    id: string;
    sid: string;
    din: string;
    p_res: string;
    skey: string;
  };
}

export interface LinkFormProps {
  form: FormInstance;
  onFinish: (values: LinkDataType) => void;
  setIsDataSaved: (status: boolean) => void;
  networkTech: number | null;
  setNetworkTech: (tech: number) => void;
}

export interface MapFormProps {
  form: FormInstance;
  onFinish: (values: DinFormData) => void;
  setIsDataSaved: (status: boolean) => void;
}

export interface LinkDataType {
  id?: number;
  link: number;
  din_id_din?: number;
  url: string;
  ipAddress?: string;
  port?: string;
}

export interface LinkFormData {
  id: number;
  link: string;
  uri: string;
}

export interface StatusDataType {
  lasttime: number;
  hwver: number;
  linked: number;
  sync: number;
  lock: number;
  sklen?: number;
  skey?: string;
  form?: number;
  codec?: number;
}

export interface DinDataType {
  id?: number;
  sid: string;
  din: string;
  p_res: string;
  skey: string;
}
export interface DinFormData {
  din: {
    sid: number;
    din: number;
    p_res: string;
    skey: string;
  };
}

export interface MapDataType {
  id?: number;
  din: string;
  tech: string;
}

export interface CardDispositivoProps {
  status: boolean;
  setStatus: (enabled: boolean) => void;
  onChangeComplete: (value: number | number[]) => void;
  onChange: (status: boolean) => void;
  onSend: () => void;
}

export interface ModalDispositivoProps {
  isVisible: boolean;
  onClose: () => void;
  data: MapDataType;
  status: boolean;
  setStatus: (enabled: boolean) => void;
  onChangeComplete: (value: number | number[]) => void;
  onChange: (status: boolean) => void;
  onSend: () => void;
}

export interface Device {
  id: number;
  device_model_id: number;
  din_id: number;
  name: string;
  latitude: number;
  longitude: number;
  device_model: {
    id: number;
    device_group_id: number;
    description: string;
    serial: string;
    link_image: string;
    link_datasheet: string;
    link_userguide: string;
  };
  din: {
    id?: number;
    sid: string;
    din: string;
    p_res: string;
    skey: string;
  };
}

export interface NodoFormProps {
  form: FormInstance;
  onFinish: (values: Device) => void;
  setIsDataSaved: (status: boolean) => void;
  readOnly: boolean;
}

export interface BaseCardDispositivoProps {
  deviceName: string;
  dinOptions: number[];
  selectedDin: number | null;
  setSelectedDin: (din: number | null) => void;
  onTest: () => void;
  status: boolean;
  setStatus: (status: boolean) => void;
  value: number;
  setValue: (value: number) => void;
  showTestControl: boolean;
  onSend: () => void;
  options?: { label: string; value: number }[];
  children?: React.ReactNode;
}

export interface CardDispositivoFactoryProps {
  deviceType: keyof DeviceComponentsRegistry;
  deviceName: string;
  dinOptions: number[];
  selectedDin: number | null;
  setSelectedDin: (din: number | null) => void;
  onTest: () => void;
  onSend: () => void;
  status: boolean;
  setStatus: (status: boolean) => void;
  value: number;
  setValue: (value: number) => void;
  showTestControl: boolean;
}

export interface UPLDispositivoCardProps extends BaseCardDispositivoProps {
  status: boolean;
  setStatus: (status: boolean) => void;
  value: number;
  setValue: (value: number) => void;
  showTestControl: boolean;
}
