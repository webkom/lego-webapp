// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import type { AggregatedActivity, TagInfo } from './types';
import styles from './context.css';

export function lookupContext(
  aggregatedActivity: AggregatedActivity,
  key: string
): Object {
  return aggregatedActivity.context[key];
}

export const linkAndText = (
  link: string,
  text: string,
  linkableContent: boolean = true
): { link: string, text: string, linkableContent: boolean } => ({
  link,
  text,
  linkableContent,
});

const renderUser = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
  linkAndText(
    `/users/${context.username}/`,
    `${context.firstName} ${context.lastName}`
  );

const renderEvent = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
  linkAndText(`/events/${context.id}/`, context.title);

const renderMeetingInvitation = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
  linkAndText(`/meetings/${context.meeting.id}/`, context.meeting.title);

const renderArticle = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
  linkAndText(`/articles/${context.id}/`, context.title);

const renderAnnouncement = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
  linkAndText('', context.message, false);

const renderGalleryPicture = (
  context: Object
): { link: string, text: string, linkableContent: boolean } =>
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
  'gallery.gallerypicture': renderGalleryPicture,
};

export function toLink(linkAndText: TagInfo): React.Node {
  return linkAndText.linkableContent ? (
    <Link to={linkAndText.link}>{linkAndText.text}</Link>
  ) : (
    toSpan(linkAndText)
  );
}

export function toSpan(linkAndText: TagInfo): React.Node {
  const classname = linkAndText.linkableContent ? styles.highlight : '';
  return <span className={classname}>{linkAndText.text}</span>;
}
