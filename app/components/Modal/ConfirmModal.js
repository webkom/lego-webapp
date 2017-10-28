// @flow

import styles from './ConfirmModal.css';
import React, { type ComponentType, type Node } from 'react';
import Modal from 'app/components/Modal';
import Button from '../Button';

type ConfirmModalProps = {
  onConfirm?: () => Promise<*>,
  onCancel?: () => Promise<*>,
  message: string,
  title: string,
  disabled?: boolean
};

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  title,
  disabled = false
}: ConfirmModalProps) => (
  <div className={styles.overlay}>
    <div className={styles.confirmContainer}>
      <h2 className={styles.confirmTitle}>{title}</h2>
      <div className={styles.confirmMessage}>{message}</div>
      <div className={styles.buttonGroup}>
        <Button disabled={disabled} onClick={onCancel}>
          Avbryt
        </Button>
        <Button disabled={disabled} onClick={onConfirm}>
          Ja
        </Button>
      </div>
    </div>
  </div>
);

type State = {
  modalVisible: boolean,
  working: boolean
};

type withModalProps = {
  /* Close the modal after confirm promise is resolved*/
  closeOnConfirm?: boolean,
  /* Close the modal after confirm promise is resolved*/
  closeOnCancel?: boolean,
  children: Node
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
    state = { modalVisible: false, working: false };

    toggleModal = () => {
      this.setState(state => ({
        modalVisible: !state.modalVisible
      }));
    };

    startWorking = () => {
      this.setState({
        working: true
      });
    };

    stopWorking = () => {
      this.setState({
        working: false
      });
    };

    render() {
      const {
        onConfirm = () => Promise.resolve(),
        onCancel = () => Promise.resolve(),
        message,
        title,
        closeOnCancel = true,
        closeOnConfirm = false,
        ...props
      } = this.props;

      const modalOnConfirm = () => {
        this.startWorking();
        return onConfirm().then(result => {
          this.stopWorking();
          closeOnConfirm && this.state.modalVisible && this.toggleModal();
          return result;
        });
      };

      const modalOnCancel = () => {
        this.startWorking();
        return onCancel().then(result => {
          this.stopWorking();
          closeOnCancel && this.state.modalVisible && this.toggleModal();
          return result;
        });
      };

      return [
        <WrappedComponent key={0} {...props} onClick={this.toggleModal} />,
        <Modal key={1} show={this.state.modalVisible} onHide={this.toggleModal}>
          <ConfirmModal
            onCancel={modalOnCancel}
            onConfirm={modalOnConfirm}
            message={message}
            title={title}
            disabled={this.state.working}
          />
        </Modal>
      ];
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
