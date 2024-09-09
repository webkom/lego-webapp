import type { EntityId } from '@reduxjs/toolkit';
import type { ActionGrant } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';

interface Page {
  pk: EntityId;
  title: string;
  slug: string;
  content: string;
  picture: string;
  picturePlaceholder: string;
  category: string;
  actionGrant: ActionGrant;
}

export type ListPage = Pick<Page, 'pk' | 'title' | 'slug' | 'category'>;

export type DetailedPage = Pick<
  Page,
  | 'pk'
  | 'title'
  | 'slug'
  | 'content'
  | 'picture'
  | 'picturePlaceholder'
  | 'category'
  | 'actionGrant'
>;

export type AuthDetailedPage = DetailedPage & ObjectPermissionsMixin;

export type UnknownPage = ListPage | DetailedPage | AuthDetailedPage;

export type SearchPage = Pick<
  Page,
  'title' | 'content' | 'slug' | 'picture' | 'category'
> & {
  id: EntityId;
};

export type AutocompletePage = Pick<
  Page,
  'title' | 'slug' | 'picture' | 'category' | 'id'
> & {
  contentType: AutocompleteContentType.Page;
  text: 'text';
};
