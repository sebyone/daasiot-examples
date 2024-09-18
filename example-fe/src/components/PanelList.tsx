import { PanelListProps } from '@/types';
import './components.css';

const PanelList = ({ children, layoutStyle }: PanelListProps) => {
  const containerClass = `panel-content-list ${layoutStyle}`;
  return (
    <>
      <div className={containerClass}>{children}</div>
      <div className="mobile-message">Questo contenuto non è disponibile sui dispositivi mobile.</div>
    </>
  );
};

export default PanelList;
