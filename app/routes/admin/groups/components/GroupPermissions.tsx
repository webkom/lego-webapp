import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { sortBy } from 'lodash';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { editGroup } from 'app/actions/GroupActions';
import { selectGroup } from 'app/reducers/groups';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import AddGroupPermission from './AddGroupPermission';
import type { DetailedGroup } from 'app/store/models/Group';

type PermissionListProps = {
  group: DetailedGroup;
};

const PermissionList = ({ group }: PermissionListProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const parentPermissionsList = group.parentPermissions
    .map(
      ({ abakusGroup, permissions }) =>
        !!permissions.length && (
          <>
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
          </>
        )
    )
    .filter(Boolean);

  const allPermissionsList = sortBy(
    group.permissions.concat(
      group.parentPermissions.flatMap(({ permissions }) => permissions)
    ),
    (permission: string) => permission.split('/').length
  )
    .reduce((acc: Array<string>, perm: string) => {
      // Reduce perms to only show broadest set of permissions
      // If a user has "/sudo/admin/events/" it means the user also has "/sudo/admin/events/create/" implicitly.
      // Therefore we will only show "/sudo/admin/events/"
      const splittedPerm = perm.split('/').filter(Boolean);
      const [broaderPermFound] = splittedPerm.reduce(
        (accumulator: [boolean, string], permPart: string) => {
          const [broaderPermFound, summedPerm] = accumulator;
          const concatedString = `${summedPerm}${permPart}/`;
          return [
            broaderPermFound || acc.includes(concatedString),
            concatedString,
          ];
        },
        [false, '/']
      );
      if (broaderPermFound) return acc;
      return [...acc, perm];
    }, [])
    .map((permission) => <li key={permission}>{permission}</li>);

  return (
    <div>
      <h3>Nåværende rettigheter</h3>
      <ul>
        {group.permissions.length ? (
          group.permissions.map((permission) => (
            <li key={permission}>
              <Flex alignItems="center" gap={10}>
                <ConfirmModal
                  title="Bekreft fjerning av rettighet"
                  message={`Er du sikker på at du vil fjerne tilgangen ${permission}?`}
                  closeOnConfirm={true}
                  onConfirm={() =>
                    dispatch(
                      editGroup({
                        ...group,
                        permissions: group.permissions.filter(
                          (perm) => perm !== permission
                        ),
                      })
                    ).then(() => {
                      if (group.type === 'interesse') {
                        navigate(`/interest-groups/${group.id}`);
                      }
                    })
                  }
                >
                  {({ openConfirmModal }) => (
                    <Icon onClick={openConfirmModal} name="trash" danger />
                  )}
                </ConfirmModal>
                {permission}
              </Flex>
            </li>
          ))
        ) : (
          <li>
            <i> Ingen nåværenede rettigheter </i>
          </li>
        )}
      </ul>
      <h3>Implisitte rettigheter fra foreldregrupper</h3>
      {parentPermissionsList.length ? (
        parentPermissionsList
      ) : (
        <i> Ingen nåværenede rettigheter </i>
      )}
      <h3>Sum alle rettigheter</h3>
      {allPermissionsList.length ? (
        <ul>{allPermissionsList}</ul>
      ) : (
        <i> Ingen nåværenede rettigheter </i>
      )}
    </div>
  );
};

const GroupPermissions = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const group = useAppSelector((state) => selectGroup(state, { groupId }));

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
