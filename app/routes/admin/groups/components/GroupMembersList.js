// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { ROLES } from 'app/utils/constants';
import styles from './GroupMembersList.css';
import Table from 'app/components/Table';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  groupId: number,
  memberships: Array<Object>,
  removeMember: (Object) => Promise<*>,
  showDescendants: boolean,
  groupsById: { [string]: { name: string, numberOfUsers?: number } },
  fetch: ({ groupId: number, next: true }) => Promise<*>,
};

const GroupMembersList = ({
  memberships,
  groupId,
  removeMember,
  showDescendants,
  fetch,
  hasMore,
  fetching,
  groupsById,
}: Props) => {
  if (!memberships.length) {
    return <div>Ingen brukere</div>;
  }

  const GroupMembersListColumns = (fullName, membership) => {
    const { user } = membership;
    const performRemove = () =>
      confirm(`Er du sikker på at du vil melde ut ${user.fullName}?`) &&
      removeMember(membership);
    return (
      true && (
        <>
          {!showDescendants && (
            <i
              key="icon"
              className={`fa fa-times ${styles.removeIcon}`}
              onClick={performRemove}
            />
          )}
          <Link key="link" to={`/users/${user.username}`}>
            {user.fullName} ({user.username})
          </Link>
        </>
      )
    );
  };

  const GroupLinkRender = (abakusGroup) =>
    true && (
      <Link to={`/admin/groups/${abakusGroup}/members?descendants=false`}>
        {groupsById[abakusGroup] && groupsById[abakusGroup].name}
      </Link>
    );

  const RoleRender = (role: string) =>
    role !== 'member' && <span>{ROLES[role] || role} </span>;

  const EmailRender = (internalEmail: string) =>
    internalEmail && <a href={`mailto:${internalEmail}`}>{internalEmail}</a>;

  const columns = [
    {
      title: 'Navn',
      dataIndex: 'user.fullName',
      search: true,
      render: GroupMembersListColumns,
    },
    showDescendants
      ? {
          title: 'Gruppe',
          search: false,
          dataIndex: 'abakusGroup',
          render: GroupLinkRender,
        }
      : null,
    {
      title: 'Rolle',
      dataIndex: 'role',
      search: true,
      filterMapping: (role) =>
        role === 'member' || !ROLES[role] ? '' : ROLES[role],
      render: RoleRender,
    },
    {
      title: 'E-post',
      dataIndex: 'user.internalEmailAddress',
      search: false,
      render: EmailRender,
    },
  ].filter(Boolean);
  return (
    <Table
      infiniteScroll
      columns={columns}
      onLoad={() => {
        fetch({ descendants: showDescendants, groupId: groupId, next: true });
      }}
      hasMore={hasMore}
      loading={fetching}
      data={memberships}
    />
  );
};

export default GroupMembersList;
