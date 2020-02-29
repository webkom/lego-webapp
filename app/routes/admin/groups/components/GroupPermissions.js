// @flow

import React from 'react';
import { compose } from 'redux';
import { sortBy, uniq } from 'lodash';
import type { ID } from 'app/models';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import styles from './GroupMembers.css';
import AddGroupPermission from './AddGroupPermission';
import { editGroup } from 'app/actions/GroupActions';
import loadingIndicator from 'app/utils/loadingIndicator';

type PermissionListProps = {
  permissions: Array<string>,
  nestedPermissions: Array<{
    abakusGroup: { id: ID, name: string },
    permissions: Array<string>
  }>,
  group: Object,
  editGroup: any => Promise<*>
};

const removePermission = (permission, group, editGroup) =>
  confirm(`Er du sikker på at du vil fjerne tilgangen ${permission}?`) &&
  editGroup({
    ...group,
    permissions: group.permissions.filter(perm => perm !== permission)
  });

const PermissionList = ({
  permissions,
  group,
  nestedPermissions,
  editGroup
}: PermissionListProps) => {
  const nestedPermissionsList = nestedPermissions
    .map(
      ({ abakusGroup, permissions }) =>
        !!permissions.length && (
          <>
            <h4>
              Rettigheter fra
              <Link to={`/admin/groups/${abakusGroup.id}/permissions/`}>
                {' '}
                {abakusGroup.name}{' '}
              </Link>
            </h4>
            <ul>
              {permissions.map(permission => (
                <li key={permission + abakusGroup.id}>{permission}</li>
              ))}
            </ul>
          </>
        )
    )
    .filter(Boolean);
  const allPermissionsList = uniq(
    sortBy(
      permissions.concat(
        // $FlowFixMe
        nestedPermissions.flatMap(({ permissions }) => permissions)
      ),
      (permission: string) => permission.split('/').length
    )
  ).map(permission => <li key={permission}>{permission}</li>);
  return (
    <div>
      <h3>Nåværende rettigheter</h3>
      <ul>
        {permissions.length ? (
          permissions.map(permission => (
            <li key={permission}>
              <i
                className={`fa fa-times ${styles.removeIcon}`}
                onClick={() => removePermission(permission, group, editGroup)}
              />

              {permission}
            </li>
          ))
        ) : (
          <li>
            <i> Ingen nåværenede rettigheter </i>
          </li>
        )}
      </ul>
      <h3>Implisitte rettigheter fra foreldregrupper</h3>
      {nestedPermissionsList.length ? (
        nestedPermissionsList
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
  group: Object,
  editGroup: any => Promise<*>
};

export const GroupPermissions = ({
  group,
  editGroup
}: GroupPermissionsProps) => {
  const { permissions, nestedPermissions } = group;
  return (
    <div className={styles.groupMembers}>
      <PermissionList
        group={group}
        permissions={permissions}
        nestedPermissions={nestedPermissions}
        editGroup={editGroup}
      />
      <AddGroupPermission group={group} editGroup={editGroup} />
    </div>
  );
};

const mapDispatchToProps = { editGroup };

export default compose(
  connect(
    () => ({}),
    mapDispatchToProps
  ),
  loadingIndicator(['group'])
)(GroupPermissions);
