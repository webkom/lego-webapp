import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import RegistrationModal from './AttendanceModal';

export default function withModal(WrappedComponent) {
  return class withModal extends Component {
    state = { modalVisible: false, selectedPool: 0 };

    toggleModal = key =>
      this.setState(state => ({
        modalVisible: !state.modalVisible,
        selectedPool: key
      }));

    render() {
      return (
        <div>
          <WrappedComponent {...this.props} toggleModal={this.toggleModal} />
          <Modal
            show={this.state.modalVisible}
            onHide={() => this.toggleModal(0)}
          >
            <RegistrationModal
              selectedPool={this.state.selectedPool}
              pools={this.props.pools}
            />
          </Modal>
        </div>
      );
    }
  };
}
