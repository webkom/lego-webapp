//@flow

import { startCase } from 'lodash';

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
  treasurer: 'Økonomiansvarlig',
  'co-leader': 'Nestleder',
  active_retiree: 'Aktiv pang',
  retiree: 'Pang',
  recruiting: 'Rekruttering',
  development: 'Utvikling',
  editor: 'Moderator',
  media_relations: 'PR ansvarlig',
  alumni: 'Alumni',
  webmaster: 'Webansvarling'
};

export const roleOptions = Object.keys(ROLES)
  .sort()
  .map(role => ({
    value: role,
    label: ROLES[role] || startCase(role)
  }));
