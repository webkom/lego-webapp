import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type Group from 'app/store/models/Group';
import type { RoleType } from 'app/utils/constants';

export default interface PastMembership {
  id: EntityId;
  abakusGroup: Group;
  role: RoleType;
  startDate: Dateish;
  endDate?: Dateish;
}
