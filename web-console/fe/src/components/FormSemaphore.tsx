/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: FormSemaphore.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { FormSemaphoreProps } from '@/types';
import React from 'react';

import { CheckCircleFilled, ExclamationCircleFilled } from '@ant-design/icons';

const FormSemaphore = ({ isDataSaved }: FormSemaphoreProps) => {
  return (
    <div>
      {isDataSaved ? (
        <CheckCircleFilled style={{ color: 'green', fontSize: '24px' }} />
      ) : (
        <ExclamationCircleFilled style={{ color: 'red', fontSize: '24px' }} />
      )}
    </div>
  );
};

export default FormSemaphore;
