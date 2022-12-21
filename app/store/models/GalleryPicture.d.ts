import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface GalleryPicture {
  id: ID;
  gallery: ID;
  description: string;
  taggees: ID[];
  active: boolean;
  file: string;
  thumbnail: string;
  rawFile: string;
  comments: ID[];
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
