// @flow

import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import RegistrationModal from './AttendanceModal';
import styles from './AttendanceStatus.css';

export type Props = {
  pools: Array<Object>
};

class AttendanceStatus extends Component {
  props: Props;

  state = {
    modalOpen: false,
    selectedPool: 0
  };

  toggleModal = key => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedPool: key
    });
  };

  render() {
    const { pools } = this.props;
    const lists = (pools || []).map((pool, i) => {
      const capacity = pool.capacity ? pool.capacity : '∞';
      return (
        <div key={i} className={styles.poolBox}>
          <strong>{pool.name}</strong>
          <a onClick={() => this.toggleModal(i)}>
            <strong>
              {pool.registrations ? (
                `${pool.registrations.length}/${capacity}`
              ) : (
                `0/${capacity}`
              )}
            </strong>
          </a>
        </div>
      );
    });

    return (
      <div className={styles.attendanceBox}>
        {lists}
        <Modal show={this.state.modalOpen} onHide={() => this.toggleModal(0)}>
          <RegistrationModal
            {...this.props}
            selectedPool={this.state.selectedPool + 1}
            pools={pools}
          />
        </Modal>
      </div>
    );
  }
}

export default AttendanceStatus;
