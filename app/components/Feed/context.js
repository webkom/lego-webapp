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

export const linkAndText = (
  link: string,
  text: string,
  notLink: boolean = false
) => ({
  link,
  text,
  notLink
});

const renderUser = (context: Object) =>
  linkAndText(
    `/users/${context.username}/`,
    `${context.firstName} ${context.lastName}`
  );

const renderEvent = (context: Object) =>
  linkAndText(`/events/${context.id}/`, context.title);

const renderMeetingInvitation = (context: Object) =>
  linkAndText(`/meetings/${context.meeting.id}/`, context.meeting.title);

const renderArticle = (context: Object) =>
  linkAndText(`/articles/${context.id}/`, context.title);

const renderAnnouncement = (context: Object) =>
  linkAndText('', context.message, true);

const renderGalleryPicture = (context: Object) =>
  linkAndText(
    `/photos/${context.gallery.id}/picture/${context.id}`,
    `${context.gallery.title}-#${context.id}`
  );

export const contextRender = {
  'users.user': renderUser,
  'events.event': renderEvent,
  'meetings.meetinginvitation': renderMeetingInvitation,
  'articles.article': renderArticle,
  'notifications.announcement': renderAnnouncement,
  'gallery.gallerypicture': renderGalleryPicture
};

export function toLink(linkAndText: linkAndText) {
  return linkAndText.notLink ? (
    toSpan(linkAndText)
  ) : (
    <Link to={linkAndText.link}>{linkAndText.text}</Link>
  );
}

export function toSpan(linkAndText: linkAndText) {
  const classname = !linkAndText.notLink ? styles.highlight : '';
  return <span className={classname}>{linkAndText.text}</span>;
}
