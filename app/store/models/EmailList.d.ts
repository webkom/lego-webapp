import type { ID } from 'app/store/models/index';

interface CompleteEmailList {
  id: ID;
  name: string;
  email: string;
  users: ID[];
  groups: ID[];
  groupRoles: string[];
  requireInternalAddress: boolean;
  additionalEmails?: string[];
}

export type PublicEmailList = Pick<
  CompleteEmailList,
  | 'id'
  | 'users'
  | 'name'
  | 'email'
  | 'groups'
  | 'groupRoles'
  | 'requireInternalAddress'
>;

export type DetailedEmailList = Pick<
  CompleteEmailList,
  | 'id'
  | 'name'
  | 'email'
  | 'users'
  | 'groups'
  | 'groupRoles'
  | 'requireInternalAddress'
  | 'additionalEmails'
>;

export type UnknownEmailList = PublicEmailList | DetailedEmailList;
