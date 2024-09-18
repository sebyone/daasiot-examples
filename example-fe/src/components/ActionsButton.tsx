import { ActionsButtonProps } from '@/types';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import React from 'react';

const ActionsButton = ({ data, onEdit, onDelete }: ActionsButtonProps) => {
  const handleStopPropagation = (e: React.MouseEvent | undefined) => {
    e?.stopPropagation();
    e?.preventDefault();
  };
  const handleEditClick = () => {
    onEdit(data);
  };

  const handleDeleteClick = (e: React.MouseEvent | undefined) => {
    e?.stopPropagation();
    e?.preventDefault();
    onDelete(data);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <EditFilled onClick={handleEditClick} />
      <Popconfirm
        title="Sei sicuro di voler eliminare?"
        description="Verranno eliminate anche tutte le corrispondenti associazioni!"
        onConfirm={handleDeleteClick}
        onCancel={handleStopPropagation}
        okText="Si"
        okType="danger"
        cancelText="No"
      >
        <DeleteFilled style={{ color: 'red', margin: 12 }} onClick={handleStopPropagation} />
      </Popconfirm>
    </div>
  );
};

export default ActionsButton;
