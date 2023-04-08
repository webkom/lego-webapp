import type { Dateish } from 'app/models';
import type { PublicUser } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';

export default interface Membership {
  id: ID;
  user: PublicUser;
  abakusGroup: ID;
  role: string;
  isActive: boolean;
  emailListsEnabled: boolean;
  createdAt: Dateish;
}
