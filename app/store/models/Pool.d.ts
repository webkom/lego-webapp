import type { Dateish } from 'app/models';
import type { PublicGroup } from 'app/store/models/Group';
import type { ID } from 'app/store/models/index';

interface CompletePool {
  id: ID;
  name: string;
  capacity: number;
  activationDate: Dateish;
  permissionGroups: PublicGroup[];
  registrationCount: number;
  registrations: ID[];
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
