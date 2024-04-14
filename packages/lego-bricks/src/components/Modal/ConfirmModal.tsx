import { useState } from 'react';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Flex } from '../Layout';
import styles from './ConfirmModal.module.css';
import { Modal } from './index';
import type { ReactNode } from 'react';

type ConfirmModalContentProps = {
  onConfirm?: () => Promise<unknown> | void;
  onCancel?: () => Promise<unknown> | void;
  message: ReactNode;
  title: string;
  disabled?: boolean;
  errorMessage?: string;
  cancelText?: string;
  confirmText?: string;
  danger?: boolean;
};

const ConfirmModalContent = ({
  message,
  onConfirm,
  onCancel,
  title,
  disabled = false,
  errorMessage,
  cancelText = 'Avbryt',
  confirmText = 'Ja',
  danger = true,
}: ConfirmModalContentProps) => (
  <Flex column gap={15}>
    <Flex wrap alignItems="center" gap={10}>
      <Icon name="warning" className={styles.warningIcon} />
      <h2 className={danger ? styles.dangerTitle : undefined}>{title}</h2>
    </Flex>
    <span>{message}</span>
    <div>
      <Button flat disabled={disabled} onClick={onCancel}>
        {cancelText}
      </Button>
      <Button danger={danger} disabled={disabled} onClick={onConfirm}>
        {confirmText}
      </Button>
    </div>
    {errorMessage && <p className={styles.errorMessage}>{errorMessage} </p>}
  </Flex>
);

type ConfirmModalProps = {
  onConfirm?: () => Promise<unknown> | void;
  onCancel?: () => Promise<unknown> | void;

  /* Close the modal after confirm promise is resolved
   * This should only be used if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnConfirm?: boolean;

  /* Close the modal after cancel promise is resolved
   * This should only be true if the component isn't automatically
   * unmounted when the given promise resolves */
  closeOnCancel?: boolean;

  children: (props: { openConfirmModal: () => void }) => ReactNode;

  // The following props are only passed on to ConfirmModalContent
  message: ReactNode;
  title: string;
  cancelText?: string;
  confirmText?: string;
  danger?: boolean;
};

const ConfirmModal = ({
  onConfirm = async () => {},
  onCancel = async () => {},
  closeOnCancel = true,
  closeOnConfirm = false,
  children,
  ...contentProps
}: ConfirmModalProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [working, setWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();

  const wrapAction = <T,>(
    action: () => T | Promise<T>,
    closeWhenDone: boolean,
  ) => {
    return async () => {
      setErrorMessage(undefined);
      setWorking(true);

      try {
        const result = await action();
        if (closeWhenDone) {
          setWorking(false);
          setModalVisible(false);
          setErrorMessage(undefined);
        }
        return result;
      } catch (error) {
        setWorking(false);
        setErrorMessage(
          (error as { meta?: { errorMessage: string } })?.meta?.errorMessage ||
            'Det skjedde en feil...',
        );
        throw error;
      }
    };
  };

  const modalOnConfirm = wrapAction(onConfirm, closeOnConfirm);
  const modalOnCancel = wrapAction(onCancel, closeOnCancel);

  return (
    <>
      {children({ openConfirmModal: () => setModalVisible(true) })}
      <Modal
        closeOnBackdropClick={!working}
        show={modalVisible}
        onHide={() => setModalVisible(false)}
      >
        <ConfirmModalContent
          onConfirm={modalOnConfirm}
          onCancel={modalOnCancel}
          disabled={working}
          errorMessage={errorMessage}
          {...contentProps}
        />
      </Modal>
    </>
  );
};

export default ConfirmModal;
