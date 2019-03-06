//@flow

//import { startCase } from 'lodash';

export const Keyboard = {
  ESCAPE: 27,
  RIGHT: 39,
  LEFT: 37,
  ENTER: 13,
  UP: 38,
  DOWN: 40
};

export const ROLES = {
  member: 'Medlem',
  leader: 'Leder',
  'co-leader': 'Nestleder',
  treasurer: 'Økonomiansvarlig',
  recruiting: 'Rekruttering',
  development: 'Utvikling',
  editor: 'Moderator',
  retiree: 'Pang',
  media_relations: 'PR-ansvarlig',
  active_retiree: 'Aktiv pang',
  alumni: 'Alumni',
  webmaster: 'Webansvarlig',
  interest_group_admin: 'Interessegruppeansvarlig',
  alumni_admin: 'Alumniansvarlig',
  retiree_email: 'Pang med epost',
  company_admin: 'Bedriftsansvarlig',
  dugnad_admin: 'Dugnadsansvarlig',
  trip_admin: 'Turansvarlig',
  sponsor_admin: 'Sponsoransvarlig',
  social_admin: 'Sosialansvarlig'
};

export const roleOptions = (Object.keys(ROLES)
  .sort()
  .map(role => ({
    value: role,
    label: ROLES[role]
  })): Array<{ value: string, label: string }>);

export const EVENTFIELDS = {
  start: 'startTime',
  activate: 'activationTime'
};
