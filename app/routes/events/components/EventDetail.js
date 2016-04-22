import styles from './EventDetail.css';
import React, { Component } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Markdown from 'app/components/Markdown';
import JoinEventForm from './JoinEventForm';

const InterestedButton = ({ value, onClick }) => {
  const [icon, text] = value
    ? ['check', 'Du er interessert']
    : ['plus', 'Jeg er interessert'];

  return (
    <Button onClick={onClick}>
      <Icon name={icon} />
      {' '}
      {text}
    </Button>
  );
};

/**
 *
 */
export type Props = {
  event: Event;
  loggedIn: boolean;
  isUserInterested: boolean;
};

/**
 *
 */
export default class EventDetail extends Component {
  props: Props;

  state = {
    joinFormOpen: false
  };

  handleJoinSubmit = (messageToOrganizers) => {
    console.log(messageToOrganizers);
  };

  toggleJoinFormOpen = () => {
    this.setState({ joinFormOpen: !this.state.joinFormOpen });
  };

  render() {
    const { event, loggedIn, user } = this.props;

    if (!event) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <img src='https://www.gochile.cl/fotos/overview-full/2348-img_8707.jpg' />
          <div className={styles.coverImageOverlay} />
        </div>

        <FlexRow alignItems='center' justifyContent='space-between'>
          <h2>{event.title}</h2>
          <InterestedButton value={this.props.isUserInterested} />
        </FlexRow>

        <FlexRow>
          <FlexColumn className={styles.description}>
            <Markdown>{event.text}</Markdown>
          </FlexColumn>
          <FlexColumn className={styles.meta}>
            <ul>
              <li>Starter om <strong>3 timer</strong></li>
              <li>Finner sted i <strong>H3</strong></li>
              <li>Mingling på <strong>Frati</strong></li>
            </ul>
          </FlexColumn>
        </FlexRow>

        <FlexRow>
          {loggedIn && (
            <FlexColumn className={styles.join}>
              <a
                onClick={this.toggleJoinFormOpen}
                className={styles.joinToggle}
              >
                Bli med på dette arrangementet
                {' '}
                <Icon
                  name={this.state.joinFormOpen ? 'angle-up' : 'angle-right'}
                />
              </a>

              {this.state.joinFormOpen && (
                <JoinEventForm
                  onSubmit={this.handleJoinSubmit}
                />
              )}
            </FlexColumn>
          )}

          <FlexColumn className={styles.openFor}>
            <strong>Åpent for</strong>
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
