import type { Dateish } from 'app/models';
import type Group from 'app/store/models/Group';
import type { ID } from 'app/store/models/index';

export default interface PastMembership {
  id: ID;
  abakusGroup: Group;
  role: string;
  startDate: Dateish;
  endDate?: Dateish;
}
