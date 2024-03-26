import type { ID } from 'app/store/models/index';
import type { RoleType } from 'app/utils/constants';

interface CompleteEmailList {
  id: ID;
  name: string;
  email: string;
  users: ID[];
  groups: ID[];
  groupRoles: RoleType[];
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

export type EditEmailList = DetailedEmailList;
export type CreateEmailList = Omit<EditEmailList, 'id'>;
