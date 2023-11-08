import type { Dateish } from 'app/models';
import type AllowedPermissionsMixin from 'app/store/models/AllowedPermissionsMixin';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { ReactionsGrouped } from 'app/store/models/Reaction';
import type { ID } from 'app/store/models/index';
import type { ContentTarget } from 'app/store/utils/contentTarget';

interface CompleteArticle {
  id: ID;
  title: string;
  slug: string;
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
> &
  AllowedPermissionsMixin;

export type AdminDetailedArticle = DetailedArticle & ObjectPermissionsMixin;

export type SearchArticle = Pick<
  CompleteArticle,
  'id' | 'title' | 'cover' | 'description' | 'content' | 'pinned' | 'createdAt'
>;

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
> &
  AllowedPermissionsMixin;

export type UnknownArticle =
  | DetailedArticle
  | AdminDetailedArticle
  | SearchArticle
  | PublicArticle;
