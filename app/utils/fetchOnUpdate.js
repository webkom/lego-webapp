import React, { Component } from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

function extractWatchedProps(watchProps, props) {
  return watchProps.reduce((total, key) => {
    total[key] = props[key];
    return total;
  }, {});
}

/**
 * A HOC that calls `fetchData` whenever one of the `watchProps`
 * are changed.
 */
function fetchOnUpdate(watchProps, fetchData) {
  return (DecoratedComponent) =>
  class FetchOnUpdateDecorator extends Component {
    componentWillMount() {
      fetchData(extractWatchedProps(watchProps, this.props), this.props);
    }

    componentWillReceiveProps(nextProps) {
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
