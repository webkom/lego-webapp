export type PermissionAction = 'list' | 'create' | 'view' | 'edit' | 'delete';

export interface AllowedPermissionsMixin {
  actionGrant: PermissionAction[];
}

export default AllowedPermissionsMixin;
