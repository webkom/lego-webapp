import { GroupType } from 'app/models';
import type { EntityId } from '@reduxjs/toolkit';

export type SupportedGroupType = Exclude<GroupType, GroupType.Other>;

export type SearchGroupKeyword = {
  id: EntityId;
  groupIds: EntityId[];
  name: string;
  type: SupportedGroupType;
};

export type GroupFilterCandidate = Omit<SearchGroupKeyword, 'type'> & {
  type: string;
};

type ParsedGroupSearchQuery = {
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

const uniqueEntityIds = (ids: EntityId[]) =>
  Array.from(new Map(ids.map((id) => [String(id), id])).values());

const supportedGroupTypes = [
  GroupType.Grade,
  GroupType.Committee,
  GroupType.Interest,
  GroupType.Revue,
  GroupType.Board,
  GroupType.SubGroup,
  GroupType.Ordained,
] as const satisfies readonly SupportedGroupType[];

export const isSupportedGroupType = (
  type: string,
): type is SupportedGroupType =>
  (supportedGroupTypes as readonly string[]).includes(type);

const mergeDuplicateGroups = (groups: SearchGroupKeyword[]) => {
  const groupsByName = new Map<string, SearchGroupKeyword>();

  groups.forEach((group) => {
    const nameKey = normalizeComparisonValue(group.name);
    const existingGroup = groupsByName.get(nameKey);

    groupsByName.set(
      nameKey,
      existingGroup
        ? {
            ...existingGroup,
            groupIds: uniqueEntityIds([
              ...existingGroup.groupIds,
              ...group.groupIds,
            ]),
          }
        : {
            ...group,
            groupIds: uniqueEntityIds(group.groupIds),
          },
    );
  });

  return Array.from(groupsByName.values());
};

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

  const sortedGroups = buildGroupFilterOptions(availableGroups).sort(
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
    tags: mergeDuplicateGroups(tags),
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

const sortGroups = (groups: SearchGroupKeyword[]): SearchGroupKeyword[] => {
  const typeOrder: Record<SupportedGroupType, number> = {
    [GroupType.Grade]: 0,
    [GroupType.Committee]: 1,
    [GroupType.Interest]: 2,
    [GroupType.Revue]: 3,
    [GroupType.Board]: 4,
    [GroupType.SubGroup]: 5,
    [GroupType.Ordained]: 6,
  };

  return groups.toSorted((left, right) => {
    const typeDifference = typeOrder[left.type] - typeOrder[right.type];

    if (typeDifference !== 0) {
      return typeDifference;
    }

    const leftName = normalizeComparisonValue(left.name);
    const rightName = normalizeComparisonValue(right.name);

    return leftName.localeCompare(rightName);
  });
};

export const buildGroupFilterOptions = (
  groups: readonly GroupFilterCandidate[],
): SearchGroupKeyword[] =>
  sortGroups(
    mergeDuplicateGroups(
      groups.flatMap((group) =>
        isSupportedGroupType(group.type)
          ? [{ ...group, type: group.type }]
          : [],
      ),
    ),
  );

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

  const selectedNames = new Set(
    selectedTags.map((group) => normalizeComparisonValue(group.name)),
  );
  const filteredGroups = buildGroupFilterOptions(availableGroups).filter(
    (group) =>
      !selectedNames.has(normalizeComparisonValue(group.name)) &&
      normalizeComparisonValue(group.name).includes(
        normalizeComparisonValue(activeKeyword.query),
      ),
  );

  return sortGroups(filteredGroups);
};

export const matchesGroupKeywords = (
  userGroupIds: EntityId[],
  keywords: SearchGroupKeyword[],
) => {
  if (keywords.length === 0) return true;

  const userGroupIdSet = new Set(userGroupIds.map(String));
  return keywords.some((keyword) =>
    keyword.groupIds.some((groupId) => userGroupIdSet.has(String(groupId))),
  );
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

const groupTypeLabels: Record<SupportedGroupType, string> = {
  [GroupType.Grade]: 'Klasse',
  [GroupType.Committee]: 'Komite',
  [GroupType.Interest]: 'Interessegruppe',
  [GroupType.Revue]: 'Revy',
  [GroupType.Board]: 'Styre',
  [GroupType.SubGroup]: 'Undergruppe',
  [GroupType.Ordained]: 'Ordenen',
};

export const getGroupKeywordTypeLabel = (type: SupportedGroupType) =>
  groupTypeLabels[type];
