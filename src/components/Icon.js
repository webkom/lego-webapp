import React, { Component, PropTypes } from 'react';

/**
 * Render a Font-Awesome icon.
 */
export default class Icon extends Component {

  static propTypes = {
    name: React.PropTypes.string
  }

  static defaultProps = {
    name: 'star'
  }

  render() {
    return <i className={`fa fa-${this.props.name}`} />;
  }
}
