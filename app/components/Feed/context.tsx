import type { TagProps } from 'app/components/Feed/ActivityRenderer';
import type {
  FeedAttrAnnouncement,
  FeedAttrArticle,
  FeedAttrEvent,
  FeedAttrGalleryPicture,
  FeedAttrMeetingInvitation,
  FeedAttrUser,
} from 'app/store/models/FeedAttrCache';

const getUserTag = (user: FeedAttrUser): TagProps => ({
  link: `/users/${user.username}/`,
  text: `${user.firstName} ${user.lastName}`,
  linkableContent: true,
});

const getEventTag = (context: FeedAttrEvent): TagProps => ({
  link: `/events/${context.id}/`,
  text: context.title,
  linkableContent: true,
});

const getMeetingInvitationTag = (
  context: FeedAttrMeetingInvitation,
): TagProps => ({
  link: `/meetings/${context.meeting.id}/`,
  text: context.meeting.title,
  linkableContent: true,
});

const getArticleTag = (context: FeedAttrArticle): TagProps => ({
  link: `/articles/${context.id}/`,
  text: context.title,
  linkableContent: true,
});

const getAnnouncementTag = (context: FeedAttrAnnouncement): TagProps => ({
  link: '',
  text: context.message,
  linkableContent: false,
});

const getGalleryPictureTag = (context: FeedAttrGalleryPicture): TagProps => ({
  link: `/photos/${context.gallery.id}/picture/${context.id}`,
  text: `${context.gallery.title}-#${context.id}`,
  linkableContent: true,
});

export const contextRender = {
  'users.user': getUserTag,
  'events.event': getEventTag,
  'meetings.meetinginvitation': getMeetingInvitationTag,
  'articles.article': getArticleTag,
  'notifications.announcement': getAnnouncementTag,
  'gallery.gallerypicture': getGalleryPictureTag,
};
