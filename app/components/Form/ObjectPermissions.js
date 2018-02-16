// @flow
import * as React from 'react';

import { SelectInput, CheckBox } from 'app/components/Form';

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
    requireAuth && <CheckBox.Field {...requireAuth} label="Krev innlogging" />,
    canEditGroups && (
      <SelectInput.AutocompleteField
        {...canEditGroups}
        label="Grupper med skrivetilgang"
        multi
        placeholder="Grupper som kan redigere"
        filter={['users.abakusgroup']}
      />
    ),
    canViewGroups && (
      <SelectInput.AutocompleteField
        {...canViewGroups}
        label="Grupper med lesetilgang"
        multi
        placeholder="Grupper som kan lese"
        filter={['users.abakusgroup']}
      />
    ),
    canEditUsers && (
      <SelectInput.AutocompleteField
        {...canEditUsers}
        label="Brukere med skrivetilgang"
        multi
        placeholder="Brukere som kan redigere"
        filter={['users.user']}
      />
    )
  ].filter(Boolean);
};

const toIds = mapping => mapping.id;

export const normalizeObjectPermissions = ({
  requireAuth,
  canEditUsers,
  canEditGroups,
  canViewGroups,
  ...data
}: Object) => ({
  requireAuth: !!requireAuth,
  canEditUsers: canEditUsers && canEditUsers.map(toIds),
  canViewGroups: canViewGroups && canViewGroups.map(toIds),
  canEditGroups: canEditGroups && canEditGroups.map(toIds),
  ...data
});
export default ObjectPermissions;
