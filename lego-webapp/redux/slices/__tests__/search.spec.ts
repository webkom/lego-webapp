import { describe, it, expect } from 'vitest';
import { Search } from '~/redux/actionTypes';
import search from '../search';

describe('reducers', () => {
  describe('search', () => {
    it('Search should populate default state correctly', () => {
      const prevState = undefined;
      const randomAction = {};
      expect(search(prevState, randomAction)).toEqual({
        results: [],
        autocomplete: [],
        query: '',
        searching: false,
        open: false,
      });
    });
    it('Search.SEARCH.BEGIN', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: '',
        searching: false,
        open: false,
      };
      const action = {
        type: Search.SEARCH.BEGIN,
        meta: {
          query: 'abakus',
        },
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'abakus',
        searching: true,
        open: false,
      });
    });
    it('Search.AUTOCOMPLETE.BEGIN', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: '',
        searching: false,
        open: false,
      };
      const action = {
        type: Search.AUTOCOMPLETE.BEGIN,
        meta: {
          query: 'abakus',
        },
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'abakus',
        searching: true,
        open: false,
      });
    });
    it('Search.SEARCH.SUCCESS', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'abakus',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.SEARCH.SUCCESS,
        meta: {
          query: 'abakus',
        },
        payload: [1, 2, 3],
      };
      expect(search(prevState, action)).toEqual({
        results: [1, 2, 3],
        autocomplete: [],
        query: 'abakus',
        searching: false,
        open: false,
      });
    });
    it('Search.SEARCH.SUCCESS does nothing if query has changed', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.SEARCH.SUCCESS,
        meta: {
          query: 'abakus',
        },
        payload: [1, 2, 3],
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      });
    });
    it('Search.AUTOCOMPLETE.SUCCESS', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'abakus',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.AUTOCOMPLETE.SUCCESS,
        meta: {
          query: 'abakus',
        },
        payload: [1, 2, 3],
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [1, 2, 3],
        query: 'abakus',
        searching: false,
        open: false,
      });
    });
    it('Search.AUTOCOMPLETE.SUCCESS does nothing if query has changed', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.AUTOCOMPLETE.SUCCESS,
        meta: {
          query: 'abakus',
        },
        payload: [1, 2, 3],
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      });
    });
    it('Search.SEARCH.FAILURE', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.SEARCH.FAILURE,
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: false,
        open: false,
      });
    });
    it('Search.AUTOCOMPLETE.FAILURE', () => {
      const prevState = {
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: true,
        open: false,
      };
      const action = {
        type: Search.AUTOCOMPLETE.FAILURE,
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: 'hello',
        searching: false,
        open: false,
      });
    });
    it('Search.TOGGLE_OPEN works to open search', () => {
      const prevState = {
        results: [],
        autocomplete: [1, 2, 3],
        query: '',
        searching: false,
        open: false,
      };
      const action = {
        type: Search.TOGGLE_OPEN,
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: '',
        searching: false,
        open: true,
      });
    });
    it('Search.TOGGLE_OPEN works to close search', () => {
      const prevState = {
        results: [],
        autocomplete: [1, 2, 3],
        query: '',
        searching: false,
        open: true,
      };
      const action = {
        type: Search.TOGGLE_OPEN,
      };
      expect(search(prevState, action)).toEqual({
        results: [],
        autocomplete: [],
        query: '',
        searching: false,
        open: false,
      });
    });
  });
});
