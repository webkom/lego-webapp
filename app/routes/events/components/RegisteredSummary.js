import styles from './Registrations.css';
import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';

const Registration = ({ registration }) => (
  <Tooltip content={registration.user.fullName}>
    <Link to={`/users/${registration.user.username}`} style={{ color: 'white' }}>
      {registration.user.firstName.split(' ')[0]}
    </Link>
  </Tooltip>
);

const renderNameList = (registrations) => (
  <FlexColumn>
    {registrations.map((reg) => {
      return <FlexItem key={reg.id}>{reg.user.fullName}</FlexItem>;
    })}
  </FlexColumn>
);

const RegistrationList = ({ registrations }) => (
  <Tooltip content={renderNameList(registrations)} list>
    {`${registrations.length} ${registrations.length === 1 ? 'annen' : 'andre'}`}
  </Tooltip>
);

const RegisteredSummary = ({ registrations }) => {
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
      <RegistrationList key={2} registrations={registrations.slice(2)} />
    );
  }

  summary.push('\u00A0er påmeldt');

  return (
    <FlexRow className={styles.summary}>
      {summary}
    </FlexRow>
  );
};

export default RegisteredSummary;
