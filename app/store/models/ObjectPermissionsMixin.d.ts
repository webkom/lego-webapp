import { ID } from 'app/store/models/index';

interface ObjectPermissionsMixin {
  canEditUsers: ID[];
  canViewGroups: ID[];
  canEditGroups: ID[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
