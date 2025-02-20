import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { RoleType } from 'app/utils/constants';
import type { PublicGroup } from '~/redux/models/Group';

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
