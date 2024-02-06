import { createReducer } from '@reduxjs/toolkit';
import { describe, it, expect } from 'vitest';
import { generateStatuses } from 'app/actions/ActionTypes';
import buildFetchingReducer from 'app/utils/legoAdapter/buildFetchingReducer';

describe('addFetchingReducer', () => {
  const FETCH = generateStatuses('FETCH');
  const NOT_FETCH = generateStatuses('NOT_FETCH');

  const baseAction = {
    meta: {
      endpoint: '/something',
      schemaKey: 'something',
    },
  };

  const reducer = createReducer({ fetching: false }, (builder) => {
    buildFetchingReducer(builder, [FETCH]);
  });

  it('should set fetching=true on BEGIN action', () => {
    expect(
      reducer({ fetching: false }, { ...baseAction, type: FETCH.BEGIN })
    ).toEqual({
      fetching: true,
    });
  });
  it('should set fetching=false on FAILURE action', () => {
    expect(
      reducer({ fetching: true }, { ...baseAction, type: FETCH.FAILURE })
    ).toEqual({
      fetching: false,
    });
  });
  it('should set fetching=false on SUCCESS action', () => {
    expect(
      reducer({ fetching: true }, { ...baseAction, type: FETCH.SUCCESS })
    ).toEqual({
      fetching: false,
    });
  });
  it("should ignore actions that don't match", () => {
    expect(
      reducer({ fetching: false }, { ...baseAction, type: NOT_FETCH.BEGIN })
    ).toEqual({
      fetching: false,
    });
    expect(
      reducer({ fetching: true }, { ...baseAction, type: NOT_FETCH.FAILURE })
    ).toEqual({
      fetching: true,
    });
    expect(
      reducer({ fetching: true }, { ...baseAction, type: NOT_FETCH.SUCCESS })
    ).toEqual({
      fetching: true,
    });
  });
});
