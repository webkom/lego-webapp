import { SelectInput, CheckBox } from 'app/components/Form';
import type { PublicGroup } from 'app/store/models/Group';

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
 *
 * */
const ObjectPermissions = ({
  canEditUsers,
  canEditGroups,
  canViewGroups,
  requireAuth,
}: {
  canEditUsers?: PublicGroup[];
  canEditGroups?: PublicGroup[];
  canViewGroups?: PublicGroup[];
  requireAuth?: boolean;
}) => {
  return [
    requireAuth && (
      <CheckBox.Field
        description="Gi alle brukere lesetilgang. Dette inkluderer også brukere som ikke har logget inn."
        inverted
        {...requireAuth}
        label="Åpen for alle - offentlig på nettet"
      />
    ),
    canEditGroups && (
      <SelectInput.AutocompleteField
        {...canEditGroups}
        label="Grupper med endretilgang"
        isMulti
        placeholder="Velg grupper"
        filter={['users.abakusgroup']}
      />
    ),
    canViewGroups && (
      <SelectInput.AutocompleteField
        {...canViewGroups}
        label="Grupper med lesetilgang"
        isMulti
        placeholder="Velg grupper"
        filter={['users.abakusgroup']}
      />
    ),
    canEditUsers && (
      <SelectInput.AutocompleteField
        {...canEditUsers}
        label="Brukere med endretilgang"
        isMulti
        placeholder="Velg brukere"
        filter={['users.user']}
      />
    ),
  ].filter(Boolean);
};

const toIds = (mapping) => mapping.value;

export const normalizeObjectPermissions = ({
  requireAuth,
  canViewGroups: initialCanViewGroups,
  canEditGroups: initialCanEditGroups,
  canEditUsers: initialCanEditUsers,
}: Record<string, any>) => {
  return {
    requireAuth: !!requireAuth,
    canEditUsers: initialCanEditUsers?.map(toIds) ?? {},
    canViewGroups: initialCanViewGroups?.map(toIds) ?? {},
    canEditGroups: initialCanEditGroups?.map(toIds) ?? {},
  };
};
export const objectPermissionsToInitialValues = ({
  canViewGroups: initialCanViewGroups,
  canEditGroups: initialCanEditGroups,
  canEditUsers: initialCanEditUsers,
}: Record<string, any>) => {
  const canEditGroups = initialCanEditGroups
    ?.filter(Boolean)
    .map((group) => ({ ...group, label: group.name, value: group.id }));
  const canViewGroups = initialCanViewGroups
    ?.filter(Boolean)
    .map((group) => ({ ...group, label: group.name, value: group.id }));
  const canEditUsers = initialCanEditUsers
    ?.filter(Boolean)
    .map((user) => ({ ...user, label: user.fullName, value: user.id }));
  return {
    canEditUsers: canEditUsers ?? {},
    canEditGroups: canEditGroups ?? {},
    canViewGroups: canViewGroups ?? {},
  };
};
export const objectPermissionsInitialValues = {
  requireAuth: true,
  canEditUsers: [],
  canEditGroups: [],
  canViewGroups: [],
};
export default ObjectPermissions;
