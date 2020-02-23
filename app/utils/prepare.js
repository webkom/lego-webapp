// @flow
import { get } from 'lodash';
import React from 'react';
import { prepared } from '@webkom/react-prepare';
import { connect } from 'react-redux';
import { compose } from 'redux';
import type { Dispatch } from 'app/types';

type PrepareFn = (props: Object, dispatch: Dispatch<*>) => ?Promise<*>;
type ReactPrepareOpts = {
  pure?: boolean,
  componentDidMount?: boolean,
  componentWillReceiveProps?:
    | ((oldProps: any, newProps: any) => boolean)
    | boolean
};

const mapDispatch = dispatch => ({ dispatch });
const mapState = () => ({});
const injectDispatch = connect(
  mapState,
  mapDispatch
);

/**
 * A higher order component that calls prepareFn
 * whenever one of the given watchProps change.
 *
 * watchProps supports any strings that can be passed to _.get.
 *
 * opts are the options given to 'prepared()'. 'opts' will override
 * values generated inside prepare()
 */

export default function prepare(
  prepareFn: PrepareFn,
  watchProps?: Array<string> = [],
  opts?: ReactPrepareOpts = {}
) {
  // Returns true if any of the given watchProps have changed:
  // $FlowFixMe
  const componentWillReceiveProps = (oldProps: any, newProps: any): boolean =>
    watchProps
      .concat('loggedIn')
      .some(key => get(oldProps, key) !== get(newProps, key));

  const preparedOpts: ReactPrepareOpts = {
    componentWillReceiveProps,
    ...opts
  };
  return compose(
    injectDispatch,
    // This will force react-prepare to render the 'connect' on the line above during SSR,
    // making it forward dispatch
    // eslint-disable-next-line react/display-name
    ComponentType => props => <ComponentType {...props} />,
    prepared(props => prepareFn(props, props.dispatch), preparedOpts)
  );
}
