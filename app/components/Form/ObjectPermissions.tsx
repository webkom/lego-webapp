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
 *
 * */
const ObjectPermissions = ({
  canEditUsers,
  canEditGroups,
  canViewGroups,
  requireAuth,
  ...props
}: {
  canEditUsers?: any;
  canEditGroups?: any;
  canViewGroups?: any;
  requireAuth?: any;
}) => {
  return [
    requireAuth && (
      <Tooltip content="Gi alle brukere lesetilgang. Dette inkluderer også brukere som ikke har logget inn.">
        <CheckBox.Field
          inverted
          {...requireAuth}
          label="Åpen for alle - offentlig på nettet."
        />
      </Tooltip>
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
  const canEditUsers = initialCanEditUsers && initialCanEditUsers.map(toIds);
  const canViewGroups = initialCanViewGroups && initialCanViewGroups.map(toIds);
  const canEditGroups = initialCanEditGroups && initialCanEditGroups.map(toIds);
  return {
    requireAuth: !!requireAuth,
    ...(canEditUsers
      ? {
          canEditUsers,
        }
      : {}),
    //$FlowFixMe
    ...(canEditGroups
      ? {
          canEditGroups,
        }
      : {}),
    ...(canViewGroups
      ? {
          canViewGroups,
        }
      : {}),
  };
};
export const objectPermissionsToInitialValues = ({
  canViewGroups: initialCanViewGroups,
  canEditGroups: initialCanEditGroups,
  canEditUsers: initialCanEditUsers,
}: Record<string, any>) => {
  const canEditGroups =
    initialCanEditGroups &&
    initialCanEditGroups
      .filter(Boolean)
      .map((group) => ({ ...group, label: group.name, value: group.id }));
  const canViewGroups =
    initialCanViewGroups &&
    initialCanViewGroups
      .filter(Boolean)
      .map((group) => ({ ...group, label: group.name, value: group.id }));
  const canEditUsers =
    initialCanEditUsers &&
    initialCanEditUsers
      .filter(Boolean)
      .map((user) => ({ ...user, label: user.fullName, value: user.id }));
  return {
    ...(canEditUsers
      ? {
          canEditUsers,
        }
      : {}),
    //$FlowFixMe
    ...(canEditGroups
      ? {
          canEditGroups,
        }
      : {}),
    ...(canViewGroups
      ? {
          canViewGroups,
        }
      : {}),
  };
};
export const objectPermissionsInitialValues = {
  requireAuth: true,
  canEditUsers: [],
  canEditGroups: [],
  canViewGroups: [],
};
export default ObjectPermissions;
