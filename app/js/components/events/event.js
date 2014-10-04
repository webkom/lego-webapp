/** @jsx React.DOM */

var React = require('react');

var EventStore = require('../../stores/EventStore');

var Event = React.createClass({
  getInitialState: function() {
    return {
      event: EventStore.get(this.props.params.eventId|0)
    }
  },

  _onChange: function() {
    this.setState({
      event: EventStore.get(this.props.params.eventId|0)
    });
  },

  componentDidMount: function() {
    EventStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this._onChange);
  },

  render: function() {
    return (
      <section>
        <div className='content'>
          <h2>{this.state.event.name}</h2>
          <article>
            {this.state.event.description}
          </article>
          <div className='event-open-for'>
            <h3>Åpent for</h3>
            {(this.state.event.admissible_groups || []).map(function(group) {
              return <span key={'group-' + group.group}>{group.group}</span>;
            })}
          </div>


          <h3>Bli med på dette arrangementet</h3>
          <form className='event-participate'>
            <textarea placeholder="Melding til arrangører" />
            <button type='submit'>Bli med</button>

            <p>Påmeldingen stenger {this.state.event.registration_ends_at}</p>
          </form>
        </div>
      </section>
    );
  }
});

module.exports = Event;
