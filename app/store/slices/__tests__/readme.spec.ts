import readme from '../readmeSlice';
import { Readme } from '../../../actions/ActionTypes';
describe('reducers', () => {
  describe('readme', () => {
    const prevState = undefined;
    it('Readme should populate default state correctly', () => {
      const randomAction = {};
      expect(readme(prevState, randomAction)).toEqual([]);
    });
    it('Readme should populate state correctly after fetch', () => {
      const action = {
        type: Readme.FETCH.SUCCESS,
        payload: [1, 2, 3],
      };
      expect(readme(prevState, action)).toEqual([1, 2, 3]);
    });
  });
});
