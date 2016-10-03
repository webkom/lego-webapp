// @flow

import styles from './Registrations.css';
import React, { Component } from 'react';
import { Modal } from 'react-overlays';
import RegistrationModal from './RegistrationModal';

export type Props = {
  pools: Array<Object>,
};

class AttendanceStatus extends Component {
  props: Props;

  state = {
    modalOpen: false
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  render() {
    const { pools } = this.props;
    const lists = (pools || []).map((pool, i) => {
      return (
        <div key={i} className={styles.poolBox}>
          <strong>{pool.name}</strong>
          <a onClick={this.toggleModal}>
            <strong>{pool.registrations.length}/{pool.capacity}</strong>
          </a>
        </div>
      );
    });

    return (
      <div className={styles.attendanceBox}>
        {lists}
        <Modal
          show={this.state.modalOpen}
          onHide={this.toggleModal}
          backdropClassName={styles.backdrop}
          backdrop
        >
          <RegistrationModal pools={pools} />
        </Modal>
      </div>
    );
  }
}

export default AttendanceStatus;
