import React, { Component, PropTypes } from 'react';
import cx from 'classnames';

/**
 * Render a Font-Awesome icon.
 */
export default class Icon extends Component {

  static propTypes = {
    name: PropTypes.string,
    scaleOnHover: PropTypes.bool
  };

  static defaultProps = {
    name: 'star',
    scaleOnHover: false
  };

  render() {
    return (
      <i
        className={cx(
          'fa',
          `fa-${this.props.name}`,
          this.props.scaleOnHover && 'u-scale-on-hover'
        )}
      />
    );
  }
}
