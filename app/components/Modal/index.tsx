import { Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Modal as ReactModal } from 'react-overlays';
import styles from './Modal.css';
import type { ReactNode } from 'react';

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
}: Props) => (
  <ReactModal
    className={cx(styles.content, contentClassName, { [styles.show]: show })}
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
        onClick={closeOnBackdropClick ? props.onClick : undefined}
      />
    )}
  >
    <>
      <Icon name="close" onClick={onHide} className={styles.closeButton} />
      {children}
    </>
  </ReactModal>
);

export default Modal;
