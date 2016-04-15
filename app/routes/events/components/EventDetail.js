import React, { Component, PropTypes } from 'react';
import RequireLogin from 'app/components/RequireLogin';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentView from './CommentView';

/**
 *
 */
export default class EventDetail extends Component {
  static propTypes = {
    event: PropTypes.object,
    loggedIn: PropTypes.bool.isRequired
  };

  render() {
    const { event, loggedIn } = this.props;

    if (!event) {
      return <LoadingIndicator loading />;
    }

    return (
      <div>
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

        <CommentView comments={[]} />
      </div>
    );
  }
}
