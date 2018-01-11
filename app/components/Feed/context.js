// @flow
import React from 'react';
import { Link } from 'react-router';
import type { AggregatedActivity } from './types';
import styles from './context.css';

export function lookupContext(
  aggregatedActivity: AggregatedActivity,
  key: string
) {
  return aggregatedActivity.context[key];
}

const renderUser = (context: Object) => (
  <Link to={`/users/${context.username}/`}>
    {`${context.firstName} ${context.lastName}`}
  </Link>
);

const renderEvent = (context: Object) => (
  <Link to={`/events/${context.id}/`}>{`${context.title}`}</Link>
);

const renderMeetingInvitation = (context: Object) => (
  <Link to={`/meetings/${context.meeting.id}/`}>{context.meeting.title}</Link>
);

const renderArticle = (context: Object) => (
  <Link to={`/articles/${context.id}/`}>{context.title}</Link>
);

const renderAnnouncement = (context: Object) => <p>{context.message}</p>;

const renderGalleryPicture = (context: Object) => (
  <Link to={`/photos/${context.gallery.id}/picture/${context.id}`}>
    {context.gallery.title}-#{context.id}
  </Link>
);

export const contextRender = {
  'users.user': renderUser,
  'events.event': renderEvent,
  'meetings.meetinginvitation': renderMeetingInvitation,
  'articles.article': renderArticle,
  'notifications.announcement': renderAnnouncement,
  'gallery.gallerypicture': renderGalleryPicture
};
