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
    return (
      <section>
        <div className='content'>
          <h2>{this.state.event.name}</h2>
          <article>
            {this.state.event.description}
          </article>
          <form className='event-participate'>
            <textarea placeholder="Melding til arrangører" />
            <button type='submit'>Bli med</button>
          </form>
        </div>
      </section>
    );
  }
});
