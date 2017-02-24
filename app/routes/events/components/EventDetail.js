import styles from './EventDetail.css';
import React, { Component } from 'react';
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
import LoadingIndicator from 'app/components/LoadingIndicator';
import Tag from 'app/components/Tag';
import Time from 'app/components/Time';

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
  updateFeedback: (
    eventId: Number,
    registrationId: Number,
    feedback: string
  ) => Promise<*>
};

/**
 *
 */
export default class EventDetail extends Component {
  state = {
    joinFormOpen: false
  };

  props: Props;

  handleRegistration = ({ captchaResponse, feedback, type }) => {
    const {
      eventId,
      currentRegistration,
      register,
      unregister,
      updateFeedback
    } = this.props;
    switch (type) {
      case 'feedback':
        return updateFeedback(eventId, currentRegistration.id, feedback);
      case 'register':
        return register(eventId, captchaResponse, feedback);
      case 'unregister':
        return unregister(eventId, currentRegistration.id);
      default:
        return undefined;
    }
  };

  toggleJoinFormOpen = () => {
    this.setState({ joinFormOpen: !this.state.joinFormOpen });
  };

  handleToken = token => {
    this.props.payment(this.props.event.id, token.id);
  };

  render() {
    const {
      event,
      loggedIn,
      currentUser,
      comments,
      error,
      loading,
      pools,
      registrations,
      currentRegistration
    } = this.props;

    if (loading) {
      return <LoadingIndicator loading />;
    }

    if (error) {
      return <div>{error.message}</div>;
    }

    return (
      <div className={styles.root}>
        <div className={styles.coverImage}>
          <Image src={event.cover} />
        </div>

        <FlexRow alignItems="center" justifyContent="space-between">
          <h2>{event.title}</h2>
          <InterestedButton value={this.props.isUserInterested} />
        </FlexRow>

        <FlexRow>
          <FlexColumn className={styles.description}>
            <Markdown>{event.text}</Markdown>
            <FlexRow className={styles.tagRow}>
              {event.tags.map((tag, i) => <Tag key={i} tag={tag} />)}
            </FlexRow>
          </FlexColumn>
          <FlexColumn className={styles.meta}>
            <ul>
              {event.company &&
                <li>
                  Arrangerende bedrift <strong>{event.company.name}</strong>
                </li>}
              <li>
                Starter{' '}
                <strong>
                  <Time time={event.startTime} format="DD.MM.YYYY HH:mm" />
                </strong>
              </li>
              <li>Finner sted i <strong>{event.location}</strong></li>
              {event.activationTime &&
                <li>
                  Påmelding åpner
                  {' '}
                  <strong>
                    <Time
                      time={event.activationTime}
                      format="DD.MM.YYYY HH:mm"
                    />
                  </strong>
                </li>}
              {event.isPriced && <li>Dette er et betalt arrangement</li>}
              {event.price > 0 &&
                <li>Pris: <strong>{event.price / 100},-</strong></li>}
            </ul>
            {loggedIn &&
              <FlexItem>
                <h3>Påmeldte:</h3>
                <FlexRow className={styles.registeredThumbnails}>
                  {registrations
                    .slice(0, 10)
                    .map(reg => (
                      <RegisteredCell key={reg.user.id} user={reg.user} />
                    ))}
                </FlexRow>
                <RegisteredSummary registrations={registrations} />
                <AttendanceStatus title="Påmeldte" pools={pools} />
                {!currentRegistration
                  ? <div>
                      <i className="fa fa-exclamation-circle" />
                      {' '}
                      Du er ikke registrert
                    </div>
                  : <div>
                      <i className="fa fa-check-circle" /> Du er registrert
                      {event.isPriced &&
                        (currentRegistration.chargeStatus === 'succeeded'
                          ? <div>
                              <i className="fa fa-check-circle" /> Du har betalt
                            </div>
                          : <div>
                              <i className="fa fa-exclamation-circle" />
                              {' '}
                              Du har ikke betalt
                            </div>)}
                    </div>}
              </FlexItem>}
          </FlexColumn>
        </FlexRow>

        <FlexRow>
          {loggedIn &&
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

              {this.state.joinFormOpen &&
                <div>
                  <JoinEventForm
                    event={event}
                    registration={currentRegistration}
                    currentUser={currentUser}
                    onToken={this.handleToken}
                    onSubmit={this.handleRegistration}
                  />
                </div>}
            </FlexColumn>}

          <FlexColumn className={styles.openFor}>
            <strong>Åpent for</strong>
            <ul>
              {(pools || [])
                .map(pool =>
                  pool.permissionGroups.map(group => (
                    <li key={group.id}>{group.name}</li>
                  )))}
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
