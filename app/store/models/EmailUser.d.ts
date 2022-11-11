import type { ID } from 'app/store/models/index';

export default interface EmailUser {
  id: ID;
  user: ID;
  internalEmailEnabled: boolean;
  internalEmail: string;
}
