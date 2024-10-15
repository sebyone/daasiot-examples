/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: FormFieldSet.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { Divider } from 'antd';
import React, { ReactNode } from 'react';

const FormFieldSet = ({ title, children }: { title: string; children: ReactNode }) => {
  const styleDivider = { marginTop: '1px', marginBottom: '4px', backgroundColor: 'blue' };
  return (
    <div style={{ marginBottom: '-15px' }}>
      <div className="title">{title}</div>
      <Divider style={styleDivider} />
      <div className="children">{children}</div>
    </div>
  );
};

export default FormFieldSet;
