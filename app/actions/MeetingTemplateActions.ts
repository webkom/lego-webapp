import { meetingTemplatesSchema } from '../reducers';
import { MeetingTemplates } from './ActionTypes';
import callAPI from './callAPI';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish, MeetingTemplate } from 'app/models';

export const fetchAllMeetingTemplates = () =>
  callAPI<MeetingTemplate[]>({
    types: MeetingTemplates.FETCH_ALL,
    endpoint: '/meetingtemplates/',
    schema: [meetingTemplatesSchema],
    meta: {
      errorMessage: 'Henting av møte-maler feilet',
    },
  });

export function createMeetingTemplate(data: {
  name: EntityId;
  report: string;
  location: string;
  startTime: Dateish;
  endTime: Dateish;
  description: string;
  mazemapPoi: number | null;
  reportAuthor: EntityId;
  invitedUsers: EntityId[];
  invitedGroups: EntityId[];
}) {
  return callAPI<MeetingTemplate>({
    types: MeetingTemplates.CREATE,
    endpoint: '/meetingtemplates/',
    method: 'POST',
    body: data,
    schema: meetingTemplatesSchema,
    meta: {
      errorMessage: 'Oppretting av møtemal feilet',
      successMessage: 'Møtemal opprettet!',
    },
  });
}

export function editMeetingTemplate(data: {
  meetingTemplateId: EntityId;
  report: string;
  name: string;
}) {
  return callAPI<MeetingTemplate>({
    types: MeetingTemplates.UPDATE,
    endpoint: `/meetingtemplates/${data.meetingTemplateId}/`,
    method: 'PATCH',
    body: data,
    schema: meetingTemplatesSchema,
    meta: {
      errorMessage: 'Endring av møtemal feilet',
      successMessage: 'Møtemal endret',
    },
  });
}

export function deletePoll(id: EntityId) {
  return callAPI({
    types: MeetingTemplates.DELETE,
    endpoint: `/meetingtemplates/${id}/`,
    method: 'DELETE',
    meta: {
      id,
      errorMessage: 'Sletting av møtemal feilet!',
    },
  });
}
