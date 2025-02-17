import type { Dateish } from 'app/models';
import type { PublicEvent } from '~/redux/models/Event';
import type { FieldGroup } from '~/redux/models/Group';
import type { FieldMeeting } from '~/redux/models/Meeting';
import type { PublicUser } from '~/redux/models/User';

interface CompleteRestrictedMail {
  id: EntityId;
  fromAddress: string;
  hideSender: boolean;
  used: Dateish;
  createdAt: Dateish;
  weekly: boolean;
  users: PublicUser[];
  groups: FieldGroup[];
  events: PublicEvent[];
  meetings: FieldMeeting[];
  rawAddresses: string[];
  tokenQueryParam: string;
}

export type ListRestrictedMail = Pick<
  CompleteRestrictedMail,
  'id' | 'fromAddress' | 'hideSender' | 'used' | 'createdAt' | 'weekly'
>;

export type NormalRestrictedMail = Pick<
  CompleteRestrictedMail,
  | 'users'
  | 'groups'
  | 'events'
  | 'meetings'
  | 'rawAddresses'
  | 'weekly'
  | 'hideSender'
> &
  ListRestrictedMail;

export type DetailedRestrictedMail = Pick<
  CompleteRestrictedMail,
  'tokenQueryParam'
> &
  NormalRestrictedMail;

export type UnknownRestrictedMail =
  | ListRestrictedMail
  | NormalRestrictedMail
  | DetailedRestrictedMail;
