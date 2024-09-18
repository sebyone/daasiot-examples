import { DataPanelProps } from '@/types';
import { Card } from 'antd';
import FormSemaphore from './FormSemaphore';

const DataPanel = ({ title, children, isEditing, showSemaphore }: DataPanelProps) => {
  const style_div = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0' };
  return (
    <Card
      title={
        <div style={style_div}>
          <span>{title}</span>
          {showSemaphore && <FormSemaphore isDataSaved={isEditing} />}
        </div>
      }
      bordered={false}
      size="small"
      style={{ width: '100%', marginTop: 25 }}
    >
      {children}
    </Card>
  );
};

export default DataPanel;
