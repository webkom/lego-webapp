// @flow

import React from 'react';
import { Link } from 'react-router';
import { ROLES } from 'app/utils/constants';
import styles from './GroupMembersList.css';
import Table from 'app/components/Table';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  group: Object,
  memberships: Array<Object>,
  removeMember: Object => Promise<*>,
  fetch: ({ groupId: string, next: true }) => Promise<*>
};

const GroupMembersList = ({
  memberships,
  group,
  removeMember,
  fetch,
  hasMore,
  fetching
}: Props) => {
  if (!memberships.length) {
    return <div>Ingen brukere</div>;
  }

  const columns = [
    {
      dataIndex: 'user',
      render: (user, membership) => {
        const performRemove = () =>
          confirm(`Er du sikker på at du vil melde ut ${user.fullName}?`) &&
          removeMember(membership);
        return (
          <i
            className={`fa fa-times ${styles.removeIcon}`}
            onClick={performRemove}
          />
        );
      }
    },
    {
      title: 'Rolle',
      dataIndex: 'role',
      search: true,
      render: (role: string) =>
        role !== 'member' && <span>{ROLES[role] || role} </span>
    },
    {
      title: 'Navn',
      dataIndex: 'user.fullName',
      search: true,
      render: (fullName: string, { user }) => (
        <Link to={`/users/${user.username}`}>
          {user.fullName} ({user.username})
        </Link>
      )
    }
  ];
  return (
    <Table
      infiniteScroll
      columns={columns}
      onLoad={() => {
        fetch({ groupId: group.id, next: true });
      }}
      hasMore={hasMore}
      loading={fetching}
      data={memberships}
    />
  );
};

export default GroupMembersList;
