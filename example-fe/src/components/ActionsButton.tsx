/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: ActionsButton.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { ActionsButtonProps } from '@/types';
import { DeleteFilled, EditFilled, SelectOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import React from 'react';

const ActionsButton = ({ data, onEdit, onDelete, onOpenModal, showOpenModal }: ActionsButtonProps) => {
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

  const handleOpenModal = (e: React.MouseEvent | undefined) => {
    if (onOpenModal) {
      e?.stopPropagation();
      e?.preventDefault();
      onOpenModal(data);
    }
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
      {showOpenModal && <SelectOutlined onClick={handleOpenModal} style={{ marginLeft: -20 }} />}
    </div>
  );
};

export default ActionsButton;
