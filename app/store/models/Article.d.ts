import type { Dateish } from 'app/models';
import type AllowedPermissionsMixin from 'app/store/models/AllowedPermissionsMixin';
import type { PublicGroup } from 'app/store/models/Group';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { PublicUser } from 'app/store/models/User';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface CompleteArticle {
  id: ID;
  title: string;
  cover: string;
  coverPlaceholder: string;
  authors: Array<ID>;
  description: string;
  comments: ID[];
  contentTarget: ContentTarget;
  tags: string[];
  content: string;
  createdAt: Dateish;
  pinned: boolean;
  reactionsGrouped?: ReactionsGrouped[];
  youtubeUrl: string;
  canEditUsers: PublicUser[];
  canViewGroups: PublicGroup[];
  canEditGroups: PublicGroup[];
}

export type DetailedArticle = Pick<
  CompleteArticle,
  | 'id'
  | 'title'
  | 'cover'
  | 'coverPlaceholder'
  | 'authors'
  | 'description'
  | 'comments'
  | 'contentTarget'
  | 'tags'
  | 'content'
  | 'createdAt'
  | 'pinned'
  | 'reactionsGrouped'
  | 'youtubeUrl'
  | 'canEditUsers'
  | 'canViewGroups'
  | 'canEditGroups'
> &
  AllowedPermissionsMixin;

export type AdminDetailedArticle = DetailedArticle & ObjectPermissionsMixin;

export type PublicArticle = Pick<
  CompleteArticle,
  | 'id'
  | 'title'
  | 'cover'
  | 'coverPlaceholder'
  | 'authors'
  | 'description'
  | 'tags'
  | 'createdAt'
  | 'pinned'
> &
  AllowedPermissionsMixin;

export type UnknownArticle = (
  | DetailedArticle
  | AdminDetailedArticle
  | PublicArticle
) & {
  comments?: ID[];
  reactionsGrouped?: ReactionsGrouped[];
};

export type SearchArticle = Pick<
  CompleteArticle,
  'id' | 'title' | 'cover' | 'description' | 'content' | 'pinned' | 'createdAt'
>;
