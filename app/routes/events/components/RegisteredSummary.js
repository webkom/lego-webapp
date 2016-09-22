import React from 'react';
import { Link } from 'react-router';
import Tooltip from 'app/components/Tooltip';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';

const Reg = ({ user }) => (
  <Tooltip content={user.fullName}>
    <Link to={`/users/${user.username}`} style={{ color: 'white' }}>
      {user.firstName}
    </Link>
  </Tooltip>
);

const namesList = (registrations) => (
  <FlexColumn>
    {registrations.map((reg) => (
      <FlexItem key={reg.id}>{reg.fullName}</FlexItem>
    ))}
  </FlexColumn>
);

const RegList = ({ registrations }) => (
  <Tooltip content={namesList(registrations)} list>
    {[`${registrations.length} ${registrations.length === 1 ? 'annen' : 'andre'}`]}
  </Tooltip>
);

const RegisteredSummary = ({ registrations }) => (
  <FlexRow>
    {[<Reg key={0} user={registrations[0]} />,
      ',\u00A0',
      <Reg key={1} user={registrations[1]} />,
      '\u00A0og\u00A0',
      <RegList key={2} registrations={registrations.slice(2)} />,
      '\u00A0er påmeldt']}
  </FlexRow>
);

export default RegisteredSummary;
