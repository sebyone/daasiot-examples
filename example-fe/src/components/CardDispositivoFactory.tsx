/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: CardDispositivoFactory.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import BaseCardDispositivo from '@/components/generics/BaseCardDispositivo';
import { CardDispositivoFactoryProps } from '@/types';
import deviceComponents from '@/utils/deviceComponentsRegistry';
import React from 'react';

const CardDispositivoFactory = ({ deviceType, ...props }: CardDispositivoFactoryProps) => {
  const DeviceComponent = deviceComponents[deviceType] || BaseCardDispositivo;
  return <DeviceComponent {...props} />;
};

export default CardDispositivoFactory;
