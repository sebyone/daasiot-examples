/*
 * DaaS-nodejs 2024 (@) Sebyone Srl
 *
 * File: Panel.tsx
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 * This Source Code Form is "Incompatible With Secondary Licenses", as defined by the MPL v.2.0.
 *
 * Contributors:
 * francescopantusa98@gmail.com - initial implementation
 *
 */
import { PanelProps } from '@/types';
import FormMenu from './FormMenu';

import { createPortal } from 'react-dom';

const Panel = ({
  showAddButton,
  showDetailButtons,
  showSaveButtons,
  handleAdd,
  handleDelete,
  handleGoBack,
  handleEdit,
  handleSave,
  children,
  layoutStyle,
}: PanelProps) => {
  const containerClass = `flex-container ${layoutStyle}`;
  const formMenuPortal = document.getElementById('form-menu-portal');

  return (
    <>
      {formMenuPortal &&
        createPortal(
          <FormMenu
            onEdit={handleEdit}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onGoBack={handleGoBack}
            onSave={handleSave}
            showAddButton={showAddButton}
            showDetailButtons={showDetailButtons}
            showSaveButton={showSaveButtons}
          />,
          formMenuPortal
        )}
      <div className={containerClass}>{children}</div>
    </>
  );
};
export default Panel;
