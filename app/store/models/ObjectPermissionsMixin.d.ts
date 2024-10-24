import type { FieldGroup } from 'app/store/models/Group';
import type { PublicUser } from 'app/store/models/User';

interface ObjectPermissionsMixin {
  canEditUsers: PublicUser[];
  canViewGroups: FieldGroup[];
  canEditGroups: FieldGroup[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
