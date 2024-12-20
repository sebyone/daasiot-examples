/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: DataPanel.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { DataPanelProps } from '@/types';
import { CheckCircleFilled, QuestionCircleFilled, WarningOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import FormSemaphore from './FormSemaphore';

const DataPanel = ({
  title,
  children,
  isEditing,
  showSemaphore,
  showLinkStatus,
  showAlignmentStatus,
  alignment,
}: DataPanelProps) => {
  const style_div = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0',
  };
  const style_status = {
    display: 'flex',
    gap: '20px',
  };

  return (
    <Card
      title={
        <div style={style_div}>
          <span>{title}</span>
          <div style={style_status}>
            {showLinkStatus && (
              <span>
                Link: <b>online</b>
              </span>
            )}
            {showAlignmentStatus && (
              <span>
                Allineamento:{' '}
                <p>
                  {alignment === 'Disallineato' ? (
                    <>
                      {alignment} <WarningOutlined style={{ color: '#faad14' }} />
                    </>
                  ) : alignment === 'Allineato' ? (
                    <>
                      {alignment} <CheckCircleFilled style={{ color: '#52c41a' }} />
                    </>
                  ) : (
                    <>
                      {alignment} <QuestionCircleFilled style={{ color: '#8c8c8c', fontSize: '1rem' }} />
                    </>
                  )}
                </p>
              </span>
            )}
            {showSemaphore && <FormSemaphore isDataSaved={isEditing} />}
          </div>
        </div>
      }
      bordered={false}
      size="small"
      style={{ width: '100%', marginTop: 55, marginLeft: 10 }}
    >
      {children}
    </Card>
  );
};

export default DataPanel;
