import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type ObjectPermissionsMixin from 'app/store/models/ObjectPermissionsMixin';
import type { ID } from 'app/store/models/index';

interface Page {
  pk: ID;
  title: string;
  slug: string;
  content: string;
  picture: string;
  picturePlaceholder: string;
  category: string;
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
>;

export type AuthDetailedPage = DetailedPage & ObjectPermissionsMixin;

export type UnknownPage = ListPage | DetailedPage | AuthDetailedPage;

export type SearchPage = Pick<
  Page,
  'title' | 'slug' | 'content' | 'picture' | 'category'
> & {
  id: ID;
};

export type AutocompletePage = Pick<
  Page,
  'title' | 'slug' | 'picture' | 'category' | 'id'
> & {
  contentType: AutocompleteContentType.Page;
  text: 'text';
};
