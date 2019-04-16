

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './GroupMembers.css';
import AddGroupPermission from './AddGroupPermission';
import { editGroup } from 'app/actions/GroupActions';
import loadingIndicator from 'app/utils/loadingIndicator';

type PermissionListProps = {
  permissions: Array</*TODO: Permission*/ string>,
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
  editGroup
}: PermissionListProps) => (
  <div>
    <h3>Nåværende rettigheter</h3>
    <ul>
      {permissions.map(permission => (
        <li key={permission}>
          <i
            className={`fa fa-times ${styles.removeIcon}`}
            onClick={() => removePermission(permission, group, editGroup)}
          />

          {permission}
        </li>
      ))}
    </ul>
  </div>
);

type GroupPermissionsProps = {
  group: Object,
  editGroup: any => Promise<*>
};

export const GroupPermissions = ({
  group,
  editGroup
}: GroupPermissionsProps) => {
  const { permissions } = group;
  return (
    <div className={styles.groupMembers}>
      <PermissionList
        group={group}
        permissions={permissions}
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
