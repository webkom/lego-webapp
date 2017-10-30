// @flow

import React, { Component, type Node } from 'react';
import { Modal as ReactModal } from 'react-overlays';
import cx from 'classnames';
import Icon from 'app/components/Icon';
import styles from './Modal.css';

type Props = {
  children: Node,
  onHide: () => any,
  closeOnBackdropClick: boolean,
  show: boolean,
  keyboard: boolean,
  onKeyDown: (e: KeyboardEvent) => void,
  contentClassName?: string,
  backdropClassName?: string,
  backdrop?: boolean
};

/**
 * A wrapper around react-overlays's modal that comes with a default style, a close
 * button and support for a `closeOnBackdropClick` prop that lets you disable closing
 * on the modal when clicking on the backdrop. Particurlarly useful for modal
 * forms where you don't want it to close when users accidentally click outside.
 */
class Modal extends Component<Props> {
  static defaultProps = {
    closeOnBackdropClick: true,
    keyboard: true,
    onKeyDown: () => {}
  };

  modal: ?ReactModal;

  render() {
    const {
      children,
      onHide,
      closeOnBackdropClick,
      backdrop,
      show,
      ...props
    } = this.props;
    return (
      <ReactModal
        ref={ref => {
          this.modal = ref;
        }}
        backdropClassName={styles.backdrop}
        onHide={onHide}
        show={show}
        backdrop={closeOnBackdropClick ? backdrop : false}
        autoFocus={false}
        {...props}
      >
        <div>
          {!closeOnBackdropClick && this.modal && this.modal.renderBackdrop()}
          <div className={cx(styles.content, props.contentClassName)}>
            <button onClick={onHide} className={styles.closeButton}>
              <Icon name="close" />
            </button>

            {children}
          </div>
        </div>
      </ReactModal>
    );
  }
}

export { default as ConfirmModal } from './ConfirmModal';
export default Modal;
