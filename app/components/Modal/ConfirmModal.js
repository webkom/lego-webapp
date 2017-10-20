// @flow

import styles from './ConfirmModal.css';
import Modal from 'app/components/Modal';
import * as React from 'react';
import Button from '../Button';

type Props = {
  onConfirm: () => any,
  onCancel?: () => any,
  message: string,
  title: string
};

export const ConfirmModal = ({
  message,
  onConfirm,
  onCancel,
  title
}: Props) => (
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

export default function withModal(WrappedComponent: Object) {
  return class extends React.Component {
    state = { modalVisible: false };

    toggleModal = (key: number = 0) => {
      this.setState(state => ({
        modalVisible: !state.modalVisible
      }));
    };

    render() {
      const onCancel = this.props.onCancel || (() => this.toggleModal(0));
      return (
        <div>
          <WrappedComponent {...this.props} onClick={this.toggleModal} />
          <Modal
            show={this.state.modalVisible}
            onHide={() => this.toggleModal(0)}
          >
            <ConfirmModal onCancel={onCancel} {...this.props} />
          </Modal>
        </div>
      );
    }
  };
}
const ChildrenWithProps = ({ children, ...restProps }) => (
  <div>
    {React.Children.map(children, child =>
      React.cloneElement(child, { ...restProps })
    )}
  </div>
);
export const ConfirmModalWithParent = withModal(ChildrenWithProps);
