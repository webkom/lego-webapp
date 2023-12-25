import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { removeMember, addMember } from 'app/actions/GroupActions';
import { SelectInput } from 'app/components/Form';
import Table from 'app/components/Table';
import { selectCurrentUser } from 'app/reducers/auth';
import { defaultGroupMembersQuery } from 'app/routes/admin/groups/components/GroupMembers';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { roleOptions, ROLES, type RoleType } from 'app/utils/constants';
import useQuery from 'app/utils/useQuery';
import styles from './GroupMembersList.css';
import type { ID } from 'app/store/models';
import type Membership from 'app/store/models/Membership';
import type { ReactNode } from 'react';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  memberships: Membership[];
  groupsById: Record<
    string,
    {
      name: string;
      numberOfUsers?: number;
    }
  >;
};

const GroupMembersList = ({
  memberships,
  hasMore,
  fetching,
  groupsById,
}: Props) => {
  // State for keeping track of which memberships are being edited
  const [membershipsInEditMode, setMembershipsInEditMode] = useState({});

  const dispatch = useAppDispatch();

  const { query, setQuery } = useQuery(defaultGroupMembersQuery);
  const showDescendants = query.descendants === 'true';

  const currentUser = useAppSelector((state) => selectCurrentUser(state));

  const GroupMembersListColumns = (
    _: unknown,
    membership: Membership
  ): ReactNode => {
    const { user } = membership;
    return (
      <Link key={user.id} to={`/users/${user.username}`}>
        {user.fullName} ({user.username})
      </Link>
    );
  };

  const GroupLinkRender = (abakusGroup: ID): ReactNode => (
    <Link to={`/admin/groups/${abakusGroup}/members?descendants=false`}>
      {groupsById[abakusGroup] && groupsById[abakusGroup].name}
    </Link>
  );

  const RoleRender = (_: RoleType, membership: Membership): ReactNode => {
    const { id, role } = membership;

    if (membershipsInEditMode[id]) {
      return (
        <SelectInput
          value={{
            value: role,
            label: ROLES[role],
          }}
          options={roleOptions}
          onChange={async (value: { label: string; value: RoleType }) => {
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
              })
            );
          }}
        />
      );
    }

    return role !== 'member' && <i>{ROLES[role] || role} </i>;
  };

  const EditRender = (_: unknown, membership: Membership) => {
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
    <>
      <Table
        onChange={setQuery}
        columns={columns}
        hasMore={hasMore}
        loading={fetching}
        data={memberships}
        filters={query}
        className={styles.list}
      />
    </>
  );
};

export default GroupMembersList;
