import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicGroup } from '~/redux/models/Group';

interface CompletePool {
  id: EntityId;
  name: string;
  capacity: number;
  activationDate: Dateish;
  permissionGroups: PublicGroup[];
  allPermissionGroupIds: EntityId[];
  registrationCount: number;
  registrations: EntityId[];
}

export type PublicPool = Pick<
  CompletePool,
  | 'id'
  | 'name'
  | 'capacity'
  | 'activationDate'
  | 'permissionGroups'
  | 'registrationCount'
>;

export type AuthPool = Pick<
  CompletePool,
  | 'id'
  | 'name'
  | 'capacity'
  | 'activationDate'
  | 'permissionGroups'
  | 'allPermissionGroupIds'
  | 'registrationCount'
  | 'registrations'
>;

export type UnknownPool = PublicPool | AuthPool;
