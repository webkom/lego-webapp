import React from 'react';
import Router from 'react-router';
import RequireLogin from './RequireLogin';
import LoadingIndicator from './LoadingIndicator';
import EventStore from '../stores/EventStore';
import * as EventService from '../services/EventService';
import EventActions from '../actions/EventActions';
import FavoritesActions from '../actions/FavoritesActions';
import AuthMixin from './AuthMixin';

function getState(eventId) {
  return {
    event: EventStore.get(eventId | 0)
  };
}

var EventPage = React.createClass({

  mixins: [AuthMixin, Router.State],

  getInitialState() {
    return getState(this.getParams().eventId);
  },

  _onChange() {
    this.setState(getState(this.getParams().eventId));
  },

  componentDidMount() {
    EventStore.addChangeListener(this._onChange);
    EventService.findById(this.getParams().eventId)
      .then(function(event) {
        EventActions.receiveAll([event]);
      });
  },

  componentWillUnmount() {
    EventStore.removeChangeListener(this._onChange);
  },

  _onAddToFavorites() {
    FavoritesActions.addFavorite(this.state.event);
  },

  render() {
    var event = this.state.event;
    return (
      <section>
        <LoadingIndicator loading={Object.keys(event).length === 0}>
          <div className='content event-page'>
            <h2 onClick={this._onAddToFavorites}>{event.title}</h2>
            <article>
              <p>{event.ingress}</p>
              <p>{event.text}</p>
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

export default EventPage;
