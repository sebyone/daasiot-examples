import BaseCardDispositivo from '@/components/generics/BaseCardDispositivo';
import UPLCardDispositivo from '@/components/UPLCardDispositivo';
import { ComponentType } from 'react';

export type DeviceComponentsRegistry = {
  Default: typeof BaseCardDispositivo;
  UPL: typeof UPLCardDispositivo;
};

const deviceComponents = {
  Default: BaseCardDispositivo,
  UPL: UPLCardDispositivo,
};

export default deviceComponents;
