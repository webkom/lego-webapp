// @flow
import { get } from 'lodash';
import { dispatched } from '@webkom/react-prepare';
import type { Dispatch } from 'app/types';

type PrepareFn = (props: Object, dispatch: Dispatch<*>) => Promise<*>;

/**
 * A higher order component that calls prepareFn
 * whenever one of the given watchProps change.
 *
 * watchProps supports any strings that can be passed to _.get.
 */
export default function prepare(
  prepareFn: PrepareFn,
  watchProps?: Array<string> = []
) {
  // Returns true if any of the given watchProps have changed:
  const componentWillReceiveProps = (oldProps, newProps) =>
    watchProps
      .concat('loggedIn')
      .some(key => get(oldProps, key) !== get(newProps, key));

  return dispatched(prepareFn, { componentWillReceiveProps });
}
