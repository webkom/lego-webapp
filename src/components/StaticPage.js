'use strict';

var React = require('react');

var StaticPage = React.createClass({
  render: function() {
    return (
      <section>
        <div className='content'>
          <h2>Statisk side</h2>
        </div>
      </section>
    );
  }
});

module.exports = StaticPage;
