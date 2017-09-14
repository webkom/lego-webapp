import styles from './Registrations.css';
import React, { Component } from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import Modal from 'app/components/Modal';
import RegistrationModal from 'app/components/UserAttendance/AttendanceModal';

const Registration = ({ registration }) => (
  <Tooltip content={registration.user.fullName}>
    <Link
      to={`/users/${registration.user.username}`}
      style={{ color: 'inherit' }}
    >
      {registration.user.firstName.split(' ')[0]}
    </Link>
  </Tooltip>
);

const renderNameList = registrations => (
  <FlexColumn>
    {registrations.map(reg => (
      <FlexItem key={reg.id}>{reg.user.fullName}</FlexItem>
    ))}
  </FlexColumn>
);

const RegistrationList = ({ registrations, ...props }) => (
  <Tooltip
    content={renderNameList(registrations)}
    list
    className={styles.registrationList}
    onClick={props.onClick}
  >
    {`${registrations.length} ${registrations.length === 1
      ? 'annen'
      : 'andre'}`}
  </Tooltip>
);

class RegisteredSummary extends Component {
  state = {
    modalOpen: false
  };

  toggleModal = () => {
    this.setState({
      modalOpen: !this.state.modalOpen
    });
  };

  render() {
    const { registrations, pools, title } = this.props;
    const summary = [];

    if (registrations.length === 0) {
      summary.push('Ingen');
    } else {
      summary.push(<Registration key={0} registration={registrations[0]} />);
    }

    if (registrations.length === 2) {
      summary.push(
        '\u00A0og\u00A0',
        <Registration key={1} registration={registrations[1]} />
      );
    } else if (registrations.length >= 3) {
      summary.push(
        ',\u00A0',
        <Registration key={1} registration={registrations[1]} />,
        '\u00A0og\u00A0',
        <RegistrationList
          key={2}
          registrations={registrations.slice(2)}
          onClick={() => this.toggleModal()}
        />
      );
    }

    summary.push('\u00A0er påmeldt');

    return (
      <FlexRow className={styles.summary}>
        {summary}
        <Modal show={this.state.modalOpen} onHide={() => this.toggleModal()}>
          <RegistrationModal
            {...this.props}
            selectedPool={0}
            pools={pools}
            title={title || 'Status'}
          />
        </Modal>
      </FlexRow>
    );
  }
}

export default RegisteredSummary;
