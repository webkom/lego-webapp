/** @jsx React.DOM */

var React = require('react');
var Link = require('react-router').Link;
var LoginBox = require('./LoginBox');
var Icon = require('./Icon');

var UserStore = require('../stores/UserStore');

var App = React.createClass({

  render: function() {
    return (
      <section>
        <header>
          <div className='content'>
            <ul>
              <li className='logo'><Link to="app">Abakus</Link></li>
              <li className='search-box'><input className='search' placeholder='Søk' /></li>
              <li className='partner-logo'><a href="http://bekk.no">Bekk</a></li>
              <li><LoginBox /></li>
            </ul>
          </div>
        </header>
        <nav>
          <ul className='content'>
            <li><Link to="app">Oversikt</Link></li>
            <li><Link to="events">Arrangementer</Link></li>
            <li><Link to="events">Om Abakus</Link></li>
            <li><Link to="events">Kontakt</Link></li>
            <li><Link to="events"><Icon name='bars' />Mer</Link></li>
          </ul>
        </nav>

        <this.props.activeRouteHandler />

        <footer>
          <p>Abakus er best</p>
        </footer>
      </section>
    );
  }
});

module.exports = App;
