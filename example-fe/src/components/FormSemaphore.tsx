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
