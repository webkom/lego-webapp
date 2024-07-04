import cx from 'classnames';
import {
  Dialog,
  DialogTrigger,
  Modal,
  ModalOverlay,
} from 'react-aria-components';
import modalStyles from '../../../Modal/Modal.module.css';
import styles from './SideModal.module.css';
import type { ComponentProps, ReactNode } from 'react';

type Props = {
  side: 'right' | 'left';
  trigger: ReactNode;
  children: ComponentProps<typeof Dialog>['children'];
};
export const SideModal = ({ side, trigger, children }: Props) => (
  <DialogTrigger>
    {trigger}
    <ModalOverlay
      isDismissable={true}
      className={cx(
        modalStyles.overlay,
        side === 'left' ? styles.overlayLeft : styles.overlayRight,
      )}
    >
      <Modal
        className={cx(
          styles.modal,
          side === 'left' ? styles.modalLeft : styles.modalRight,
        )}
      >
        <Dialog>{children}</Dialog>
      </Modal>
    </ModalOverlay>
  </DialogTrigger>
);
