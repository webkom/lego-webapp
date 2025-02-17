type PermissionAction = 'list' | 'create' | 'view' | 'edit' | 'delete';

interface AllowedPermissionsMixin {
  actionGrant: PermissionAction[];
}

export default AllowedPermissionsMixin;
