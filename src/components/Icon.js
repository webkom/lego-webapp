
var React = require('react');

/**
 * Render a Font-Awesome icon.
 */

var Icon = React.createClass({

  propTypes: {
    name: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      name: 'star'
    };
  },

  render: function() {
    return <i className={'fa fa-' + this.props.name} />;
  },

});

module.exports = Icon;