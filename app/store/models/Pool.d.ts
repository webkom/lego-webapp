import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { PublicGroup } from 'app/store/models/Group';

interface CompletePool {
  id: EntityId;
  name: string;
  capacity: number;
  activationDate: Dateish;
  permissionGroups: PublicGroup[];
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
  | 'registrationCount'
  | 'registrations'
>;

export type UnknownPool = PublicPool | AuthPool;
