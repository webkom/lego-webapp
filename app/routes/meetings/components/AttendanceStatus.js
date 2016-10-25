
// @flow

import React, { Component } from 'react';
import Modal from 'app/components/Modal';
import UserlistModal from './UserlistModal';
import styles from './AttendanceStatus.css';

export type Props = {
  pools: Array<Object>,
};

export default class AttendanceStatus extends Component {
  props: Props;

  state = {
    modalOpen: false,
    selectedPool: 0
  };

  toggleModal = (key) => {
    this.setState({
      modalOpen: !this.state.modalOpen,
      selectedPool: key
    });
  };

  render() {
    const { pools } = this.props;
    const lists = (pools || []).map((pool, i) => {
      return (
        <div key={i} className={styles.poolBox}>
          <strong>{pool.name}</strong>
          <a onClick={this.toggleModal.bind(this, i)}>
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
          onHide={this.toggleModal.bind(this, 0)}
        >
          <UserlistModal selectedPool={this.state.selectedPool} pools={pools} />
        </Modal>
      </div>
    );
  }
}
