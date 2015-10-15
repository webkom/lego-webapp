import React, { Component, PropTypes } from 'react';
import RequireLogin from './RequireLogin';
import LoadingIndicator from './LoadingIndicator';

export default class EventPage extends Component {
  static propTypes = {
    event: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired
  }

  renderEvent(event) {
    return (
      <section className='content event-page'>
        <h2>{event.title}</h2>
        <article className='event-ingress'>
          {event.ingress}
        </article>
        <article className='event-body'>
          {event.text}
        </article>
        <div className='event-open-for'>
          <h3>Åpent for</h3>
        </div>

        <RequireLogin loggedIn={this.props.loggedIn}>
          <h3>Bli med på dette arrangementet</h3>
          <form className='event-participate'>
            <textarea placeholder='Melding til arrangører' />
            <button type='submit'>Bli med</button>

            <p>Påmeldingen stenger 13:37</p>
          </form>
        </RequireLogin>
      </section>
    );
  }

  render() {
    const { event } = this.props;

    return (
      <section>
        <LoadingIndicator loading={!event}>
          <div>
            {event && this.renderEvent(event)}
          </div>
        </LoadingIndicator>
      </section>
    );
  }

}
