/** @jsx React.DOM */

var React = require('react');

var Icon = module.exports = React.createClass({

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
