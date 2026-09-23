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
