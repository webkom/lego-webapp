import React from 'react';
import { Link } from 'react-router';
import { ROLES } from '../utils';
import sortBy from 'lodash/sortBy';

type Props = {
  memberships: Array<Object>
};

// Show members last in the list:
const SORT_ORDER = ['member', 'treasurer', 'co-leader', 'leader'];

const GroupMembersList = ({ memberships }: Props) => {
  if (!memberships.length) {
    return <div>Ingen brukere</div>;
  }

  const sorted = sortBy(memberships, ({ role }) =>
    SORT_ORDER.indexOf(role)
  ).reverse();
  return (
    <ul>
      {sorted.map(({ role, user }) => (
        <li key={user.username}>
          {role !== 'member' && <span>{ROLES[role]}: </span>}
          <Link to={`/users/${user.username}`}>
            {user.firstName} {user.lastName} ({user.username})
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default GroupMembersList;
