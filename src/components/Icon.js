import React from 'react';

/**
 * Render a Font-Awesome icon.
 */

var Icon = React.createClass({

  propTypes: {
    name: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      name: 'star'
    };
  },

  render() {
    return <i className={'fa fa-' + this.props.name} />;
  }
});

export default Icon;
