import type { EntityId } from '@reduxjs/toolkit';
import type { FieldGroup } from 'app/store/models/Group';

interface ObjectPermissionsMixin {
  canEditUsers: EntityId[];
  canViewGroups: FieldGroup[];
  canEditGroups: FieldGroup[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
