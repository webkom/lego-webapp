// @flow

import styles from './ConfirmModal.css';
import React, { type ComponentType, type Node } from 'react';
import Modal from 'app/components/Modal';
import Button from '../Button';

type ConfirmModalProps = {
  onConfirm?: () => Promise<*>,
  onCancel?: () => Promise<*>,
  autoClose?: boolean,
  message: string,
  title: string,
  children: Node
};

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  title
}: ConfirmModalProps) => (
  <div className={styles.overlay}>
    <div className={styles.confirmContainer}>
      <h2 className={styles.confirmTitle}>{title}</h2>
      <div className={styles.confirmMessage}>{message}</div>
      <div className={styles.buttonGroup}>
        <Button onClick={onCancel}>Avbryt</Button>
        <Button onClick={onConfirm}>Ja</Button>
      </div>
    </div>
  </div>
);

type State = {
  modalVisible: boolean
};

type withModalProps = {
  /* Close the modal after confirm promise is resolved*/
  closeOnConfirm?: boolean,
  /* Close the modal after cancel promise is resolved*/
  closeOnCancel?: boolean
};

export default function withModal<Props>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends React.Component<
    withModalProps & ConfirmModalProps,
    State
  > {
    static displayName = `WithModal(${displayName})`;
    state = { modalVisible: false };

    toggleModal = () => {
      this.setState(state => ({
        modalVisible: !state.modalVisible
      }));
    };

    render() {
      const {
        onConfirm = Promise.resolve(),
        onCancel = Promise.resolve(),
        message,
        title,
        closeOnCancel = true,
        closeOnConfirm = false,
        ...props
      } = this.props;

      const modalOnConfirm = () =>
        onConfirm.then(result => {
          closeOnConfirm && this.toggleModal();
          return result;
        });

      const modalOnCancel = () =>
        onCancel.then(result => {
          closeOnCancel && this.toggleModal();
          return result;
        });

      return (
        <div>
          {/* $FlowFixMe rest props hoc behaviour */}
          <WrappedComponent {...props} onClick={this.toggleModal} />
          <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
            <ConfirmModal
              onCancel={modalOnCancel}
              onConfirm={modalOnConfirm}
              {...this.props}
            />
          </Modal>
        </div>
      );
    }
  };
}

const ChildrenWithProps = ({ children, ...restProps }: { children: Node }) => (
  <div>
    {React.Children.map(children, child =>
      React.cloneElement(child, { ...restProps })
    )}
  </div>
);

export const ConfirmModalWithParent = withModal(ChildrenWithProps);
