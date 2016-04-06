import expect from 'expect';
import reducer from '../search';
import { Search } from '../../actions/ActionTypes';

const initialState = {
  query: '',
  results: [],
  searching: false
};

describe('reducers', () => {
  describe('search', () => {
    it('should return the initial state', () => {
      expect(reducer(undefined, {})).toEqual(initialState);
    });

    it('should handle SEARCH_BEGIN', () => {
      expect(reducer(initialState, {
        type: Search.SEARCH_BEGIN,
        meta: { query: 'hello world' }
      })).toEqual({
        query: 'hello world',
        results: [],
        searching: true
      });
    });

    it('should handle SEARCH_SUCCESS', () => {
      expect(reducer(initialState, {
        type: Search.SEARCH_SUCCESS,
        payload: [123, 456],
        meta: { query: '' }
      })).toEqual({
        query: '',
        results: [123, 456],
        searching: false
      });
    });

    it('should do nothing if receiving old results', () => {
      expect(reducer(initialState, {
        type: Search.SEARCH_SUCCESS,
        meta: { query: 'foo' }
      })).toEqual(initialState);
    });
  });
});
