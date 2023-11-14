import { withPreparedEffect } from '@webkom/react-prepare';
import { connect } from 'react-redux';
import { compose } from 'redux';
import type { PreparedEffectOptions } from '@webkom/react-prepare';
import type { AppDispatch } from 'app/store/createStore';
import type { DependencyList } from 'react';

const mapDispatch = (dispatch: AppDispatch) => ({ dispatch });
/**
 * A higher order component that calls prepareFn
 * whenever one of the given watchProps change.
 *
 * watchProps supports any strings that can be passed to _.get.
 *
 * opts are the options given to 'prepared()'. 'opts' will override
 * values generated inside prepare()
 */

const withPreparedDispatch = <P>(
  key: string,
  prepareDispatchFn: (props: P, dispatch: AppDispatch) => Promise<unknown>,
  depsFn?: (props: P) => DependencyList,
  options?: PreparedEffectOptions
) =>
  compose(
    connect(undefined, mapDispatch),
    withPreparedEffect<P & { dispatch: AppDispatch }>(
      key,
      (props) => prepareDispatchFn(props, props.dispatch),
      depsFn,
      options
    )
  );

export default withPreparedDispatch;
