// @flow

import styles from './Registrations.css';
import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { Flex } from 'app/components/Layout';
import type { EventRegistration } from 'app/models';

type RegistrationProps = {
  registration: EventRegistration
};

const Registration = ({ registration }: RegistrationProps) => (
  <Tooltip content={registration.user.fullName}>
    <Link
      to={`/users/${registration.user.username}`}
      style={{ color: 'inherit' }}
    >
      {registration.user.firstName.split(' ')[0]}
    </Link>
  </Tooltip>
);

const renderNameList = registrations => {
  const registrationsList = registrations.slice(0, 14);
  return (
    <Flex column>
      {registrationsList.map(reg => (
        <Flex key={reg.id}>{reg.user.fullName}</Flex>
      ))}
      {registrations.length > 10 && (
        <Flex>{`og ${registrations.length - 12} andre`}</Flex>
      )}
    </Flex>
  );
};

type RegistrationListProps = {
  registrations: Array<EventRegistration>,
  onClick: () => any
};

const RegistrationList = ({
  registrations,
  onClick
}: RegistrationListProps) => (
  <Tooltip
    content={renderNameList(registrations)}
    list
    className={styles.registrationList}
    onClick={onClick}
  >
    <a href="">
      {`${registrations.length} ${registrations.length === 1
        ? 'annen'
        : 'andre'}`}
    </a>
  </Tooltip>
);

type RegisteredSummaryProps = {
  registrations: Array<EventRegistration>,
  toggleModal?: number => void
};

const RegisteredSummary = ({
  registrations,
  toggleModal
}: RegisteredSummaryProps) => {
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
        onClick={() => toggleModal && toggleModal(0)}
      />
    );
  }

  summary.push('\u00A0er påmeldt');

  return <Flex className={styles.summary}>{summary}</Flex>;
};

export default RegisteredSummary;
