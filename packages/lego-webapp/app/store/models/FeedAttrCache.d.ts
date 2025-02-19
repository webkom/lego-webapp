import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish, GroupType } from 'app/models';
import type { EventType } from 'app/store/models/Event';

/**
 * Models for the cached feed activity context objects gotten from the
 * AttrCache in lego.apps.feeds.attr_cache in LEGO backend
 */

export type FeedAttrUser = {
  id: EntityId;
  contentType: 'users.user';
  username: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
};

export type FeedAttrEvent = {
  id: EntityId;
  contentType: 'events.event';
  title: string;
  eventType: EventType;
};

export type FeedAttrMeetingInvitation = {
  id: EntityId;
  contentType: 'meetings.meetinginvitation';
  meeting: {
    id: EntityId;
    title: string;
    startTime: Dateish;
    location: string;
  };
};

export type FeedAttrArticle = {
  id: EntityId;
  contentType: 'articles.article';
  title: string;
};

export type FeedAttrAnnouncement = {
  id: EntityId;
  contentType: 'notifications.announcement';
  message: string;
  fromGroup?: {
    id: EntityId;
    name: string;
    type: GroupType;
  };
};

export type FeedAttrGalleryPicture = {
  id: EntityId;
  contentType: 'gallery.gallerypicture';
  gallery: {
    id: EntityId;
    title: string;
  };
};

export type FeedAttrGroup = {
  id: EntityId;
  contentType: 'users.abakusgroup';
  name: string;
  type: GroupType;
  logo?: string;
};

export type FeedAttrRegistration = {
  id: EntityId;
  contentType: 'events.registration';
  waitingList: boolean;
  registered: boolean;
};

export type FeedAttrRestrictedMail = {
  id: EntityId;
  contentType: 'restricted.restrictedmail';
};

export type UnknownFeedAttr =
  | FeedAttrUser
  | FeedAttrEvent
  | FeedAttrMeetingInvitation
  | FeedAttrArticle
  | FeedAttrAnnouncement
  | FeedAttrGalleryPicture
  | FeedAttrGroup
  | FeedAttrRegistration
  | FeedAttrRestrictedMail;
