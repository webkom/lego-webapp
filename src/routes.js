'use strict';

var React = require('react');
var Router = require('react-router');
var {Routes, Route, DefaultRoute, NotFoundRoute} = Router;

var App = require('./components/App');
var Overview = require('./components/Overview');
var EventCalendarPage = require('./components/EventCalendarPage');
var EventPage = require('./components/EventPage');
var NotFoundPage = require('./components/NotFoundPage');
var StaticPage = require('./components/StaticPage');

var routes = (
  <Route handler={App} path='/'>
    <Route name='events' handler={EventCalendarPage} />
    <Route name='event' path='/events/:eventId' handler={EventPage} />
    <Route name='staticPage' path='/p/:pageSlug' handler={StaticPage} />
    <DefaultRoute name='overview' handler={Overview} />
    <NotFoundRoute handler={NotFoundPage} />
  </Route>
);

module.exports = routes;
