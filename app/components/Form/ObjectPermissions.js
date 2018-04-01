// @flow
import * as React from 'react';

import { SelectInput, CheckBox } from 'app/components/Form';
import Tooltip from 'app/components/Tooltip';

/* 
 * Usage inside redux-form:
 *
 *   <Fields
 *     component={ObjectPermissions}
 *     names={[
 *       'requireAuth',
 *       'canViewGroups',
 *       'canEditUsers',
 *       'canEditGroups'
 *     ]}
 *   />
 *
 * To omit some of the fields, just omit the name in the 'names' prop.
 *
 * You also have to run the values through the 'normalizeObjectPermissions' function below
 * */
const ObjectPermissions = ({
  canEditUsers,
  canEditGroups,
  canViewGroups,
  requireAuth,
  ...props
}: {
  canEditUsers?: any,
  canEditGroups?: any,
  canViewGroups?: any,
  requireAuth?: any
}) => {
  return [
    requireAuth && (
      <Tooltip content="Denne bestemmer om brukere som ikke er innlogget kan se innholdet">
        <CheckBox.Field {...requireAuth} label="Krev innlogging" />
      </Tooltip>
    ),
    canEditGroups && (
      <SelectInput.AutocompleteField
        {...canEditGroups}
        label="Grupper med endretilgang"
        multi
        placeholder="Velg grupper"
        filter={['users.abakusgroup']}
      />
    ),
    canViewGroups && (
      <SelectInput.AutocompleteField
        {...canViewGroups}
        label="Grupper med lesetilgang"
        multi
        placeholder="Velg grupper"
        filter={['users.abakusgroup']}
      />
    ),
    canEditUsers && (
      <SelectInput.AutocompleteField
        {...canEditUsers}
        label="Brukere med endretilgang"
        multi
        placeholder="Velg brukere"
        filter={['users.user']}
      />
    )
  ].filter(Boolean);
};

const toIds = mapping => mapping.value;

export const normalizeObjectPermissions = ({
  requireAuth,
  canEditUsers,
  canEditGroups,
  canViewGroups
}: Object) => ({
  requireAuth: !!requireAuth,
  canEditUsers: canEditUsers && canEditUsers.map(toIds),
  canViewGroups: canViewGroups && canViewGroups.map(toIds),
  canEditGroups: canEditGroups && canEditGroups.map(toIds)
});
export const objectPermissionsToInitialValues = ({
  canViewGroups: initialCanViewGroups,
  canEditGroups: initialCanEditGroups,
  canEditUsers: initialCanEditUsers
}: Object) => {
  const canEditGroups =
    initialCanEditGroups &&
    initialCanEditGroups.filter(Boolean).map(group => ({
      ...group,
      label: group.name,
      value: group.id
    }));
  const canViewGroups =
    initialCanViewGroups &&
    initialCanViewGroups.filter(Boolean).map(group => ({
      ...group,
      label: group.name,
      value: group.id
    }));
  const canEditUsers =
    initialCanEditUsers &&
    initialCanEditUsers.filter(Boolean).map(user => ({
      ...user,
      label: user.fullName,
      value: user.id
    }));
  return {
    ...(canEditUsers ? { canEditUsers } : {}),
    ...(canEditGroups ? { canEditGroups } : {}),
    ...(canViewGroups ? { canViewGroups } : {})
  };
};

export const objectPermissionsInitialValues = {
  requireAuth: true,
  canEditUsers: [],
  canEditGroups: [],
  canViewGroups: []
};

export default ObjectPermissions;
