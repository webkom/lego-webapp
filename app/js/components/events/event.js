/** @jsx React.DOM */

var React = require('react');

var EventStore = require('../../stores/EventStore');

var Event = module.exports = React.createClass({
  getInitialState: function() {
    return {
      event: {}
    };
  },

  update: function() {
    this.setState({event: EventStore.find(this.props.params.eventId|0)})
  },

  componentWillMount: function() {
    EventStore.addChangeListener(this.update);
    EventStore.fetch();
  },

  componentDidMount: function() {
  },

  componentWillUnmount: function() {
    EventStore.removeChangeListener(this.update);
  },

  render: function() {
    console.log(this.state.event)
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
