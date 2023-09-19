import { Flex, Icon } from '@webkom/lego-bricks';
import qs from 'qs';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { push } from 'redux-first-history';
import {
  fetchMembershipsPagination,
  removeMember,
  addMember,
} from 'app/actions/GroupActions';
import { ConfirmModal } from 'app/components/Modal/ConfirmModal';
import Table from 'app/components/Table';
import { selectCurrentUser } from 'app/reducers/auth';
import { isCurrentUser as checkIfCurrentUser } from 'app/routes/users/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type Membership from 'app/store/models/Membership';
import { ROLES, type RoleType } from 'app/utils/constants';
import styles from './GroupMembersList.css';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  groupId: number;
  memberships: Membership[];
  showDescendants: boolean;
  groupsById: Record<
    string,
    {
      name: string;
      numberOfUsers?: number;
    }
  >;
  pathname: string;
  search: string;
  query: Record<string, any>;
  filters: Record<string, any>;
};

const GroupMembersList = ({
  memberships,
  groupId,
  showDescendants,
  hasMore,
  fetching,
  groupsById,
  pathname,
  search,
  query,
  filters,
}: Props) => {
  // State for keeping track of which memberships are being edited
  const [membershipsInEditMode, setMembershipsInEditMode] = useState({});

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector((state) => selectCurrentUser(state));

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
        <Select
          value={{
            value: role,
            label: ROLES[role],
          }}
          placeholder="tre"
          options={Object.keys(ROLES).map((key: RoleType) => ({
            value: key,
            label: ROLES[key],
          }))}
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
          dispatch(
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
            })
          );
        }}
        columns={columns}
        onLoad={() => {
          dispatch(
            fetchMembershipsPagination({
              descendants: showDescendants,
              groupId: groupId,
              next: true,
              query,
            })
          );
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
