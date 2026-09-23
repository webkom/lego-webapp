import { GroupType } from 'app/models';
import type { EntityId } from '@reduxjs/toolkit';

export type SupportedGroupType =
  | Exclude<GroupType, GroupType.Other>
  | 'studieretning';

export type SearchGroupKeyword = {
  id: EntityId;
  groupIds: EntityId[];
  name: string;
  type: SupportedGroupType;
  aliases?: string[];
};

export type GroupFilterCandidate = Omit<SearchGroupKeyword, 'type'> & {
  type: string;
};

type ActiveGroupKeyword = {
  query: string;
  startIndex: number;
};

const normalizeValue = (value: string) => value.trim().replace(/\s+/g, ' ');

const normalizeComparisonValue = (value: string) =>
  normalizeValue(value).toLowerCase();

const uniqueEntityIds = (ids: EntityId[]) =>
  Array.from(new Map(ids.map((id) => [String(id), id])).values());

const supportedGroupTypes = [
  GroupType.Grade,
  'studieretning',
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
    const mergedAliases = Array.from(
      new Set([...(existingGroup?.aliases ?? []), ...(group.aliases ?? [])]),
    );

    groupsByName.set(
      nameKey,
      existingGroup
        ? {
            ...existingGroup,
            groupIds: uniqueEntityIds([
              ...existingGroup.groupIds,
              ...group.groupIds,
            ]),
            ...(mergedAliases.length > 0 ? { aliases: mergedAliases } : {}),
          }
        : {
            ...group,
            groupIds: uniqueEntityIds(group.groupIds),
            ...(mergedAliases.length > 0 ? { aliases: mergedAliases } : {}),
          },
    );
  });

  return Array.from(groupsByName.values());
};

export const toggleGroupTag = (
  selectedTags: SearchGroupKeyword[],
  group: SearchGroupKeyword,
): SearchGroupKeyword[] => {
  const isSelected = selectedTags.some(
    (tag) => String(tag.id) === String(group.id),
  );

  if (isSelected) {
    return selectedTags.filter((tag) => String(tag.id) !== String(group.id));
  }

  if (group.type === GroupType.Grade) {
    return [
      group,
      ...selectedTags.filter((tag) => tag.type !== GroupType.Grade),
    ];
  }

  if (group.type === 'studieretning') {
    return [
      group,
      ...selectedTags.filter((tag) => tag.type !== 'studieretning'),
    ];
  }

  return [...selectedTags, group];
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
    studieretning: 1,
    [GroupType.Committee]: 2,
    [GroupType.Interest]: 3,
    [GroupType.Revue]: 4,
    [GroupType.Board]: 5,
    [GroupType.SubGroup]: 6,
    [GroupType.Ordained]: 7,
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
  const query = normalizeComparisonValue(activeKeyword.query);
  const filteredGroups = buildGroupFilterOptions(availableGroups).filter(
    (group) => {
      if (selectedNames.has(normalizeComparisonValue(group.name))) {
        return false;
      }
      const nameMatch = normalizeComparisonValue(group.name).includes(query);
      const aliasMatch = group.aliases?.some((alias) =>
        normalizeComparisonValue(alias).includes(query),
      );
      return nameMatch || Boolean(aliasMatch);
    },
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
  studieretning: 'Studieretning',
  [GroupType.Committee]: 'Komite',
  [GroupType.Interest]: 'Interessegruppe',
  [GroupType.Revue]: 'Revy',
  [GroupType.Board]: 'Styre',
  [GroupType.SubGroup]: 'Undergruppe',
  [GroupType.Ordained]: 'Ordenen',
};

export const getGroupKeywordTypeLabel = (type: SupportedGroupType) =>
  groupTypeLabels[type];
