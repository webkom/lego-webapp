import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';

const Registration = ({ user }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`} style={{ color: 'white' }}>
      {user.firstName}
    </Link>
  </Tooltip>
);

const nameList = (registrations) => (
  <FlexColumn>
    {registrations.map((reg) => (
      <FlexItem key={reg.id}>{reg.fullName}</FlexItem>
    ))}
  </FlexColumn>
);

const RegistrationList = ({ registrations }) => (
  <Tooltip content={nameList(registrations)} list>
    {`${registrations.length} ${registrations.length === 1 ? 'annen' : 'andre'}`}
  </Tooltip>
);

const RegisteredSummary = ({ registrations }) => (
  <FlexRow>
    {[<Registration key={0} user={registrations[0]} />,
      ',\u00A0',
      <Registration key={1} user={registrations[1]} />,
      '\u00A0og\u00A0',
      <RegistrationList key={2} registrations={registrations.slice(2)} />,
      '\u00A0er påmeldt']}
  </FlexRow>
);

export default RegisteredSummary;
