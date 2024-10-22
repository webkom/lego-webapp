import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';

interface LendableObject {
  id: EntityId;
  title: string;
  description: string;
  image: string;
  location: string;
  canLend: boolean;
  actionGrant: ActionGrant;
}

export type ListLendableObject = Pick<
  LendableObject,
  'id' | 'title' | 'description' | 'image' | 'location' | 'canLend'
> &
  ObjectPermissionsMixin;

export type DetailLendableObject = ListLendableObject &
  Pick<LendableObject, 'actionGrant'>;

export type UnknownLendableObject = ListLendableObject | DetailLendableObject;
