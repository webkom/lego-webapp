'use strict';

var React = require('react');

var LoadingIndicator = React.createClass({

  getDefaultProps: function() {
    return {
      loading: false
    };
  },

  render: function() {
    if (this.props.loading) {
      return (
        <div className='spinner'>
          <div className='double-bounce1'></div>
          <div className='double-bounce2'></div>
        </div>
      );
    }
    return this.props.children;
  },

});

module.exports = LoadingIndicator;
