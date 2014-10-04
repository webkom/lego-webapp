/** @jsx React.DOM */

var React = require('react');

var SidebarBlock = React.createClass({
  getDefaultProps: function() {
    return {
      title: 'No title'
    };
  },

  render: function() {
    return (
      <div>
        <h2>{this.props.title}</h2>

        <div className='sidebar-block-content'>
          {this.props.children}
        </div>
      </div>
    );
  },
});

module.exports = SidebarBlock;
