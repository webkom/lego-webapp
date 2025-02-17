import type { EntityId } from '@reduxjs/toolkit';
import type { PublicUser } from '~/redux/models/User';
import type { ContentTarget } from '~/redux/utils/contentTarget';

interface GalleryPicture {
  id: EntityId;
  gallery: EntityId;
  description: string;
  taggees: PublicUser[];
  active: boolean;
  file: string;
  thumbnail: string;
  rawFile: string;
  comments: EntityId[];
  contentTarget: ContentTarget;
}

export type GalleryCoverPicture = Pick<
  GalleryPicture,
  'file' | 'thumbnail' | 'id'
>;

export type GalleryListPicture = Pick<
  GalleryPicture,
  | 'id'
  | 'gallery'
  | 'description'
  | 'taggees'
  | 'active'
  | 'file'
  | 'thumbnail'
  | 'rawFile'
  | 'comments'
  | 'contentTarget'
>;

export type UnknownGalleryPicture = GalleryListPicture;
