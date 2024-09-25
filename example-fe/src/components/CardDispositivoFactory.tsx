import BaseCardDispositivo from '@/components/generics/BaseCardDispositivo';
import { CardDispositivoFactoryProps } from '@/types';
import deviceComponents from '@/utils/deviceComponentsRegistry';
import React from 'react';

const CardDispositivoFactory = ({ deviceType, ...props }: CardDispositivoFactoryProps) => {
  const DeviceComponent = deviceComponents[deviceType] || BaseCardDispositivo;
  return <DeviceComponent {...props} />;
};

export default CardDispositivoFactory;
