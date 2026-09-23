import { appConfig } from '~/utils/appConfig';

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

export const LENDABLE_CATEGORY = {
  photography: 'Fotografi',
  music: 'Musikk',
  furniture: 'Møbler',
  services: 'Tjenester',
  outdoors: 'Utendørs',
  other: 'Annet',
};

export type FilterLendingCategory = keyof typeof LENDABLE_CATEGORY;

export const ROLES = {
  active_retiree: 'Aktiv pang',
  alumni: 'Alumni',
  alumni_admin: 'Alumniansvarlig',
  event_manager: 'Arrangementansvarlig',
  company_admin: 'Bedriftsansvarlig',
  booking_admin: 'Bookingansvarlig',
  dugnad_admin: 'Dugnadsansvarlig',
  photo_admin: 'Foto- og filmansvarlig',
  graphic_admin: 'Grafiskansvarlig',
  hs_representative: 'HS-representant',
  purchasing_manager: 'Innkjøpsansvarlig',
  interest_group_admin: 'Interessegruppeansvarlig',
  cuddling_manager: 'Kosansvarlig',
  leader: 'Leder',
  member: 'Medlem (standard)',
  merch_admin: 'Merchansvarlig',
  editor: 'Moderator',
  'co-leader': 'Nestleder',
  retiree: 'Pang',
  retiree_email: 'Pang med e-post',
  media_relations: 'PR-ansvarlig',
  recruiting: 'Rekruttering',
  snackoverflow_manager: 'SnackOverflow-ansvarlig',
  social_media_admin: 'SoMe-ansvarlig',
  social_admin: 'Sosialansvarlig',
  sponsor_admin: 'Sponsoransvarlig',
  trip_admin: 'Turansvarlig',
  development: 'Utvikling',
  webmaster: 'Webansvarlig',
  treasurer: 'Økonomiansvarlig',
};

export type RoleType = keyof typeof ROLES;

export const roleOptions = (Object.keys(ROLES) as RoleType[]).map((role) => ({
  value: role,
  label: ROLES[role],
}));

/*
 * Use the production group id (11) if the ENVIRONMENT environment value is 'production' or 'staging'
 * (i.e. abakus.no, webapp-staging.abakus.no) or if it's run locally through pnpm dev:staging 'local_staging'.
 * Use the local backend group id (12) if the webapp is running with pnpm dev.
 */
export const WEBKOM_GROUP_ID: number =
  appConfig.environment &&
  ['production', 'staging', 'local_staging'].includes(appConfig.environment)
    ? 11
    : 12;
export const EDITOR_EMPTY = '<p></p>';
