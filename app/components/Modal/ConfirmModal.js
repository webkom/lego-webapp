// @flow

import type { ComponentType, Node } from 'react';
import { Children, cloneElement, Component } from 'react';
import { get } from 'lodash';

import Modal from 'app/components/Modal';
import Button from '../Button';

import styles from './ConfirmModal.css';

type ConfirmModalProps = {
  onConfirm?: () => Promise<*>,
  onCancel?: () => Promise<*>,
  message: Node,
  title: string,
  disabled?: boolean,
  errorMessage?: string,
  cancelText?: string,
  confirmText?: string,
};

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  title,
  disabled = false,
  errorMessage = '',
  cancelText = 'Avbryt',
  confirmText = 'Ja',
}: ConfirmModalProps) => (
  <div className={styles.overlay}>
    <div className={styles.confirmContainer}>
      <h2 className={styles.confirmTitle}>{title}</h2>
      <div className={styles.confirmMessage}>{message}</div>
      <div className={styles.buttonGroup}>
        <Button disabled={disabled} onClick={onCancel}>
          {cancelText}
        </Button>
        <Button disabled={disabled} onClick={onConfirm}>
          {confirmText}
        </Button>
        <p style={{ color: 'red' }}>{errorMessage} </p>
      </div>
    </div>
  </div>
);

type State = {
  modalVisible: boolean,
  working: boolean,
  errorMessage: string,
};

type withModalProps = {
  /* Close the modal after confirm promise is resolved
   * This should only be used if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnConfirm?: boolean,
  /* Close the modal after cancel promise is resolved
   * This should only be true if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnCancel?: boolean,
  children: Node,
};

export default function withModal<Props>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';

  return class extends Component<withModalProps & ConfirmModalProps, State> {
    static displayName = `WithModal(${displayName})`;
    state = { modalVisible: false, working: false, errorMessage: '' };

    toggleModal = () => {
      this.setState((state) => ({
        modalVisible: !state.modalVisible,
      }));
      this.stopWorking();
      this.resetError();
    };

    hideModal = () => {
      this.setState({
        modalVisible: false,
      });
    };

    startWorking = () => {
      this.setState({
        working: true,
      });
    };

    stopWorking = () => {
      this.setState({
        working: false,
      });
    };

    setErrorMessage = (errorMessage: string) => {
      this.setState({
        errorMessage,
      });
    };

    resetError = () => {
      this.setState({
        errorMessage: '',
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

      const wrapAction = (action: () => Promise<*>, closeWhenDone: boolean) => {
        return () => {
          const onResolve = closeWhenDone
            ? (result) => {
                this.stopWorking();
                this.hideModal();
                this.resetError();
                return result;
              }
            : (result) => result;

          const onError = (error) => {
            this.stopWorking();
            const errorMessage =
              get(error, ['meta', 'errorMessage']) || 'Det skjedde en feil...';

            this.setErrorMessage(errorMessage);
            throw error;
          };

          this.resetError();
          this.startWorking();
          return action().then(onResolve, onError);
        };
      };

      const modalOnConfirm = wrapAction(onConfirm, closeOnConfirm);
      const modalOnCancel = wrapAction(onCancel, closeOnCancel);

      const { working, errorMessage } = this.state;

      return (
        <>
          <WrappedComponent {...(props: Object)} onClick={this.toggleModal} />
          <Modal
            closeOnBackdropClick={!working}
            show={this.state.modalVisible}
            onHide={this.toggleModal}
          >
            <ConfirmModal
              onCancel={modalOnCancel}
              onConfirm={modalOnConfirm}
              message={message}
              title={title}
              disabled={working}
              errorMessage={errorMessage}
            />
          </Modal>
        </>
      );
    }
  };
}

const ChildrenWithProps = ({ children, ...restProps }: { children: Node }) =>
  Children.map(children, (child) => cloneElement(child, { ...restProps }));

export const ConfirmModalWithParent = withModal(ChildrenWithProps);
