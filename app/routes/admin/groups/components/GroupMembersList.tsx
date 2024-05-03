import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { removeMember, addMember } from 'app/actions/GroupActions';
import { SelectInput } from 'app/components/Form';
import Table from 'app/components/Table';
import { defaultGroupMembersQuery } from 'app/routes/admin/groups/components/GroupMembers';
import { useIsCurrentUser } from 'app/routes/users/utils';
import { useAppDispatch } from 'app/store/hooks';
import { roleOptions, ROLES, type RoleType } from 'app/utils/constants';
import useQuery from 'app/utils/useQuery';
import styles from './GroupMembersList.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { TransformedMembership } from 'app/reducers/memberships';
import type { ReactNode } from 'react';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  memberships: TransformedMembership[];
  groupsById: Record<
    string,
    {
      name: string;
      numberOfUsers?: number;
    }
  >;
  fetchMemberships: (next: boolean) => Promise<void>;
};

const GroupMembersList = ({
  memberships,
  hasMore,
  fetching,
  groupsById,
  fetchMemberships,
}: Props) => {
  // State for keeping track of which memberships are being edited
  const [membershipsInEditMode, setMembershipsInEditMode] = useState({});

  const dispatch = useAppDispatch();

  const { query, setQuery } = useQuery(defaultGroupMembersQuery);
  const showDescendants = query.descendants === 'true';

  const GroupMembersListColumns = (
    _: unknown,
    membership: TransformedMembership,
  ): ReactNode => {
    const { user } = membership;
    return (
      <Link key={user.id} to={`/users/${user.username}`}>
        {user.fullName} ({user.username})
      </Link>
    );
  };

  const GroupLinkRender = (abakusGroup: EntityId): ReactNode => (
    <Link to={`/admin/groups/${abakusGroup}/members?descendants=false`}>
      {groupsById[abakusGroup] && groupsById[abakusGroup].name}
    </Link>
  );

  const RoleRender = (
    _: RoleType,
    membership: TransformedMembership,
  ): ReactNode => {
    const { id, role } = membership;

    if (membershipsInEditMode[id]) {
      return (
        <SelectInput
          value={{
            value: role,
            label: ROLES[role],
          }}
          options={roleOptions}
          onChange={async (value) => {
            setMembershipsInEditMode((prev) => ({
              ...prev,
              [id]: false,
            }));
            await dispatch(removeMember(membership));
            await dispatch(
              addMember({
                userId: membership.user.id,
                groupId: membership.abakusGroup,
                role: value.value,
              }),
            );
            await fetchMemberships(false);
          }}
        />
      );
    }

    return role !== 'member' && <i>{ROLES[role] || role} </i>;
  };

  const EditRender = (_: unknown, membership: TransformedMembership) => {
    const { id, user, abakusGroup } = membership;
    const isCurrentUser = useIsCurrentUser(user.username);

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
          message={`Er du sikker på at du vil melde ut "${user.fullName}" fra gruppen "${groupsById[abakusGroup]?.name}"?`}
          onConfirm={() => dispatch(removeMember(membership))}
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
      filterIndex: 'userFullname',
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
          filterIndex: 'abakusGroupName',
          render: GroupLinkRender,
        }
      : null,
    {
      title: 'Rolle',
      dataIndex: 'role',
      filter: roleOptions,
      filterOptions: {
        multiSelect: true,
      },
      search: false,
      inlineFiltering: false,
      filterMapping: (role: RoleType) =>
        role === 'member' || !ROLES[role] ? '' : ROLES[role],
      render: RoleRender,
    },
    {
      render: EditRender,
    },
  ].filter(Boolean);

  return (
    <Table
      onLoad={() => fetchMemberships(true)}
      onChange={setQuery}
      columns={columns}
      hasMore={hasMore}
      loading={fetching}
      data={memberships}
      filters={query}
      className={styles.list}
    />
  );
};

export default GroupMembersList;
