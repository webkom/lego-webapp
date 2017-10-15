// @flow
import { dispatched } from '@webkom/react-prepare';
import type { Dispatch } from 'app/types';

type PrepareFn = (props: Object, dispatch: Dispatch<*>) => Promise<*>;

/**
 * A higher order component that calls prepareFn
 * whenever one of the given watchProps change.
 */
export default function prepare(
  prepareFn: PrepareFn,
  watchProps: Array<string>
) {
  // Returns true if any of the given watchProps have changed:
  const componentWillReceiveProps = (oldProps, newProps) =>
    watchProps.some(key => oldProps[key] !== newProps[key]);

  return dispatched(prepareFn, { componentWillReceiveProps });
}
