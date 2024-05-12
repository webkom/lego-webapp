import cx from 'classnames';
import {
  Dialog,
  Heading,
  Modal as AriaModal,
  ModalOverlay,
} from 'react-aria-components';
import { Icon } from '../Icon';
import styles from './Modal.module.css';
import type { ReactNode } from 'react';

type Props = {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  isDismissable?: boolean;
  contentClassName?: string;
  dialogRole?: 'dialog' | 'alertdialog';
  title?: ReactNode;
  children: ReactNode | ((opts: { close: () => void }) => ReactNode);
};

const Modal = ({
  isOpen,
  onOpenChange,
  isDismissable = true,
  contentClassName,
  dialogRole,
  title,
  children,
}: Props) => {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={!isDismissable}
      className={styles.overlay}
    >
      <AriaModal className={cx(styles.modal, contentClassName)}>
        <Dialog role={dialogRole} data-test-id="Modal__content">
          {({ close }) => (
            <>
              {title && (
                <Heading slot="title" className={styles.title}>
                  {title}
                </Heading>
              )}
              <Icon
                name="close"
                onClick={close}
                className={styles.closeButton}
                data-test-id="Modal__closeButton"
              />
              {typeof children === 'function' ? children({ close }) : children}
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
};

export default Modal;
