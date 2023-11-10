import { ConfirmModal, Flex, Icon } from '@webkom/lego-bricks';
import { sortBy } from 'lodash';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { editGroup } from 'app/actions/GroupActions';
import loadingIndicator from 'app/utils/loadingIndicator';
import AddGroupPermission from './AddGroupPermission';
import type { ID } from 'app/models';

type PermissionListProps = {
  permissions: Array<string>;
  parentPermissions: Array<{
    abakusGroup: {
      id: ID;
      name: string;
    };
    permissions: Array<string>;
  }>;
  group: Record<string, any>;
  editGroup: (arg0: any) => Promise<any>;
};

const removePermission = (permission, group, editGroup) =>
  editGroup({
    ...group,
    permissions: group.permissions.filter((perm) => perm !== permission),
  });

const PermissionList = ({
  permissions,
  group,
  parentPermissions,
  editGroup,
}: PermissionListProps) => {
  const parentPermissionsList = parentPermissions
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
        ),
    )
    .filter(Boolean);
  const allPermissionsList = sortBy(
    permissions.concat(
      // $FlowFixMe
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
        (accumulator: [boolean, string], permPart: string) => {
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
              <Flex>
                <ConfirmModal
                  title="Bekreft fjerning av rettighet"
                  message={`Er du sikker på at du vil fjerne tilgangen ${permission}?`}
                  closeOnConfirm={true}
                  onConfirm={() =>
                    removePermission(permission, group, editGroup)
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

type GroupPermissionsProps = {
  group: Record<string, any>;
  editGroup: (arg0: any) => Promise<any>;
};
export const GroupPermissions = ({
  group,
  editGroup,
}: GroupPermissionsProps) => {
  const { permissions, parentPermissions } = group;
  return (
    <div>
      <PermissionList
        group={group}
        permissions={permissions}
        parentPermissions={parentPermissions}
        editGroup={editGroup}
      />
      <AddGroupPermission group={group} editGroup={editGroup} />
    </div>
  );
};
const mapDispatchToProps = {
  editGroup,
};
export default compose(
  connect(() => ({}), mapDispatchToProps),
  loadingIndicator(['group']),
)(GroupPermissions);
