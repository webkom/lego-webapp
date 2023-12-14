import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import qs from 'qs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SelectInput } from 'app/components/Form';
import Table from 'app/components/Table';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { ROLES, type RoleType } from 'app/utils/constants';
import styles from './GroupMembersList.css';
import type { AddMemberArgs } from 'app/actions/GroupActions';
import type Membership from 'app/store/models/Membership';
import type { CurrentUser } from 'app/store/models/User';
import type { History } from 'history';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  groupId: number;
  memberships: Membership[];
  addMember: (arg0: AddMemberArgs) => Promise<any>;
  removeMember: (membership: Membership) => Promise<void>;
  showDescendants: boolean;
  groupsById: Record<
    string,
    {
      name: string;
      numberOfUsers?: number;
    }
  >;
  fetch: (arg0: {
    groupId: number;
    next: boolean;
    query: Record<string, any>;
    descendants: boolean;
  }) => Promise<any>;
  push: History['push'];
  pathname: string;
  search: string;
  query: Record<string, any>;
  filters: Record<string, any>;
  currentUser: CurrentUser;
};

const GroupMembersList = ({
  memberships,
  groupId,
  addMember,
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
  currentUser,
}: Props) => {
  // State for keeping track of which memberships are being edited
  const [membershipsInEditMode, setMembershipsInEditMode] = useState({});

  const GroupMembersListColumns = (fullName, membership: Membership) => {
    const { user } = membership;
    return (
      <Link key={user.id} to={`/users/${user.username}`}>
        {user.fullName} ({user.username})
      </Link>
    );
  };

  const GroupLinkRender = (abakusGroup) => (
    <Link to={`/admin/groups/${abakusGroup}/members?descendants=false`}>
      {groupsById[abakusGroup] && groupsById[abakusGroup].name}
    </Link>
  );

  const RoleRender = (fullName, membership: Membership) => {
    const { id, role } = membership;

    if (membershipsInEditMode[id]) {
      return (
        <SelectInput
          value={{
            value: role,
            label: ROLES[role],
          }}
          options={Object.keys(ROLES).map((key: RoleType) => ({
            value: key,
            label: ROLES[key],
          }))}
          onChange={async (value: { label: string; value: RoleType }) => {
            setMembershipsInEditMode((prev) => ({
              ...prev,
              [id]: false,
            }));
            await removeMember(membership).then(() =>
              addMember({
                userId: membership.user.id,
                groupId: membership.abakusGroup,
                role: value.value,
              })
            );
          }}
        />
      );
    }

    return role !== 'member' && <i>{ROLES[role] || role} </i>;
  };

  const EditRender = (fullName, membership: Membership) => {
    const { id, user, abakusGroup } = membership;
    const isCurrentUser = checkIfCurrentUser(
      user.username,
      currentUser.username
    );

    return (
      <Flex justifyContent="center" alignItems="center" gap={5}>
        {!membershipsInEditMode[id] && (
          <Icon
            name="pencil"
            size={20}
            edit
            disabled={isCurrentUser}
            onClick={() =>
              !isCurrentUser &&
              setMembershipsInEditMode((prev) => ({
                ...prev,
                [id]: true,
              }))
            }
          />
        )}
        <ConfirmModal
          title="Bekreft utmelding"
          message={`Er du sikker på at du vil melde ut "${user.fullName}" fra gruppen "${groupsById[abakusGroup].name}"?`}
          onConfirm={() => removeMember(membership)}
        >
          {({ openConfirmModal }) => (
            <Icon onClick={openConfirmModal} name="trash" size={20} danger />
          )}
        </ConfirmModal>
      </Flex>
    );
  };

  const columns = [
    {
      title: 'Navn (brukernavn)',
      dataIndex: 'user.fullName',
      search: true,
      inlineFiltering: false,
      centered: false,
      render: GroupMembersListColumns,
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
      filter: Object.keys(ROLES).map((value: RoleType) => ({
        value,
        label: ROLES[value],
      })),
      search: false,
      inlineFiltering: false,
      filterMapping: (role) =>
        role === 'member' || !ROLES[role] ? '' : ROLES[role],
      render: RoleRender,
    },
    {
      render: EditRender,
    },
  ].filter(Boolean);

  return (
    <>
      <Table
        onChange={(filters, sort) => {
          push({
            pathname,
            search: qs.stringify({
              filters: JSON.stringify(filters),
              sort: JSON.stringify(sort),
              ...(search.includes('descendants=true')
                ? {
                    descendants: true,
                  }
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
        className={styles.list}
      />
      {!memberships.length && !fetching && <div>Ingen brukere</div>}
    </>
  );
};

export default GroupMembersList;
