import { DetailedLendableObject } from 'app/store/models/LendableObject';
import { EditingLendableObject } from './LendableObject.d';
import type { EntityId } from '@reduxjs/toolkit';
import type { RoleType } from 'app/utils/constants';
import type { Duration } from 'moment-timezone';

interface LendableObject {
  id: EntityId;
  image: string;
  title: string;
  description: string;
  location: string;
  hasContract: boolean;
  maxLendingPeriod: null | string | Duration;
  responsibleRoles: RoleType[];
  responsibleGroups: EntityId[];
}

export type ListLendableObject = Pick<LendableObject, 'id' | 'title' | 'image'>;
export type DetailedLendableObject = ListLendableObject &
  Pick<
    LendableObject,
    | 'description'
    | 'location'
    | 'hasContract'
    | 'maxLendingPeriod'
    | 'responsibleRoles'
    | 'responsibleGroups'
  >;

export type UnknownLendableObject = ListLendableObject | DetailedLendableObject;

export type EditingLendableObject = Omit<
  DetailedLendableObject, 
  | 'responsibleRoles' 
  | 'responsibleGroups'
  > & {
    responsibleRoles: { label: string, value: RoleType}[];
    responsibleGroups: PublicGroup[];
  }