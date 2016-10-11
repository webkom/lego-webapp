
// @flow

import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import UserlistModal from './UserlistModal';
import styles from './AttendanceStatus.css';

export type Props = {
  pools: Array<Object>,
};

class AttendanceStatus extends Component {
  state = {
    modalOpen: false
  };

  props: Props;

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
        >
          <UserlistModal pools={pools} />
        </Modal>
      </div>
    );
  }
}

export default AttendanceStatus;
