import type { FieldGroup } from '~/redux/models/Group';
import type { PublicUser } from '~/redux/models/User';

interface ObjectPermissionsMixin {
  canEditUsers: PublicUser[];
  canViewGroups: FieldGroup[];
  canEditGroups: FieldGroup[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
