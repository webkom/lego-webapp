// @flow

import React from 'react';
import sortBy from 'lodash/sortBy';
import { Link } from 'react-router';
import { ROLES } from 'app/utils/constants';
import styles from './GroupMembersList.css';

type Props = {
  memberships: Array<Object>,
  removeMember: Object => Promise<*>
};

// Show members last in the list:
const SORT_ORDER = ['member', 'treasurer', 'co-leader', 'leader'];

const GroupMembersList = ({ memberships, removeMember }: Props) => {
  if (!memberships.length) {
    return <div>Ingen brukere</div>;
  }

  const sorted = sortBy(memberships, ({ role }) =>
    SORT_ORDER.indexOf(role)
  ).reverse();
  return (
    <ul>
      {sorted.map(membership => {
        const { user, role } = membership;
        const performRemove = () =>
          confirm(`Er du sikker på at du vil melde ut ${user.fullName}?`) &&
          removeMember(membership);

        return (
          <li key={user.username}>
            <i
              className={`fa fa-times ${styles.removeIcon}`}
              onClick={performRemove}
            />
            {role !== 'member' && <span>{ROLES[role] || role}: </span>}
            <Link to={`/users/${user.username}`}>
              {user.fullName} ({user.username})
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

export default GroupMembersList;
