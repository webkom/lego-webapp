import type { ID } from 'app/store/models';

interface ObjectPermissionsMixin {
  canEditUsers: ID[];
  canViewGroups: ID[];
  canEditGroups: ID[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
