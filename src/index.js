'use strict';

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
var ContactPage = require('./components/ContactPage');
var NotFoundPage = require('./components/NotFoundPage');

React.render((
  <Routes location="history">
    <Route handler={App}>
      <Route name="events" handler={EventCalendarPage} />
      <Route name="event" path="/events/:eventId" handler={EventPage} />
      <Route name="contact" handler={ContactPage} />
      <DefaultRoute name="overview" handler={FrontPage} />
    </Route>
    <NotFoundRoute handler={NotFoundPage}/>
  </Routes>
), document.getElementById('app'));
