import { Drawer as VaulDrawer } from 'vaul';
import styles from './Drawer.module.css';
import type { ReactNode } from 'react';

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: ReactNode;
}

export const Drawer = ({ isOpen, onOpenChange, title, children }: Props) => {
  return (
    <VaulDrawer.Root open={isOpen} onOpenChange={onOpenChange}>
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.overlay} />
        <VaulDrawer.Content className={styles.content} aria-describedby={title}>
          <VaulDrawer.Handle className={styles.handle} />
          <VaulDrawer.Title>{title}</VaulDrawer.Title>
          {children}
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    </VaulDrawer.Root>
  );
};
