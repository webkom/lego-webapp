'use strict';

var React = require('react');
var Router = require('react-router');
var RequireLogin = require('./RequireLogin');
var LoadingIndicator = require('./LoadingIndicator');

var EventStore = require('../stores/EventStore');
var EventService = require('../services/EventService');
var EventActionCreators = require('../actions/EventActionCreators');

var FavoritesActionCreators = require('../actions/FavoritesActionCreators');

var AuthMixin = require('./AuthMixin');

function getState(eventId) {
  return {
    event: EventStore.get(eventId|0)
  };
}

var EventPage = React.createClass({

  mixins: [AuthMixin, Router.State],

  getInitialState: function() {
    return getState(this.getParams().eventId);
  },

  _onChange: function() {
    this.setState(getState(this.getParams().eventId));
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this._onChange);
    EventService.findById(this.getParams().eventId, function(err, event) {
      if (err) return;
      EventActionCreators.receiveAll([event]);
    });
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
  },

  _onAddToFavorites: function() {
    FavoritesActionCreators.addFavorite(this.state.event);
  },

  render: function() {
    var event = this.state.event;
    return (
      <section>
        <LoadingIndicator loading={Object.keys(event).length === 0}>
          <div className='content event-page'>
            <h2 onClick={this._onAddToFavorites}>{event.name}</h2>
            <article>
              {event.description}
            </article>
            <div className='event-open-for'>
              <h3>Åpent for</h3>
              {(event.admissible_groups || []).map(function(group) {
                return <span key={'group-' + group.group}>{group.group}</span>;
              })}
            </div>

            <RequireLogin loggedIn={this.state.isLoggedIn}>
              <h3>Bli med på dette arrangementet</h3>
              <form className='event-participate'>
                <textarea placeholder='Melding til arrangører' />
                <button type='submit'>Bli med</button>

                <p>Påmeldingen stenger {event.registration_ends_at}</p>
              </form>
            </RequireLogin>
          </div>
        </LoadingIndicator>
      </section>
    );
  }
});

module.exports = EventPage;
