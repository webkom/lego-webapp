import { useEffect, useState } from 'react';
import styles from './CommandPalette.module.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const CommandPaletteSettings = ({ isOpen, onClose }: Props) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [state, setState] = useState<'entering' | 'exiting'>('entering');

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setState('entering');
    } else {
      setState('exiting');
      const timeout = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className={styles.settingsDrawer}
      data-state={state}
      role="dialog"
      aria-modal={false}
    >
      <div className={styles.settingsHeader}>
        <h4>Innstillinger</h4>
        <button onClick={onClose} aria-label="Close settings">
          ✕
        </button>
      </div>
    </div>
  );
};

export default CommandPaletteSettings;
