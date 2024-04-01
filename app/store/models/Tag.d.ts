import type { EntityId } from '@reduxjs/toolkit';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';

enum TaggedType {
  Article = 'article',
  Event = 'event',
  Joblisting = 'joblisting',
  Poll = 'poll',
  Quote = 'quote',
}

interface Tag {
  tag: string;
  usages: number;
  relatedCounts: {
    [key in TaggedType]: number;
  };
}

export type ListTag = Pick<Tag, 'tag' | 'usages'>;

export type DetailedTag = Pick<Tag, 'tag' | 'usages' | 'relatedCounts'>;

export type UnknownTag = ListTag | DetailedTag;

export type SearchTag = Pick<Tag, 'tag'> & { id: EntityId };

export type AutocompleteTag = Pick<Tag, 'tag'> & {
  id: EntityId;
  contentType: AutocompleteContentType.Tag;
  text: 'text';
};
