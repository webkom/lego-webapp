var React = require('react');
var Router = require('react-router');
var {Routes, Route, DefaultRoute, NotFoundRoute} = Router;

var App = require('./components/App');
var FrontPage = require('./components/FrontPage');
var EventCalendarPage = require('./components/EventCalendarPage');
var EventPage = require('./components/EventPage');
var ContactPage = require('./components/ContactPage');
var NotFoundPage = require('./components/NotFoundPage');

var routes = (
  <Route handler={App} path='/'>
    <Route name="events" handler={EventCalendarPage} />
    <Route name="event" path="/events/:eventId" handler={EventPage} />
    <Route name="contact" handler={ContactPage} />
    <DefaultRoute name="overview" handler={FrontPage} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

module.exports = routes;
