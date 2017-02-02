// @flow

import React, { Component } from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import NProgress from 'nprogress';

function extractWatchedProps<Props: Object>(
  watchProps: Array<$Enum<Props>>,
  props: Props
): $Shape<Props> {
  return watchProps.reduce((total, key) => {
    total[key] = props[key];
    return total;
  }, {});
}

/**
 * A HOC that calls `fetchData` whenever one of the `watchProps`
 * are changed.
 */
function fetchOnUpdate<Props: Object>(
  watchProps: Array<$Enum<Props>>,
  fetchData: (params: $Shape<Props>, props: Props) => void
): (DecoratedComponent: ReactClass<*>) => ReactClass<*> {
  return (DecoratedComponent) => class extends Component {

    componentDidMount() {
      NProgress.start();
      fetchData(
        extractWatchedProps(watchProps, this.props),
        this.props
      ).then((value) => {
        NProgress.done();
        return value;
      });
    }

    componentWillReceiveProps(nextProps: Props) {
      const params = extractWatchedProps(watchProps, this.props);
      const nextParams = extractWatchedProps(watchProps, nextProps);

      if (!shallowEqual(params, nextParams)) {
        fetchData(nextParams, nextProps);
      }
    }

    render() {
      return (
        <DecoratedComponent {...this.props} />
      );
    }
  };
}

export default fetchOnUpdate;
