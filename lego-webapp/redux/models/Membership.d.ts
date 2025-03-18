import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicGroup } from '~/redux/models/Group';
import type { RoleType } from '~/utils/constants';

export default interface Membership {
  id: EntityId;
  user: EntityId;
  abakusGroup: EntityId;
  role: RoleType;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
  firstJoinDate: Dateish; //This is the first date the member joined this group based on history
}

export interface PastMembership extends Membership {
  startDate: Dateish;
  endDate: Dateish;
  abakusGroup: PublicGroup;
}
