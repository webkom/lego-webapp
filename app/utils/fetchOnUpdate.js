// @flow

import React, { Component } from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

function extractWatchedProps<Props: Object>(
  watchProps: Array<$Enum<Props>>,
  props: Props
): $Shape<Props> {
  return watchProps.reduce(
    (total, key) => {
      total[key] = props[key];
      return total;
    },
    {}
  );
}

/**
 * A HOC that calls `fetchData` whenever one of the `watchProps`
 * are changed.
 */
function fetchOnUpdate<Props: Object>(
  watchProps: Array<$Enum<Props>>,
  fetchData: (params: $Shape<Props>, props: Props) => void
): (DecoratedComponent: ReactClass<*>) => ReactClass<*> {
  return DecoratedComponent => class extends Component {
    state = {
      error: null,
      loading: true
    };

    componentDidMount() {
      this.fetchData(extractWatchedProps(watchProps, this.props), this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
      const params = extractWatchedProps(watchProps, this.props);
      const nextParams = extractWatchedProps(watchProps, nextProps);

      if (!shallowEqual(params, nextParams)) {
        this.fetchData(nextParams, nextProps);
      }
    }

    fetchData = (params, props) => {
      const maybePromise = fetchData(params, props);
      if (!maybePromise || typeof maybePromise.then !== 'function') {
        return;
      }

      maybePromise.then(
        () => this.setState({ loading: false }),
        error => this.setState({ error: error.payload, loading: false })
      );
    };

    render() {
      return <DecoratedComponent {...this.state} {...this.props} />;
    }
  };
}

export default fetchOnUpdate;
