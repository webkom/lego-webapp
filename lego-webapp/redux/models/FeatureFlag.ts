import { EntityId } from '@reduxjs/toolkit';
import { FieldGroup } from './Group';

interface FeatureFlag {
  id: EntityId;
  identifier: string;
  isActive: boolean;
  percentage: number | null;
  displayGroups: FieldGroup[];
  allowedIdentifier: string | null;
  canSeeFlag: boolean;
}

export type AdminFeatureFlag = Pick<
  FeatureFlag,
  | 'id'
  | 'identifier'
  | 'displayGroups'
  | 'isActive'
  | 'percentage'
  | 'allowedIdentifier'
  | 'canSeeFlag'
>;

export type PublicFeatureFlag = Pick<
  FeatureFlag,
  'id' | 'identifier' | 'canSeeFlag'
>;

export type CreateFeatureFlag = Pick<FeatureFlag, 'identifier' | 'isActive'> & {
  displayGroups: EntityId[];
  percentage?: number;
  allowedIdentifier?: string;
};

export type EditFeatureFlag = Partial<
  Pick<
    FeatureFlag,
    'identifier' | 'isActive' | 'percentage' | 'allowedIdentifier'
  > & {
    displayGroups: EntityId[];
  }
>;

export type UnkownFeatureFlag = AdminFeatureFlag | PublicFeatureFlag;
