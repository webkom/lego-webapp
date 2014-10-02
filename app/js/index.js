/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router');
var Routes = ReactRouter.Routes;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;
var Link = ReactRouter.Link;

var Dashboard = require('./components/dashboard');
var Events = require('./components/events');
var Event = require('./components/events/event');
var Login = require('./components/login');
var Icon = require('./components/icon');

var App = React.createClass({

  getInitialState: function() {
    return {
      auth: false
    };
  },

  login: function() {
    this.setState({auth: true});
  },

  render: function() {
    return (
      <section>
        <header>
          <div className='content'>
            <ul>
              <li className='logo'><Link to="app">Abakus</Link></li>
              <li className='search-box'><input className='search' placeholder='Søk' /></li>
              <li className='partner-logo'><a href="http://bekk.no">Bekk</a></li>
              <li><Login auth={this.state.auth} onLogin={this.login}/></li>
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

var NotFound = React.createClass({
  render: function() {
    return (
      <h1>Not Found</h1>
    );
  }
})

React.renderComponent((
  <Routes location="history">
    <Route name="app" path="/" handler={App}>
      <Route name="events" handler={Events}>
      </Route>
      <Route name="event" path="/events/:eventId" handler={Event}/>
      <DefaultRoute handler={Dashboard} />
    </Route>
    <NotFoundRoute handler={NotFound}/>
  </Routes>
), document.getElementById('app'));
