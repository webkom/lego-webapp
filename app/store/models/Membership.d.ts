import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicUser } from 'app/store/models/User';
import type { RoleType } from 'app/utils/constants';

export default interface Membership {
  id: EntityId;
  user: PublicUser;
  abakusGroup: EntityId;
  role: RoleType;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
}
