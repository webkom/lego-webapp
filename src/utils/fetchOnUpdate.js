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
function fetchOnUpdate(watchParams, fn) {
  return DecoratedComponent =>
  class FetchOnUpdateDecorator extends Component {

    static propTypes = {
      params: PropTypes.object.isRequired
    }

    componentWillMount() {
      fn(mapParams(watchParams, this.props.params), this.props);
    }

    componentDidUpdate(prevProps) {
      const params = mapParams(watchParams, this.props.params);
      const prevParams = mapParams(watchParams, prevProps.params);

      if (!shallowEqual(params, prevParams)) {
        fn(params, this.props);
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
