import { describe, expect, it } from 'vitest';
import {
  getActiveGroupKeyword,
  getGroupKeywordSuggestions,
  parseGroupSearchQuery,
  replaceActiveGroupKeyword,
  serializeGroupSearchQuery,
} from '../searchGroupTags';

const availableGroups = [
  { id: 1, name: 'Webkom', type: 'komite' },
  { id: 2, name: 'Readme', type: 'komite' },
  { id: 3, name: 'Some Group', type: 'interesse' },
];

describe('searchGroupTags', () => {
  it('parses selected groups out of the raw query', () => {
    expect(
      parseGroupSearchQuery(
        ':Webkom :Some Group frontend search',
        availableGroups,
      ),
    ).toEqual({
      tags: [availableGroups[0], availableGroups[2]],
      text: 'frontend search',
    });
  });

  it('parses manually typed group tokens case-insensitively', () => {
    expect(
      parseGroupSearchQuery(':webkom frontend search', availableGroups),
    ).toEqual({
      tags: [availableGroups[0]],
      text: 'frontend search',
    });
  });

  it('serializes tags back into a query string', () => {
    expect(
      serializeGroupSearchQuery(
        [availableGroups[0], availableGroups[2]],
        'frontend search',
      ),
    ).toBe(':Webkom :Some Group frontend search');
  });

  it('finds the active keyword after the last colon trigger', () => {
    expect(getActiveGroupKeyword('frontend :we')).toEqual({
      query: 'we',
      startIndex: 9,
    });
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

  it('replaces the active keyword text after selection', () => {
    expect(replaceActiveGroupKeyword('frontend :we')).toBe('frontend');
  });
});
