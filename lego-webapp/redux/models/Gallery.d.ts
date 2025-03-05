import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant, Dateish } from 'app/models';
import type { AutocompleteContentType } from '~/redux/models/Autocomplete';
import type { PublicEvent } from '~/redux/models/Event';
import type { GalleryCoverPicture } from '~/redux/models/GalleryPicture';
import type ObjectPermissionsMixin from '~/redux/models/ObjectPermissionsMixin';
import type { PublicUser } from '~/redux/models/User';

interface Gallery {
  id: EntityId;
  title: string;
  description: string;
  cover?: GalleryCoverPicture;
  location: string;
  takenAt: Dateish;
  createdAt: Dateish;
  pictureCount: number;
  event: PublicEvent;
  photographers: PublicUser[];
  publicMetadata: unknown;
  pictures: EntityId[];
  actionGrant: ActionGrant;
}

export type ListGallery = Pick<
  Gallery,
  | 'id'
  | 'title'
  | 'cover'
  | 'location'
  | 'takenAt'
  | 'createdAt'
  | 'pictureCount'
>;

export type AdminListGallery = ListGallery & ObjectPermissionsMixin;

export type DetailedGallery = Pick<
  Gallery,
  | 'id'
  | 'title'
  | 'description'
  | 'location'
  | 'takenAt'
  | 'createdAt'
  | 'event'
  | 'photographers'
  | 'cover'
  | 'publicMetadata'
  | 'pictures'
  | 'actionGrant'
>;

export type SearchGallery = Pick<
  Gallery,
  'id' | 'title' | 'location' | 'description'
>;

export type AutocompleteGallery = Pick<Gallery, 'title' | 'id'> & {
  contentType: AutocompleteContentType.Gallery;
  text: 'text';
};

export type GalleryMetadata = Pick<
  Gallery,
  'id' | 'title' | 'description' | 'cover'
>;

export type UnknownGallery = ListGallery | AdminListGallery | DetailedGallery;
