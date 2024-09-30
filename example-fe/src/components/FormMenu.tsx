import { FormMenuProps } from '@/types';
import { Button } from 'antd';

import { useTranslations } from 'next-intl';
import './components.css';

export default function FormMenu({
  onGoBack,
  onSave,
  onDelete,
  onEdit,
  onAdd,
  showAddButton,
  showDetailButtons,
  showSaveButton,
}: FormMenuProps) {
  const style = {
    display: 'flex',
    gap: '7px',
    marginTop: '-7px',
  };

  const t = useTranslations('FormMenu');

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
          {t('add')}
        </Button>
      )}
      {showDetailButtons && (
        <>
          <Button type="primary" onClick={handleGoBack}>
            {t('back')}
          </Button>
          <Button type="primary" onClick={handleEdit}>
            {t('edit')}
          </Button>
          <Button type="primary" onClick={handleDelete}>
            {t('delete')}
          </Button>
        </>
      )}
      {showSaveButton && (
        <>
          <Button type="primary" onClick={handleGoBack}>
            {t('back')}
          </Button>
          <Button type="primary" onClick={handleSave}>
            {t('save')}
          </Button>
        </>
      )}
    </div>
  );
}
