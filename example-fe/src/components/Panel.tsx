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
