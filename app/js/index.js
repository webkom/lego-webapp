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
var Login = require('./components/login');

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
          <ul className='content'>
            <li className='logo'><Link to="app">Abakus</Link></li>
            <li><input placeholder='Søk' /></li>
            <li><Login auth={this.state.auth} onLogin={this.login}/></li>
          </ul>
        </header>
        <nav>
          <ul className='content'>
            <li><Link to="app">Nyhetsstrøm</Link></li>
            <li><Link to="events">Arrangementer</Link></li>
            <li><Link to="events">Om Abakus</Link></li>
            <li><Link to="events">Kontakt</Link></li>
          </ul>
        </nav>

        <this.props.activeRouteHandler />
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
      <Route name="events" handler={Events}></Route>
      <DefaultRoute handler={Dashboard} />
    </Route>
    <NotFoundRoute handler={NotFound}/>
  </Routes>
), document.getElementById('app'));
