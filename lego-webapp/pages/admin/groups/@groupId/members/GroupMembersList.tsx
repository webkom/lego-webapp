import { Button, ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { Trash2 } from 'lucide-react';
import { SelectInput } from '~/components/Form';
import Table from '~/components/Table';
import { defaultGroupMembersQuery } from '~/pages/admin/groups/@groupId/members/+Page';
import { isCurrentUser } from '~/pages/users/utils';
import { removeMember, editMembership } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectGroupEntities } from '~/redux/slices/groups';
import { isNotNullish } from '~/utils';
import { roleOptions, ROLES, type RoleType } from '~/utils/constants';
import useQuery from '~/utils/useQuery';
import styles from './GroupMembersList.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import type {
  ColumnProps,
  EditCellContext,
  EditDraft,
  RowActionContext,
  TableEditableProps,
} from '~/components/Table';
import type { TransformedMembership } from '~/redux/slices/memberships';

type Props = {
  fetching: boolean;
  hasMore: boolean;
  memberships: TransformedMembership[];
  fetchMemberships: (next: boolean) => Promise<void>;
};

const GroupMembersList = ({
  memberships,
  hasMore,
  fetching,
  fetchMemberships,
}: Props) => {
  const groupEntities = useAppSelector(selectGroupEntities);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  const { query, setQuery } = useQuery(defaultGroupMembersQuery);
  const showDescendants = query.descendants === 'true';

  const GroupMembersListColumns = (
    _: unknown,
    membership: TransformedMembership,
  ): ReactNode => {
    const { user } = membership;
    return (
      <a key={user.id} href={`/users/${user.username}`}>
        {user.fullName} ({user.username})
      </a>
    );
  };

  const GroupLinkRender = (abakusGroup: EntityId): ReactNode => (
    <a href={`/admin/groups/${abakusGroup}/members?descendants=false`}>
      {groupEntities[abakusGroup] && groupEntities[abakusGroup].name}
    </a>
  );

  const RoleRender = (role: RoleType): ReactNode =>
    role !== 'member' && <i>{ROLES[role] || role} </i>;

  const RoleEditRender = ({
    row: membership,
    value,
    setValue,
    isSaving,
  }: EditCellContext<TransformedMembership>): ReactNode => (
    <SelectInput
      name={`role-${membership.id}`}
      value={
        roleOptions.find((option) => option.value === value) ?? {
          value: membership.role,
          label: ROLES[membership.role],
        }
      }
      options={roleOptions}
      disabled={isSaving}
      onChange={(nextValue) => {
        const option = nextValue as { label: string; value: RoleType } | null;
        if (!option) return;
        setValue(option.value);
      }}
    />
  );

  const columns: ColumnProps<TransformedMembership>[] = [
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
      editable: true,
      editRender: RoleEditRender,
      render: RoleRender,
    },
  ].filter(isNotNullish);

  const membershipRowActions = ({
    row: membership,
    isEditing,
    isSaving,
    canSave,
    isLocked,
    isEditable,
    startEdit,
    cancelEdit,
    saveEdit,
  }: RowActionContext<TransformedMembership>) => {
    const isSelf = isCurrentUser(
      membership.user.username,
      currentUser?.username,
    );

    return isEditing ? (
      <Flex justifyContent="center" alignItems="center" gap={5}>
        <Button
          size="small"
          onPress={() => void saveEdit()}
          disabled={isSaving || !canSave}
        >
          Lagre
        </Button>
        <Button size="small" flat onPress={cancelEdit} disabled={isSaving}>
          Avbryt
        </Button>
      </Flex>
    ) : (
      <Flex justifyContent="center" alignItems="center" gap={5}>
        <Icon
          name="pencil"
          size={20}
          edit
          disabled={isSelf || isLocked || !isEditable}
          onPress={() => !isSelf && !isLocked && isEditable && startEdit()}
        />
        <ConfirmModal
          title="Bekreft utmelding"
          message={`Er du sikker på at du vil melde ut "${membership.user.fullName}" fra gruppen "${groupEntities[membership.abakusGroup]?.name}"?`}
          onConfirm={() => dispatch(removeMember(membership))}
        >
          {({ openConfirmModal }) => (
            <Icon
              onPress={() => !isLocked && openConfirmModal()}
              iconNode={<Trash2 />}
              size={20}
              danger
              disabled={isLocked}
            />
          )}
        </ConfirmModal>
      </Flex>
    );
  };

  const editableMemberships: TableEditableProps<TransformedMembership> = {
    enabled: true,
    isRowEditable: (membership) =>
      !isCurrentUser(membership.user.username, currentUser?.username),
    getInitialDraft: (membership) => ({
      role: membership.role,
    }),
    validateDraft: (draft: EditDraft<TransformedMembership>) => {
      const hasValidRole = roleOptions.some(
        (option) => option.value === draft.role,
      );
      return hasValidRole ? null : { role: 'Ugyldig rolle' };
    },
    onSaveRow: async (membership, draft) => {
      if (!roleOptions.some((option) => option.value === draft.role)) return;
      await dispatch(
        editMembership({
          id: membership.id,
          abakusGroup: membership.abakusGroup,
          role: draft.role as RoleType,
        }),
      );
      await fetchMemberships(false);
    },
    renderRowActions: membershipRowActions,
  };

  return (
    <Table
      onLoad={() => fetchMemberships(true)}
      onChange={setQuery}
      columns={columns}
      hasMore={hasMore}
      loading={fetching}
      data={memberships}
      editable={editableMemberships}
      filters={query}
      className={styles.list}
    />
  );
};

export default GroupMembersList;
