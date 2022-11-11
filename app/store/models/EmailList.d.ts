import type { ID } from 'app/store/models/index';

export default interface EmailList {
  id: ID;
  name: string;
  email: string;
  users: ID[];
  groups: ID[];
  groupRoles: string[];
  requireInternalAddress: boolean;
  additionalEmails?: string[];
}
