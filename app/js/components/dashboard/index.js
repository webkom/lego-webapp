/** @jsx React.DOM */

var React = require('react');
var Feed = require('./feed');

/**
 * Dashboard Component
 */

var Dashboard = module.exports = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    return (
      <section>
        <div className='content'>
          <h2>Nyhetsstrøm</h2>
          <Feed />
        </div>
      </section>
    );
  }
});
