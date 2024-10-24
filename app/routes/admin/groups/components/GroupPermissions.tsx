import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { sortBy } from 'lodash-es';
import { Trash2 } from 'lucide-react';
import { Fragment } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { editGroup } from 'app/actions/GroupActions';
import EmptyState from 'app/components/EmptyState';
import { selectGroupById } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AddGroupPermission from './AddGroupPermission';
import type { GroupPageParams } from 'app/routes/admin/groups/components/GroupPage';
import type { DetailedGroup, UnknownGroup } from 'app/store/models/Group';

type PermissionListProps = {
  group: UnknownGroup;
};

const PermissionList = ({ group }: PermissionListProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { permissions = [], parentPermissions = [] } = group as DetailedGroup; // Default to [] if the DetailedGroup object has not loaded yet

  const parentPermissionsList = parentPermissions
    .map(
      ({ abakusGroup, permissions }) =>
        !!permissions.length && (
          <Fragment key={'group-permissions' + abakusGroup.id}>
            <h4>
              Rettigheter fra
              <Link to={`/admin/groups/${abakusGroup.id}/permissions/`}>
                {' '}
                {abakusGroup.name}
              </Link>
            </h4>
            <ul>
              {permissions.map((permission) => (
                <li key={permission + abakusGroup.id}>{permission}</li>
              ))}
            </ul>
          </Fragment>
        ),
    )
    .filter(Boolean);

  const allPermissionsList = sortBy(
    permissions.concat(
      parentPermissions.flatMap(({ permissions }) => permissions),
    ),
    (permission: string) => permission.split('/').length,
  )
    .reduce((acc: Array<string>, perm: string) => {
      // Reduce perms to only show broadest set of permissions
      // If a user has "/sudo/admin/events/" it means the user also has "/sudo/admin/events/create/" implicitly.
      // Therefore we will only show "/sudo/admin/events/"
      const splittedPerm = perm.split('/').filter(Boolean);
      const [broaderPermFound] = splittedPerm.reduce(
        (accumulator, permPart) => {
          const [broaderPermFound, summedPerm] = accumulator;
          const concatedString = `${summedPerm}${permPart}/`;
          return [
            broaderPermFound || acc.includes(concatedString),
            concatedString,
          ];
        },
        [false, '/'],
      );
      if (broaderPermFound) return acc;
      return [...acc, perm];
    }, [])
    .map((permission) => <li key={permission}>{permission}</li>);

  return (
    <div>
      <h3>Nåværende rettigheter</h3>
      <ul>
        {permissions.length ? (
          permissions.map((permission) => (
            <li key={permission}>
              <Flex alignItems="center" gap="var(--spacing-sm)">
                <ConfirmModal
                  title="Bekreft fjerning av rettighet"
                  message={`Er du sikker på at du vil fjerne tilgangen ${permission}?`}
                  closeOnConfirm={true}
                  onConfirm={() =>
                    dispatch(
                      editGroup({
                        ...group,
                        permissions: permissions.filter(
                          (perm) => perm !== permission,
                        ),
                      }),
                    ).then(() => {
                      if (group.type === 'interesse') {
                        navigate(`/interest-groups/${group.id}`);
                      }
                    })
                  }
                >
                  {({ openConfirmModal }) => (
                    <Icon
                      onPress={openConfirmModal}
                      iconNode={<Trash2 />}
                      danger
                    />
                  )}
                </ConfirmModal>
                {permission}
              </Flex>
            </li>
          ))
        ) : (
          <li>
            <EmptyState body="Ingen nåværenede rettigheter" />
          </li>
        )}
      </ul>
      <h3>Implisitte rettigheter fra foreldregrupper</h3>
      {parentPermissionsList.length ? (
        parentPermissionsList
      ) : (
        <EmptyState body="Ingen nåværenede rettighete" />
      )}
      <h3>Sum alle rettigheter</h3>
      {allPermissionsList.length ? (
        <ul>{allPermissionsList}</ul>
      ) : (
        <EmptyState body="Ingen nåværenede rettigheter" />
      )}
    </div>
  );
};

const GroupPermissions = () => {
  const { groupId } = useParams<GroupPageParams>() as GroupPageParams;
  const group = useAppSelector((state) => selectGroupById(state, groupId));

  return (
    <div>
      {group && (
        <>
          <PermissionList group={group} />
          <AddGroupPermission group={group} />
        </>
      )}
    </div>
  );
};

export default GroupPermissions;
