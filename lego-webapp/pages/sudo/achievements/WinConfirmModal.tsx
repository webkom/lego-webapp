import { HelpCircle } from 'lucide-react';
import win95 from './win95.module.css';

export const WinConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className={win95.fakeErrorOverlay}>
    <div className={win95.fakeErrorWindow}>
      <div className={win95.titleBar}>
        <span>{title}</span>
        <div className={win95.titleBarButtons}>
          <button className={win95.titleBarButton} onClick={onCancel}>
            ✕
          </button>
        </div>
      </div>
      <div className={win95.fakeErrorBody}>
        <HelpCircle size={28} className={win95.confirmIcon} />
        <p className={win95.fakeErrorMessage}>{message}</p>
      </div>
      <div className={win95.fakeErrorFooter}>
        <button className={win95.winButton} onClick={onConfirm}>
          Ja
        </button>
        <button className={win95.winButton} onClick={onCancel}>
          Nei
        </button>
      </div>
    </div>
  </div>
);
