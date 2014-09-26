/** @jsx React.DOM */

var React = require('react');
var moment = require('moment');


var Time = module.exports = React.createClass({

  propTypes: {
    format: React.PropTypes.string,
  },

  getDefaultProps: function() {
    return {
      format: 'YYYY-MM-d'
    };
  },

  render: function() {
    return <time dateTime={this.props.time}>{moment(this.props.time).format(this.props.format)}</time>;
  },

});
