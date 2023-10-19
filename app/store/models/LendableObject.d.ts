import type { RoleType } from 'app/utils/constants';
import type { EntityId } from '@reduxjs/toolkit';
import type { Duration } from 'moment-timezone';

interface LendableObject {
  id: EntityId;
  image: string;
  title: string;
  description: string;
  location: string;
  hasContract: boolean;
  maxLendingPeriod: null | string | Duration;
  //lendingCommentPrompt: string;
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
