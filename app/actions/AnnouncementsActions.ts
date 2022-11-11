import { stopSubmit } from 'redux-form';
import type { ID } from 'app/store/models';
import type {
  NormalizedEntityPayload,
  EntityType,
} from 'app/store/models/Entities';
import { announcementsSchema } from 'app/store/schemas';
import createLegoApiAction from 'app/store/utils/createLegoApiAction';

export const fetchAll = createLegoApiAction()('Announcements.FETCH', () => ({
  endpoint: '/announcements/',
  schema: [announcementsSchema],
  meta: {
    errorMessage: 'Henting av kunngjøringer feilet',
  },
  propagateError: true,
}));

interface CreateAnnouncementOptions {
  message: any;
  users: any;
  groups: any;
  events: any;
  meetings: any;
  fromGroup: any;
  send: any;
}

interface CreateAnnouncementSuccessPayload
  extends NormalizedEntityPayload<EntityType.Announcements> {
  result: ID;
}

export const createAnnouncement =
  createLegoApiAction<CreateAnnouncementSuccessPayload>()(
    'Announcements.CREATE',
    (
      _,
      {
        message,
        users,
        groups,
        events,
        meetings,
        fromGroup,
        send,
      }: CreateAnnouncementOptions
    ) => ({
      endpoint: '/announcements/',
      method: 'POST',
      body: {
        message,
        users,
        groups,
        events,
        meetings,
        fromGroup,
      },
      schema: announcementsSchema,
      meta: {
        errorMessage: 'Opprettelse av kunngjøringer feilet',
        send,
      },
    }),
    {
      onSuccess: (action, dispatch) => {
        if (action.meta.send && action.payload) {
          dispatch(sendAnnouncement(action.payload.result));
        }
      },
      onFailure: (action, dispatch) => {
        if (action.error) {
          dispatch(
            stopSubmit('AnnouncementsCreate', action.payload.response.jsonData)
          );
        }
      },
    }
  );

interface AnnouncementSendSuccessPayload {
  status: string;
}

export const sendAnnouncement =
  createLegoApiAction<AnnouncementSendSuccessPayload>()(
    'Announcements.SEND',
    (_, announcementId: ID) => ({
      endpoint: `/announcements/${announcementId}/send/`,
      method: 'POST',
      meta: {
        errorMessage: 'Sending av kunngjøringer feilet',
        announcementId,
      },
    })
  );

export const deleteAnnouncement = createLegoApiAction()(
  'Announcements.DELETE',
  (_, id: ID) => ({
    endpoint: `/announcements/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av kunngjøringer feilet',
    },
  })
);
