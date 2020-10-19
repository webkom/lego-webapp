// @flow

import * as React from 'react';
import { Link } from 'react-router-dom';
import { ROLES } from 'app/utils/constants';
import styles from './GroupMembersList.css';
import Table from 'app/components/Table';
import qs from 'qs';

type Props = {
  fetching: boolean,
  hasMore: boolean,
  groupId: number,
  memberships: Array<Object>,
  removeMember: (Object) => Promise<*>,
  showDescendants: boolean,
  groupsById: { [string]: { name: string, numberOfUsers?: number } },
  fetch: ({ groupId: number, next: true }) => Promise<*>,
  push: (any) => void,
  pathname: string,
  search: string,
  query: Object,
  filters: Object,
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
  push,
  pathname,
  search,
  query,
  filters,
}: Props) => {
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
            {user.username}
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

  const columns = [
    {
      title: 'Brukernavn',
      dataIndex: 'user.username',
      search: true,
      inlineFiltering: false,
      render: GroupMembersListColumns,
    },
    {
      title: 'Navn',
      dataIndex: 'user.fullName',
      search: true,
      inlineFiltering: false,
    },
    showDescendants
      ? {
          title: 'Gruppe',
          search: true,
          inlineFiltering: false,
          dataIndex: 'abakusGroup',
          render: GroupLinkRender,
        }
      : null,
    {
      title: 'Rolle',
      dataIndex: 'role',
      filter: Object.keys(ROLES).map((value) => ({
        value,
        label: ROLES[value],
      })),
      search: false,
      inlineFiltering: false,
      filterMapping: (role) =>
        role === 'member' || !ROLES[role] ? '' : ROLES[role],
      render: RoleRender,
    },
  ].filter(Boolean);
  return (
    <>
      <Table
        infiniteScroll
        onChange={(filters, sort) => {
          push({
            pathname,
            search: qs.stringify({
              filters: JSON.stringify(filters),
              sort: JSON.stringify(sort),
              ...(search.includes('descendants=true')
                ? { descendants: true }
                : {}),
            }),
          });
        }}
        columns={columns}
        onLoad={() => {
          fetch({
            descendants: showDescendants,
            groupId: groupId,
            next: true,
            query,
          });
        }}
        hasMore={hasMore}
        loading={fetching}
        data={memberships}
        filters={filters}
      />
      {!memberships.length && !fetching && <div>Ingen brukere</div>}
    </>
  );
};

export default GroupMembersList;
