/** @jsx React.DOM */

var React = require('react');

var EventStore = require('../stores/EventStore');

function getState(eventId) {
  return {
    event: EventStore.get(eventId|0)
  };
}

var EventPage = React.createClass({

  getInitialState: function() {
    return getState(this.props.params.eventId);
  },

  _onChange: function() {
    this.setState(getState(this.props.params.eventId));
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var event = this.state.event;
    return (
      <section>
        <div className='content'>
          <h2>{event.name}</h2>
          <article>
            {event.description}
          </article>
          <div className='event-open-for'>
            <h3>Åpent for</h3>
            {(event.admissible_groups || []).map(function(group) {
              return <span key={'group-' + group.group}>{group.group}</span>;
            })}
          </div>


          <h3>Bli med på dette arrangementet</h3>
          <form className='event-participate'>
            <textarea placeholder="Melding til arrangører" />
            <button type='submit'>Bli med</button>

            <p>Påmeldingen stenger {event.registration_ends_at}</p>
          </form>
        </div>
      </section>
    );
  }
});

module.exports = EventPage;
