import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicGroup } from 'app/store/models/Group';
import type { RoleType } from 'app/utils/constants';

export default interface Membership {
  id: EntityId;
  user: EntityId;
  abakusGroup: EntityId;
  role: RoleType;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
}

export interface PastMembership extends Membership {
  startDate: Dateish;
  endDate: Dateish;
  abakusGroup: PublicGroup;
}
