import React, { Component, PropTypes } from 'react';
import RequireLogin from './RequireLogin';
import LoadingIndicator from './ui/LoadingIndicator';
import CommentView from './CommentView';
import comments from './__tests__/fixtures/comments';

const Event = ({ event, loggedIn }) => (
  <section className='u-container content event-page'>
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

    <RequireLogin loggedIn={loggedIn}>
      <h3>Bli med på dette arrangementet</h3>
      <form className='event-participate'>
        <textarea placeholder='Melding til arrangører' />
        <button type='submit'>Bli med</button>

        <p>Påmeldingen stenger 13:37</p>
      </form>
    </RequireLogin>

    <CommentView comments={comments} />
  </section>
);

export default class EventPage extends Component {
  static propTypes = {
    event: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { event } = this.props;
    return (
      <section>
        <LoadingIndicator loading={!event}>
          <div>
            {event && <Event {...this.props} />}
          </div>
        </LoadingIndicator>
      </section>
    );
  }
}
