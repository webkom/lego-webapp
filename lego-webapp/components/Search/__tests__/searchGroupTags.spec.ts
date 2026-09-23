import { describe, expect, it } from 'vitest';
import { GroupType } from 'app/models';
import {
  buildGroupFilterOptions,
  getActiveGroupKeyword,
  getGroupKeywordSuggestions,
  matchesGroupKeywords,
  replaceActiveGroupKeyword,
  toggleGroupTag,
} from '../searchGroupTags';
import type {
  GroupFilterCandidate,
  SearchGroupKeyword,
} from '../searchGroupTags';

const availableGroups: SearchGroupKeyword[] = [
  { id: 1, groupIds: [1], name: 'Webkom', type: GroupType.Committee },
  { id: 2, groupIds: [2], name: 'Readme', type: GroupType.Committee },
  { id: 3, groupIds: [3], name: 'Some Group', type: GroupType.Interest },
];

const gradeGroups: SearchGroupKeyword[] = [
  {
    id: 'grade-2',
    groupIds: [17, 23],
    name: '2. Klasse',
    type: GroupType.Grade,
  },
  {
    id: 'grade-1',
    groupIds: [16, 22],
    name: '1. Klasse',
    type: GroupType.Grade,
  },
];

describe('searchGroupTags', () => {
  it('toggles groups on and off the selected filter tags', () => {
    expect(toggleGroupTag([], availableGroups[0])).toEqual([
      availableGroups[0],
    ]);
    expect(toggleGroupTag([availableGroups[0]], availableGroups[0])).toEqual(
      [],
    );
    expect(toggleGroupTag([availableGroups[0]], availableGroups[1])).toEqual([
      availableGroups[0],
      availableGroups[1],
    ]);
  });

  it('replaces the selected grade but keeps membership tags', () => {
    expect(toggleGroupTag([gradeGroups[1]], gradeGroups[0])).toEqual([
      gradeGroups[0],
    ]);
    expect(
      toggleGroupTag([gradeGroups[1], availableGroups[0]], gradeGroups[0]),
    ).toEqual([gradeGroups[0], availableGroups[0]]);
  });

  it('finds the active keyword after the last colon trigger', () => {
    expect(getActiveGroupKeyword('frontend :we')).toEqual({
      query: 'we',
      startIndex: 9,
    });
  });

  it('opens suggestions for a bare colon at a word boundary', () => {
    expect(getActiveGroupKeyword(':')).toEqual({
      query: '',
      startIndex: 0,
    });
    expect(getActiveGroupKeyword('frontend :')).toEqual({
      query: '',
      startIndex: 9,
    });
    expect(getActiveGroupKeyword('https://abakus.no')).toBeNull();
  });

  it('suggests groups the user belongs to and excludes selected ones', () => {
    expect(
      getGroupKeywordSuggestions({
        availableGroups,
        selectedTags: [availableGroups[0]],
        text: 'frontend :re',
      }),
    ).toEqual([availableGroups[1]]);
  });

  it('sorts by group type and alphabetically within each type', () => {
    expect(
      getGroupKeywordSuggestions({
        availableGroups: [...availableGroups, ...gradeGroups],
        selectedTags: [],
        text: ':',
      }),
    ).toEqual([
      gradeGroups[1],
      gradeGroups[0],
      availableGroups[1],
      availableGroups[0],
      availableGroups[2],
    ]);

    expect(
      getGroupKeywordSuggestions({
        availableGroups,
        selectedTags: [],
        text: ':group',
      }),
    ).toEqual([availableGroups[2]]);
  });

  it('builds the canonical supported option list in category order', () => {
    const candidates: GroupFilterCandidate[] = [
      {
        id: 10,
        groupIds: [10],
        name: 'Hovedstyret',
        type: GroupType.Board,
      },
      {
        id: 11,
        groupIds: [11],
        name: 'Teknikk',
        type: GroupType.Revue,
      },
      {
        id: 12,
        groupIds: [12],
        name: 'Alpint',
        type: GroupType.Interest,
      },
      {
        id: 13,
        groupIds: [13],
        name: 'Backup',
        type: GroupType.Committee,
      },
      {
        id: 14,
        groupIds: [14],
        name: 'Abakus',
        type: GroupType.Other,
      },
      {
        id: 15,
        groupIds: [15],
        name: 'Unknown',
        type: 'mystery',
      },
      {
        id: 16,
        groupIds: [16],
        name: 'Formaterte',
        type: GroupType.SubGroup,
      },
      {
        id: 17,
        groupIds: [17],
        name: 'Ordenen',
        type: GroupType.Ordained,
      },
      ...gradeGroups,
      ...availableGroups,
    ];

    expect(
      buildGroupFilterOptions(candidates).map((group) => group.name),
    ).toEqual([
      '1. Klasse',
      '2. Klasse',
      'Backup',
      'Readme',
      'Webkom',
      'Alpint',
      'Some Group',
      'Teknikk',
      'Hovedstyret',
      'Formaterte',
      'Ordenen',
    ]);
  });

  it('merges duplicate suggestions and keeps all membership ids', () => {
    expect(
      getGroupKeywordSuggestions({
        availableGroups: [
          availableGroups[0],
          availableGroups[0],
          {
            id: 4,
            groupIds: [4],
            name: 'webkom',
            type: GroupType.Committee,
          },
        ],
        selectedTags: [],
        text: ':we',
      }),
    ).toEqual([{ ...availableGroups[0], groupIds: [1, 4] }]);

    expect(
      getGroupKeywordSuggestions({
        availableGroups: [availableGroups[0], availableGroups[0]],
        selectedTags: [availableGroups[0]],
        text: ':we',
      }),
    ).toEqual([]);
  });

  it('matches aggregate grade filters and regular group filters', () => {
    expect(matchesGroupKeywords([22], [gradeGroups[1]])).toBe(true);
    expect(matchesGroupKeywords([2], [availableGroups[0]])).toBe(false);
    expect(matchesGroupKeywords([], [])).toBe(true);
  });

  it('replaces the active keyword text after selection', () => {
    expect(replaceActiveGroupKeyword('frontend :we')).toBe('frontend');
  });
});
