import type { EntityId } from '@reduxjs/toolkit';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface GalleryPicture {
  id: EntityId;
  gallery: EntityId;
  description: string;
  taggees: EntityId[];
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

export type UnknownGalleryPicture = GalleryCoverPicture | GalleryListPicture;
