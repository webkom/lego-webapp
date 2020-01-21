// @flow
import type { Dispatch } from 'app/types';

const dispatchInOrder = async (
  actions: Array<Function>,
  dispatch: Dispatch<*>,
  ...args: Array<any>
) => {
  const promiseArray = [];
  for (const action of actions) {
    promiseArray.push(await dispatch(action(...args)));
  }
  return promiseArray;
};

export default dispatchInOrder;
