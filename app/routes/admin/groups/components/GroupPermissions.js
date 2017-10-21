// @flow

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './GroupMembers.css';
import AddGroupPermission from './AddGroupPermission';
import { editGroup } from 'app/actions/GroupActions';
import loadingIndicator from 'app/utils/loadingIndicator';

type PermissionListProps = {
  permissions: Array</*TODO: Permission*/ string>
};

const PermissionList = ({ permissions }: PermissionListProps) => (
  <div>
    <h3>Nåværende rettigheter</h3>
    <ul>
      {permissions.map(permission => <li key={permission}>{permission}</li>)}
    </ul>
  </div>
);

type GroupPermissionsProps = {
  group: Object,
  editGroup: Promise<*>
};

export const GroupPermissions = ({
  group,
  editGroup
}: GroupPermissionsProps) => {
  const { permissions } = group;
  return (
    <div className={styles.groupMembers}>
      <PermissionList permissions={permissions} />
      <AddGroupPermission group={group} editGroup={editGroup} />
    </div>
  );
};

const mapDispatchToProps = { editGroup };

export default compose(
  connect(() => ({}), mapDispatchToProps),
  loadingIndicator(['group'])
)(GroupPermissions);
