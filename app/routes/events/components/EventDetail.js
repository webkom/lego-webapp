import styles from './EventDetail.css';
import React, { Component } from 'react';
import { getImage } from 'app/utils';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Image from 'app/components/Image';
import CommentView from 'app/components/Comments/CommentView';
import { FlexRow, FlexColumn, FlexItem } from 'app/components/FlexBox';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import Markdown from 'app/components/Markdown';
import JoinEventForm from './JoinEventForm';
import RegisteredCell from './RegisteredCell';
import RegisteredSummary from './RegisteredSummary';
import { AttendanceStatus } from 'app/components/UserAttendance';

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
  event: Event,
  eventId: Number,
  comments: Array,
  pools: Array,
  registrations: Array,
  currentRegistration: Object,
  loggedIn: boolean,
  isUserInterested: boolean,
  currentUser: Object,
  register: (eventId: Number) => Promise<*>,
  unregister: (eventId: Number, registrationId: Number) => Promise<*>,
  payment: (eventId: Number, token: string) => Promise<*>,
};


/**
 *
 */
export default class EventDetail extends Component {
  state = {
    joinFormOpen: false
  };

  props: Props;

  handleSubmit = (messageToOrganizers) => {
    if (this.props.currentRegistration) {
      this.props.unregister(this.props.eventId, this.props.currentRegistration.id);
    } else {
      this.props.register(this.props.eventId);
    }
    console.log(messageToOrganizers);
  }

  toggleJoinFormOpen = () => {
    this.setState({ joinFormOpen: !this.state.joinFormOpen });
  };

  handleToken = (token) => {
    this.props.payment(this.props.event.id, token.id);
  }

  render() {
    const {
      event, loggedIn, currentUser, comments,
      pools, registrations, currentRegistration
    } = this.props;

    if (!event.id) {
      return <LoadingIndicator loading />;
    }

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <Image src={getImage(event.id, 1000, 300)} />
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
              <li>Finner sted i <strong>{event.location}</strong></li>
            </ul>
            {loggedIn && (
              <FlexItem>
                <h3>Påmeldte:</h3>
                <FlexRow className={styles.registeredThumbnails}>
                  {registrations.slice(0, 10).map((reg) => (
                    <RegisteredCell key={reg.user.id} user={reg.user} />
                  ))}
                </FlexRow>
                <RegisteredSummary registrations={registrations} />
                <AttendanceStatus title='Påmeldte' pools={pools} />
              </FlexItem>
            )}
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
                <div>
                  <JoinEventForm
                    event={event}
                    registration={currentRegistration}
                    currentUser={currentUser}
                    onSubmit={this.handleSubmit}
                    onToken={this.handleToken}
                  />
                </div>
              )}
            </FlexColumn>
          )}

          <FlexColumn className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || []).map((pool) => (
                <li key={pool.id}>{pool.permissionGroups}</li>
            ))}
            </ul>
          </FlexColumn>
        </FlexRow>

        <CommentView
          formEnabled
          user={currentUser}
          commentTarget={event.commentTarget}
          loggedIn={loggedIn}
          comments={comments}
        />
      </div>
    );
  }
}
