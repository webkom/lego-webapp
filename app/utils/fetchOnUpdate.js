import React, { Component, PropTypes } from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';

function mapParams(watchParams, params) {
  return watchParams.reduce((total, key) => {
    total[key] = params[key];
    return total;
  }, {});
}

/**
Calls fn on route changes where watchParams are changed.
*/
function fetchOnUpdate(watchParams, fetch) {
  return (DecoratedComponent) =>
  class FetchOnUpdateDecorator extends Component {

    static propTypes = {
      params: PropTypes.object.isRequired
    };

    componentWillMount() {
      fetch(mapParams(watchParams, this.props), this.props);
    }

    componentDidUpdate(prevProps) {
      const params = mapParams(watchParams, this.props);
      const prevParams = mapParams(watchParams, prevProps);
      if (!shallowEqual(params, prevParams)) {
        fetch(params, this.props);
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
