import { PublicUser } from '~/redux/models/User';
import type Comment from '~/redux/models/Comment';

const comments: Comment[] = [
  {
    id: 2,
    text: 'blaargarhgh',
    createdAt: '2016-02-02T22:17:21.838103Z',
    updatedAt: '2016-02-02T22:17:21.838103Z',
    contentTarget: 'events.event-1',
    contentTargetSelf: 'comments.comment-2',
    author: {
      id: 1,
      username: 'webkom',
      firstName: 'webkom',
      lastName: 'webkom',
      fullName: 'webkom webkom',
      profilePicture: 'https://example.picture/profile.png',
    } as PublicUser,
    parent: null,
  },
  {
    id: 3,
    text: 'sure man',
    createdAt: '2016-02-04T22:17:21.838103Z',
    updatedAt: '2016-02-04T22:17:21.838103Z',
    contentTarget: 'events.event-1',
    contentTargetSelf: 'comments.comment-3',
    author: {
      id: 2,
      username: 'plebkom',
      firstName: 'plebkom',
      lastName: 'plebkom',
      fullName: 'plebkom lelkom',
      profilePicture: 'https://example.picture/profile.png',
    } as PublicUser,
    parent: null,
  },
  {
    id: 4,
    parent: 3,
    text: 'how can mirrors be real',
    createdAt: '2016-02-04T22:17:21.838103Z',
    updatedAt: '2016-02-04T22:17:21.838103Z',
    contentTarget: 'events.event-1',
    contentTargetSelf: 'comments.comment-4',
    author: {
      id: 1,
      username: 'webkom',
      firstName: 'webkom',
      lastName: 'webkom',
      fullName: 'webkom webkom',
      profilePicture: 'https://example.picture/profile.png',
    } as PublicUser,
  },
];
export default comments;
