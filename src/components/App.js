'use strict';

var React = require('react');
var {RouteHandler, Link} = require('react-router');
var LoginBox = require('./LoginBox');
var SearchBox = require('./SearchBox');
var Icon = require('./Icon');

var UserStore = require('../stores/UserStore');

var App = React.createClass({

  render: function() {
    return (
      <section>
        <header>
          <div className='content'>
            <ul>
              <li className='logo'><Link to='overview'>Abakus</Link></li>
              <li className='search-box'><SearchBox /></li>
              <li className='partner-logo'><a href='http://bekk.no'>Bekk</a></li>
              <li><LoginBox /></li>
            </ul>
          </div>
        </header>
        <nav>
          <ul className='content'>
            <li><Link to='overview'><Icon name='home' /> Oversikt</Link></li>
            <li><Link to='events'><Icon name='calendar' /> Arrangementer</Link></li>
            <li><Link to='events'><Icon name='info' /> Om Abakus</Link></li>
            <li><Link to='contact'><Icon name='phone' /> Kontakt</Link></li>
          </ul>
        </nav>

        <RouteHandler />

        <footer>
          <p>Abakus er best</p>
        </footer>
      </section>
    );
  }
});

module.exports = App;
