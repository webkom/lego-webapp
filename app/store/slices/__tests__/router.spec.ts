import routing, { setStatusCode } from 'app/store/slices/routerSlice';

describe('reducers', () => {
  describe('routing', () => {
    const prevState = undefined;
    it('Routing should populate default state correctly', () => {
      const randomAction = {
        type: 'RANDOM_ACTION',
      };
      expect(routing(prevState, randomAction)).toEqual({
        statusCode: null,
      });
    });
    it('Routing should populate state correctly after SET_STATUS_CODE', () => {
      const action = setStatusCode(400);
      expect(routing(prevState, action)).toEqual({
        statusCode: 400,
      });
    });
  });
});
