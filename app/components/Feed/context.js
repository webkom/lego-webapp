// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import type { AggregatedActivity, TagInfo } from './types';
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
  linkableContent: boolean = true
) => ({
  link,
  text,
  linkableContent
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
  linkAndText('', context.message, false);

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

export function toLink(linkAndText: TagInfo) {
  return linkAndText.linkableContent ? (
    <Link to={linkAndText.link}>{linkAndText.text}</Link>
  ) : (
    toSpan(linkAndText)
  );
}

export function toSpan(linkAndText: TagInfo) {
  const classname = linkAndText.linkableContent ? styles.highlight : '';
  return <span className={classname}>{linkAndText.text}</span>;
}
