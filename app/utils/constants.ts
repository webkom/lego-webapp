import config from 'app/config';

export const Keyboard = {
  ESCAPE: 27,
  RIGHT: 39,
  LEFT: 37,
  ENTER: 13,
  UP: 38,
  DOWN: 40,
};

export const ROLES = {
  member: 'Medlem (standard)',
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
  social_admin: 'Sosialansvarlig',
};

export type RoleType = keyof typeof ROLES;

export const roleOptions = Object.keys(ROLES)
  .sort()
  .map((role) => ({
    value: role,
    label: ROLES[role],
  })) as Array<{
  value: RoleType;
  label: (typeof ROLES)[RoleType];
}>;

/*
 * Use the production group ID (11) if the ENVIRONMENT environment value is 'production' or 'staging'
 * (i.e. abakus.no, webapp-staging.abakus.no) or if it's run locally through yarn start:staging 'local_staging'.
 * Use the local backend group ID (12) if the webapp is running with yarn start.
 */
export const WEBKOM_GROUP_ID: number =
  config.environment &&
  ['production', 'staging', 'local_staging'].includes(config.environment)
    ? 11
    : 12;
export const EDITOR_EMPTY = '<p></p>';
