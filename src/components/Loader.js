import React, { Component, PropTypes } from 'react';

export default class LoadingIndicator extends Component {

  static propTypes = {
    loading: PropTypes.bool.isRequired
  }

  static defaultProps = {
    loading: false
  }

  render() {
    if (this.props.loading) {
      return (
        <div className='spinner'>
          <div className='double-bounce1'></div>
          <div className='double-bounce2'></div>
        </div>
      );
    }
    return this.props.children;
  }
}
