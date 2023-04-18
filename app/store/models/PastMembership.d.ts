import type { Dateish } from 'app/models';
import type Group from 'app/store/models/Group';
import type { ID } from 'app/store/models/index';
import type { RoleType } from 'app/utils/constants';

export default interface PastMembership {
  id: ID;
  abakusGroup: Group;
  role: RoleType;
  startDate: Dateish;
  endDate?: Dateish;
}
