import cx from 'classnames';
import { Modal as ReactModal } from 'react-overlays';
import { Icon } from '../Icon';
import styles from './Modal.module.css';
import type { KeyboardEvent, ReactNode } from 'react';

type Props = {
  show: boolean;
  children: ReactNode;
  onHide: () => void;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  keyboard?: boolean;
  contentClassName?: string;
  backdropClassName?: string;
};

/**
 * A wrapper around react-overlays' modal that comes with a default style, a close
 * button and support for a `closeOnBackdropClick` prop that lets you disable closing
 * on the modal when clicking on the backdrop. Particularly useful for modal
 * forms where you don't want it to close when users accidentally click outside.
 */
const Modal = ({
  show,
  children,
  onHide,
  backdrop = true,
  closeOnBackdropClick = true,
  keyboard = true,
  contentClassName,
  backdropClassName,
}: Props) => {
  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onHide();
    }
  };

  const handleBackdropKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      closeOnBackdropClick &&
      (event.key === 'Enter' || event.key === 'Escape' || event.key === ' ')
    ) {
      event.preventDefault();
      onHide();
    }
  };

  return (
    <ReactModal
      className={cx(styles.content, contentClassName, {
        [styles.show]: show,
      })}
      show={show}
      backdrop={backdrop}
      onHide={onHide}
      keyboard={keyboard}
      renderBackdrop={(props) => (
        <div
          {...props}
          className={cx(backdropClassName || styles.backdrop, {
            [styles.show]: show,
          })}
          onClick={handleBackdropClick}
          onKeyDown={handleBackdropKeyDown}
          tabIndex={closeOnBackdropClick ? 0 : undefined} // Make it focusable if clickable
          role={closeOnBackdropClick ? 'button' : undefined}
        />
      )}
      data-test-id="Modal__content"
    >
      <>
        <Icon
          name="close"
          onClick={onHide}
          className={styles.closeButton}
          data-test-id="Modal__closeButton"
        />
        {children}
      </>
    </ReactModal>
  );
};

export default Modal;
