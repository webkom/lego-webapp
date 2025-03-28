import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish } from 'app/models';
import type { AutocompleteContentType } from '~/redux/models/Autocomplete';
import type { PermissionAction } from '~/redux/models/ObjectPermissionsMixin';
import type { ReactionsGrouped } from '~/redux/models/Reaction';
import type { ContentTarget } from '~/utils/contentTarget';

type ArticlePermissions = PermissionAction | 'statistics';
interface CompleteArticle {
  id: EntityId;
  title: string;
  slug: string;
  cover: string;
  coverPlaceholder: string;
  authors: Array<EntityId>;
  description: string;
  comments: EntityId[];
  contentTarget: ContentTarget;
  tags: string[];
  content: string;
  createdAt: Dateish;
  pinned: boolean;
  reactionsGrouped?: ReactionsGrouped[];
  youtubeUrl: string;
  actionGrant: ArticlePermissions[];
}

export type DetailedArticle = Pick<
  CompleteArticle,
  | 'id'
  | 'title'
  | 'slug'
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
  | 'actionGrant'
>;

export type AdminDetailedArticle = DetailedArticle & ObjectPermissionsMixin;

export type AutocompleteArticle = Pick<
  CompleteArticle,
  'title' | 'cover' | 'description' | 'id'
> & {
  contentType: AutocompleteContentType.Article;
  text: 'text';
};

export type PublicArticle = Pick<
  CompleteArticle,
  | 'id'
  | 'title'
  | 'slug'
  | 'cover'
  | 'coverPlaceholder'
  | 'authors'
  | 'description'
  | 'tags'
  | 'createdAt'
  | 'pinned'
  | 'actionGrant'
>;

export type UnknownArticle = (
  | DetailedArticle
  | AdminDetailedArticle
  | PublicArticle
) & {
  comments?: EntityId[];
  reactionsGrouped?: ReactionsGrouped[];
};

export type SearchArticle = Pick<
  CompleteArticle,
  'id' | 'title' | 'cover' | 'description' | 'content' | 'pinned' | 'createdAt'
>;
