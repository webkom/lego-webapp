import type { EntityId } from '@reduxjs/toolkit';

export type SearchGroupKeyword = {
  id: EntityId;
  name: string;
  type: string;
};

export type ParsedGroupSearchQuery = {
  text: string;
  tags: SearchGroupKeyword[];
};

type ActiveGroupKeyword = {
  query: string;
  startIndex: number;
};

const normalizeValue = (value: string) => value.trim().replace(/\s+/g, ' ');

const normalizeComparisonValue = (value: string) =>
  normalizeValue(value).toLowerCase();

const isBoundary = (value: string | undefined) => !value || /\s/.test(value);

export const serializeGroupSearchQuery = (
  tags: SearchGroupKeyword[],
  text: string,
) =>
  [...tags.map((tag) => `:${tag.name}`), normalizeValue(text)]
    .filter(Boolean)
    .join(' ')
    .trim();

export const parseGroupSearchQuery = (
  query: string,
  availableGroups: SearchGroupKeyword[],
): ParsedGroupSearchQuery => {
  if (!query) {
    return {
      text: '',
      tags: [],
    };
  }

  const sortedGroups = [...availableGroups].sort(
    (left, right) => right.name.length - left.name.length,
  );
  const normalizedQuery = query.toLowerCase();

  const tags: SearchGroupKeyword[] = [];
  const textSegments: string[] = [];
  let cursor = 0;

  while (cursor < query.length) {
    const currentGroup = sortedGroups.find((group) => {
      const token = `:${group.name}`;
      return (
        normalizedQuery.startsWith(token.toLowerCase(), cursor) &&
        isBoundary(query[cursor - 1]) &&
        isBoundary(query[cursor + token.length])
      );
    });

    if (currentGroup) {
      tags.push(currentGroup);
      cursor += currentGroup.name.length + 1;

      if (query[cursor] === ' ') {
        cursor += 1;
      }

      continue;
    }

    textSegments.push(query[cursor]);
    cursor += 1;
  }

  return {
    tags,
    text: normalizeValue(textSegments.join('')),
  };
};

export const getActiveGroupKeyword = (
  value: string,
): ActiveGroupKeyword | null => {
  const match = value.match(/(^|\s):([^\s]*)$/);
  if (!match || match.index == null) {
    return null;
  }

  return {
    query: match[2],
    startIndex: match.index + match[1].length,
  };
};

const sortGroups = (
  groups: SearchGroupKeyword[],
  query: string,
): SearchGroupKeyword[] => {
  const normalizedQuery = normalizeComparisonValue(query);
  return groups.toSorted((left, right) => {
    const leftName = normalizeComparisonValue(left.name);
    const rightName = normalizeComparisonValue(right.name);
    const leftStartsWith = leftName.startsWith(normalizedQuery);
    const rightStartsWith = rightName.startsWith(normalizedQuery);

    if (leftStartsWith !== rightStartsWith) {
      return leftStartsWith ? -1 : 1;
    }

    return leftName.localeCompare(rightName);
  });
};

export const getGroupKeywordSuggestions = ({
  availableGroups,
  selectedTags,
  text,
}: {
  availableGroups: SearchGroupKeyword[];
  selectedTags: SearchGroupKeyword[];
  text: string;
}) => {
  const activeKeyword = getActiveGroupKeyword(text);
  if (!activeKeyword) {
    return [];
  }

  const selectedIds = new Set(selectedTags.map((group) => String(group.id)));
  const filteredGroups = availableGroups.filter(
    (group) =>
      !selectedIds.has(String(group.id)) &&
      normalizeComparisonValue(group.name).includes(
        normalizeComparisonValue(activeKeyword.query),
      ),
  );

  return sortGroups(filteredGroups, activeKeyword.query);
};

export const replaceActiveGroupKeyword = (
  text: string,
  replacement = '',
): string => {
  const activeKeyword = getActiveGroupKeyword(text);
  if (!activeKeyword) {
    return normalizeValue(`${text} ${replacement}`);
  }

  return normalizeValue(
    `${text.slice(0, activeKeyword.startIndex)}${replacement}`,
  );
};

export const getGroupKeywordTypeLabel = (type: string) => {
  switch (type) {
    case 'komite':
      return 'Komite';
    case 'interesse':
      return 'Interessegruppe';
    case 'styre':
      return 'Styre';
    case 'revy':
      return 'Revy';
    default:
      return 'Gruppe';
  }
};
