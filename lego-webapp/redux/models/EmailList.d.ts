import type { EntityId } from '@reduxjs/toolkit';
import type { RoleType } from '~/utils/constants';

interface CompleteEmailList {
  id: EntityId;
  name: string;
  email: string;
  users: EntityId[];
  groups: EntityId[];
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
