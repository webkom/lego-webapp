// @flow

import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import styles from './GroupMembers.css';
import AddGroupPermission from './AddGroupPermission';
import { editGroup } from 'app/actions/GroupActions';
import loadingIndicator from 'app/utils/loadingIndicator';

type Props = {
  group: Object,
  editGroup: Promise<*>
};

type PermissionListProps = {
  permissions: [String]
};

const PermissionListItem = ({ permission }) => <div> {permission} </div>;

const PermissionList = ({ permissions }: PermissionListProps) => (
  <div>
    <h3>Nåværende rettigheter</h3>
    <ul>
      {permissions.map(p => (
        <li key={p}>
          <PermissionListItem permission={p} />
        </li>
      ))}
    </ul>
  </div>
);

export const GroupPermissions = ({ group, editGroup }: Props) => {
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
  connect(null, mapDispatchToProps),
  loadingIndicator('group')
)(GroupPermissions);
