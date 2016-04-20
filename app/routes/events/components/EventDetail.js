import './EventDetail.css';
import React, { Component } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import JoinEventForm from './JoinEventForm';

/**
 *
 */
export type Props = {
  event: {};
  loggedIn: boolean;
};

/**
 *
 */
export default class EventDetail extends Component {
  props: Props;

  handleJoinSubmit = (messageToOrganizers) => {
    console.log(messageToOrganizers);
  };

  render() {
    const { event, loggedIn, user } = this.props;

    if (!event) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className='EventDetail u-container'>
        <div className='EventDetail__coverImage'>
        </div>

        <FlexRow alignItems='center' justifyContent='space-between'>
          <h2>{event.title}</h2>
          <Button>{"I'm interested in this"}</Button>
        </FlexRow>

        <FlexRow>
          <FlexColumn className='EventDetail__description'>
            {event.text}
          </FlexColumn>
          <FlexColumn className='EventDetail__meta'>
            <ul>
              <li>Starter om <strong>3 timer</strong></li>
              <li>Finner sted i <strong>H3</strong></li>
              <li>Mingling på <strong>Frati</strong></li>
            </ul>
          </FlexColumn>
        </FlexRow>

        <FlexRow>
          {loggedIn && (
            <FlexColumn className='EventDetail__join'>
              <h3>Bli med på dette arrangementet</h3>
              <JoinEventForm
                onSubmit={this.handleJoinSubmit}
              />
            </FlexColumn>
          )}

          <FlexColumn className='EventDetail__openFor'>
            <h3>Åpent for</h3>
            <ul>
            {(event.openFor || []).map((openFor) => (
              <li key={openFor}>{openFor}</li>
            ))}
            </ul>
          </FlexColumn>
        </FlexRow>

        <CommentView
          formEnabled
          user={user}
          commentTarget={event.commentTarget}
          loggedIn={loggedIn}
          comments={event.comments || []}
        />
      </div>
    );
  }
}
