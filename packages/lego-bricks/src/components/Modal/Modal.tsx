import cx from 'classnames';
import { X } from 'lucide-react';
import { forwardRef } from 'react';
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
  showCloseButton?: boolean;
};

/**
 * A styled modal component
 *
 * ### Example Usage (controlled)
 * ```tsx
 * const [isOpen, setIsOpen] = useState(false);
 * return (
 *   <>
 *     <Button onPress={() => setIsOpen(true)}>Open modal</Button>
 *     <Modal
 *       isOpen={isOpen}
 *       onOpenChange={setIsOpen}
 *       title="Modal title"
 *     >
 *       {modal content}
 *     </Modal>
 *   </>
 * );
 * ```
 *
 * ### Example Usage (uncontrolled)
 * ```tsx
 * <DialogTrigger>
 *   <Button>Open modal</Button>
 *   <Modal title="Modal title">
 *     {modal content}
 *   </Modal>
 * </DialogTrigger>
 * ```
 */
const Modal = forwardRef<HTMLElement, Props>(
  (
    {
      isOpen,
      onOpenChange,
      isDismissable = true,
      contentClassName,
      dialogRole,
      title,
      children,
      showCloseButton,
    },
    ref,
  ) => {
    return (
      <ModalOverlay
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={isDismissable}
        isKeyboardDismissDisabled={!isDismissable}
        className={styles.overlay}
      >
        <AriaModal className={cx(styles.modal, contentClassName)}>
          <Dialog role={dialogRole} data-test-id="Modal__content" ref={ref}>
            {({ close }) => (
              <>
                {title && (
                  <Heading slot="title" className={styles.title}>
                    {title}
                  </Heading>
                )}

                {showCloseButton && (
                  <Icon
                    iconNode={<X />}
                    onPress={close}
                    className={styles.closeButton}
                    data-test-id="Modal__closeButton"
                    // Fix to avoid clicking the element behind the modal when using touch devices
                    ref={(ref) =>
                      ref?.addEventListener('touchend', (e) =>
                        e.preventDefault(),
                      )
                    }
                  />
                )}
                {typeof children === 'function'
                  ? children({ close })
                  : children}
              </>
            )}
          </Dialog>
        </AriaModal>
      </ModalOverlay>
    );
  },
);
Modal.displayName = 'Modal';

export default Modal;
