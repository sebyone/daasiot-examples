import { DataPanelProps } from '@/types';
import { Card } from 'antd';
import FormSemaphore from './FormSemaphore';

const DataPanel = ({
  title,
  children,
  isEditing,
  showSemaphore,
  showLinkStatus,
  showAlignmentStatus,
}: DataPanelProps) => {
  const style_div = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' };
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
                Allineato: <b>Unknown</b>
              </span>
            )}
            {showSemaphore && <FormSemaphore isDataSaved={isEditing} />}
          </div>
        </div>
      }
      bordered={false}
      size="small"
      style={{ width: '100%', marginTop: 55 }}
    >
      {children}
    </Card>
  );
};

export default DataPanel;
