import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import promise from '../../utils/promiseMiddleware';
import { search } from '../SearchActions';
import { Search } from '../ActionTypes';

const mockStore = configureMockStore([thunk, promise]);

describe('SearchActions', () => {
  describe('search', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('create an action to search', done => {
      nock('http://localhost:8000')
        .get('/api/v1/search/')
        .reply(200, { body: [{ title: 'Hello World' }] });

      const expectedActions = [{
        type: Search.SEARCH_BEGIN,
        meta: { query: 'Hello World' },
        payload: undefined
      }, {
        type: Search.SEARCH_SUCCESS,
        meta: { query: 'Hello World' },
        payload: { body: [{ title: 'Hello World' }] }
      }];

      const store = mockStore({ results: [], auth: {} }, expectedActions, done);
      store.dispatch(search('Hello World'));
    });
  });
});
