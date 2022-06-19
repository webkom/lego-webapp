// @flow

import { Modal as ReactModal } from 'react-overlays';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Modal.css';

type Props = {
  show: boolean,
  children: React$Node,
  onHide: () => any,
  backdrop?: boolean,
  closeOnBackdropClick?: boolean,
  keyboard?: boolean,
  contentClassName?: string,
  backdropClassName?: string,
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
    show={show}
    backdrop={backdrop}
    onHide={onHide}
    keyboard={keyboard}
    renderBackdrop={(props: { onClick: Function }) => (
      <div
        {...props}
        className={backdropClassName || styles.backdrop}
        onClick={closeOnBackdropClick ? props.onClick : null}
      />
    )}
  >
    <div className={cx(styles.content, contentClassName)}>
      <button onClick={onHide} className={styles.closeButton}>
        <Icon name="close" />
      </button>

      {children}
    </div>
  </ReactModal>
);

export { default as ConfirmModal } from './ConfirmModal';
export default Modal;
