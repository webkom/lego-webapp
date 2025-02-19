import appConfig from '~/utils/appConfig';

export const Keyboard = {
  ESCAPE: 'Escape',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  ENTER: 'Enter',
  META: 'Meta',
  CONTROL: 'Control',
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
  retiree_email: 'Pang med e-post',
  company_admin: 'Bedriftsansvarlig',
  dugnad_admin: 'Dugnadsansvarlig',
  trip_admin: 'Turansvarlig',
  sponsor_admin: 'Sponsoransvarlig',
  social_admin: 'Sosialansvarlig',
  merch_admin: 'Merchansvarlig',
  hs_representative: 'HS-representant',
  cuddling_manager: 'Kosansvarlig',
  photo_admin: 'Foto- og filmansvarlig',
  graphic_admin: 'Grafiskansvarlig',
  social_media_admin: 'SoMe-ansvarlig',
};

export type RoleType = keyof typeof ROLES;

export const roleOptions = (Object.keys(ROLES) as RoleType[])
  .sort()
  .map((role) => ({
    value: role,
    label: ROLES[role],
  }));

/*
 * Use the production group id (11) if the ENVIRONMENT environment value is 'production' or 'staging'
 * (i.e. abakus.no, webapp-staging.abakus.no) or if it's run locally through yarn start:staging 'local_staging'.
 * Use the local backend group id (12) if the webapp is running with yarn start.
 */
export const WEBKOM_GROUP_ID: number =
  appConfig.environment &&
  ['production', 'staging', 'local_staging'].includes(appConfig.environment)
    ? 11
    : 12;
export const EDITOR_EMPTY = '<p></p>';
