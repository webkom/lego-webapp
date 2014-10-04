/** @jsx React.DOM */

var React = require('react');
var ReactRouter = require('react-router');
var Routes = ReactRouter.Routes;
var Route = ReactRouter.Route;
var DefaultRoute = ReactRouter.DefaultRoute;
var NotFoundRoute = ReactRouter.NotFoundRoute;

var App = require('./components/App');
var FrontPage = require('./components/FrontPage');
var EventCalendarPage = require('./components/EventCalendarPage');
var EventPage = require('./components/EventPage');
var NotFoundPage = require('./components/NotFoundPage');

React.renderComponent((
  <Routes location="history">
    <Route name="app" path="/" handler={App}>
      <Route name="events" handler={EventCalendarPage}>
      </Route>
      <Route name="event" path="/events/:eventId" handler={EventPage} />
      <DefaultRoute handler={FrontPage} />
    </Route>
    <NotFoundRoute handler={NotFoundPage}/>
  </Routes>
), document.getElementById('app'));
