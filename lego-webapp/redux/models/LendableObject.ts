import { FilterLendingCategory } from '~/utils/constants';
import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type ObjectPermissionsMixin from '~/redux/models/ObjectPermissionsMixin';

interface LendableObject {
  id: EntityId;
  title: string;
  description: string;
  image: string;
  location: string;
  canLend: boolean;
  actionGrant: ActionGrant;

  availability?: [Dateish, Dateish, String?, String?][];
  category: FilterLendingCategory;

}

export type ListLendableObject = Pick<
  LendableObject,
  | 'id'
  | 'title'
  | 'description'
  | 'image'
  | 'location'
  | 'canLend'
  | 'availability'
  | 'category'
> & { responsibleGroups: EntityId[] };

export type DetailLendableObject = ListLendableObject &
  Pick<LendableObject, 'actionGrant'> &
  ObjectPermissionsMixin;

export type UnknownLendableObject = ListLendableObject | DetailLendableObject;

export type EditLendableObject = Pick<
  LendableObject,
  'id' | 'title' | 'description' | 'image' | 'location' | 'category'
> & {
  canViewGroups: EntityId[];
  canEditGroups: EntityId[];
  canEditUsers: EntityId[];
};

export type CreateLendableObject = Omit<EditLendableObject, 'id'>;
