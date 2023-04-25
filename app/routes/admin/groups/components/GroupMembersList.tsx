import qs from 'qs';
import { Link } from 'react-router-dom';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import Table from 'app/components/Table';
import { ROLES } from 'app/utils/constants';
import styles from './GroupMembersList.css';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  groupId: number;
  memberships: Array<Record<string, any>>;
  removeMember: (arg0: Record<string, any>) => Promise<any>;
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
  push: (arg0: any) => void;
  pathname: string;
  search: string;
  query: Record<string, any>;
  filters: Record<string, any>;
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
    const { user, abakusGroup } = membership;
    return (
      <>
        <ConfirmModalWithParent
          title="Bekreft utmelding"
          message={`Er du sikker på at du vil melde ut "${user.fullName}" fra gruppen "${groupsById[abakusGroup].name}"?`}
          onConfirm={() => removeMember(membership)}
        >
          <i key="icon" className={`fa fa-times ${styles.removeIcon}`} />
        </ConfirmModalWithParent>
        <Link key="link" to={`/users/${user.username}`}>
          {user.fullName} ({user.username})
        </Link>
      </>
    );
  };

  const GroupLinkRender = (abakusGroup) => (
    <Link to={`/admin/groups/${abakusGroup}/members?descendants=false`}>
      {groupsById[abakusGroup] && groupsById[abakusGroup].name}
    </Link>
  );

  const RoleRender = (role: string) =>
    role !== 'member' && <i>{ROLES[role] || role} </i>;

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
      />
      {!memberships.length && !fetching && <div>Ingen brukere</div>}
    </>
  );
};

export default GroupMembersList;
