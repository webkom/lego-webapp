// @flow

import styles from './ConfirmModal.css';
import React, { type ComponentType, type Node } from 'react';
import Modal from 'app/components/Modal';
import Button from '../Button';

type ConfirmModalProps = {
  onConfirm: () => any,
  onCancel?: () => any,
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

export default function withModal<Props>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends React.Component<ConfirmModalProps & Props, State> {
    static displayName = `WithModal(${displayName})`;
    state = { modalVisible: false };

    toggleModal = () => {
      this.setState(state => ({
        modalVisible: !state.modalVisible
      }));
    };

    render() {
      const onCancel = this.props.onCancel || this.toggleModal;
      return (
        <div>
          {/* $FlowFixMe rest props hoc behaviour */}
          <WrappedComponent {...this.props} onClick={this.toggleModal} />
          <Modal show={this.state.modalVisible} onHide={this.toggleModal}>
            <ConfirmModal onCancel={onCancel} {...this.props} />
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
