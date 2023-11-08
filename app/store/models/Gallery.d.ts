import type { Dateish } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { GalleryCoverPicture } from 'app/store/models/GalleryPicture';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { ID } from 'app/store/models/index';

interface Gallery {
  id: ID;
  title: string;
  description: string;
  cover: GalleryCoverPicture;
  location: string;
  takenAt: Dateish;
  createdAt: Dateish;
  pictureCount: number;
  event: ID;
  photographers: ID[];
  publicMetadata: unknown;
  pictures: ID[];
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

export type UnknownGallery =
  | ListGallery
  | AdminListGallery
  | DetailedGallery
  | SearchGallery
  | GalleryMetadata;
