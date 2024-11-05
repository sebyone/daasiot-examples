/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: deviceComponentsRegistry.ts
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
import UPLCardDispositivo from '@/components/UPLCardDispositivo';

export type DeviceComponentsRegistry = {
  Default: typeof BaseCardDispositivo;
  UPL: typeof UPLCardDispositivo;
};

const deviceComponents = {
  Default: BaseCardDispositivo,
  UPL: UPLCardDispositivo,
};

export default deviceComponents;