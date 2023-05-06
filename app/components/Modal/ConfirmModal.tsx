import { get } from 'lodash';
import { Component, Children, cloneElement } from 'react';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Flex from 'app/components/Layout/Flex';
import Modal from 'app/components/Modal';
import styles from './ConfirmModal.css';
import type { ComponentType, ReactElement, ReactNode } from 'react';

type ConfirmModalProps = {
  onConfirm?: () => Promise<void>;
  onCancel?: () => Promise<void>;
  message: ReactNode;
  title: string;
  disabled?: boolean;
  errorMessage?: string;
  cancelText?: string;
  confirmText?: string;
  danger?: boolean;
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
  danger = true,
}: ConfirmModalProps) => (
  <Flex column gap={15}>
    <Flex wrap alignItems="center" gap={10}>
      <Icon name="warning" className={styles.warningIcon} />
      <h2 className={danger && styles.dangerTitle}>{title}</h2>
    </Flex>
    <span>{message}</span>
    <div>
      <Button disabled={disabled} onClick={onCancel}>
        {cancelText}
      </Button>
      <Button danger={danger} disabled={disabled} onClick={onConfirm}>
        {confirmText}
      </Button>
    </div>
    {errorMessage && <p className={styles.errorMessage}>{errorMessage} </p>}
  </Flex>
);

type State = {
  modalVisible: boolean;
  working: boolean;
  errorMessage: string;
};
type WithModalProps = {
  /* Close the modal after confirm promise is resolved
   * This should only be used if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnConfirm?: boolean;

  /* Close the modal after cancel promise is resolved
   * This should only be true if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnCancel?: boolean;
  children: ReactNode;
};
export default function withModal<Props>(
  WrappedComponent: ComponentType<Props>
) {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  return class extends Component<WithModalProps & ConfirmModalProps, State> {
    static displayName = `WithModal(${displayName})`;
    state = {
      modalVisible: false,
      working: false,
      errorMessage: '',
    };
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

      const wrapAction = (
        action: () => Promise<any>,
        closeWhenDone: boolean
      ) => {
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
          <WrappedComponent
            {...(props as Record<string, any>)}
            onClick={this.toggleModal}
          />
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

const ChildrenWithProps = ({
  children,
  ...restProps
}: {
  children: ReactElement | ReactElement[];
}): ReactElement => (
  <>
    {Children.map(children, (child) => cloneElement(child, { ...restProps }))}
  </>
);

export const ConfirmModalWithParent = withModal(ChildrenWithProps);
