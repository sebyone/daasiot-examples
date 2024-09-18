import { FormMenuProps } from '@/types';
import { Button } from 'antd';
import './components.css';

const FormMenu = ({
  onGoBack,
  onSave,
  onDelete,
  onEdit,
  onAdd,
  showAddButton,
  showDetailButtons,
  showSaveButton,
}: FormMenuProps) => {
  const style = {
    display: 'flex',
    gap: '7px',
    marginTop: '-7px',
  };

  const handleGoBack = () => {
    onGoBack?.();
  };

  const handleEdit = () => {
    onEdit?.();
  };

  const handleAdd = () => {
    onAdd?.();
  };

  const handleSave = () => {
    onSave?.();
  };

  const handleDelete = () => {
    onDelete?.();
  };

  return (
    <div style={style}>
      {showAddButton && (
        <Button type="primary" onClick={handleAdd}>
          Aggiungi
        </Button>
      )}
      {showDetailButtons && (
        <>
          <Button type="primary" onClick={handleGoBack}>
            Indietro
          </Button>
          <Button type="primary" onClick={handleEdit}>
            Modifica
          </Button>
          <Button type="primary" onClick={handleDelete}>
            Elimina
          </Button>
        </>
      )}
      {showSaveButton && (
        <>
          <Button type="primary" onClick={handleGoBack}>
            Indietro
          </Button>
          <Button type="primary" onClick={handleSave}>
            Salva
          </Button>
        </>
      )}
    </div>
  );
};

export default FormMenu;
