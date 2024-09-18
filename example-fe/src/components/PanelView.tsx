import { PanelViewProps } from '@/types';
import './components.css';

const PanelView = ({ children, layoutStyle }: PanelViewProps) => {
  const containerClass = `panel-content-view ${layoutStyle}`;
  return (
    <>
      <div className={containerClass}>{children}</div>
      <div className="mobile-message">Questo contenuto non è disponibile sui dispositivi mobile.</div>
    </>
  );
};

export default PanelView;
