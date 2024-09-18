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
