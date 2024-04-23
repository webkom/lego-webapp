import type { EntityId } from '@reduxjs/toolkit';

interface ObjectPermissionsMixin {
  canEditUsers: EntityId[];
  canViewGroups: EntityId[];
  canEditGroups: EntityId[];
  requireAuth: boolean;
}

export default ObjectPermissionsMixin;
