import React, { Component, PropTypes } from 'react';
import RequireLogin from './RequireLogin';
import LoadingIndicator from './LoadingIndicator';

export default class EventPage extends Component {
  static propTypes = {
    event: PropTypes.object.isRequired
  }

  render() {
    const { event } = this.props;

    return (
      <section>
        <LoadingIndicator loading={Object.keys(event).length === 0}>
          <div className='content event-page'>
            <h2 onClick={() => {}}>{event.name}</h2>
            <article>
              {event.description}
            </article>
            <div className='event-open-for'>
              <h3>Åpent for</h3>
              {(event.admissible_groups || []).map(group =>
                <span key={'group-' + group.group}>{group.group}</span>
              )}
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
}
