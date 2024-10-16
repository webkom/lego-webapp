import type { EntityId } from '@reduxjs/toolkit';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';

interface LendableObject {
  id: EntityId;
  title: string;
  description: string;
  image: string;
  location: string;
}

export type ListLendableObject = Pick<
  LendableObject,
  'id' | 'title' | 'description' | 'image' | 'location'
> &
  ObjectPermissionsMixin;

export type UnknownLendableObject = ListLendableObject;
