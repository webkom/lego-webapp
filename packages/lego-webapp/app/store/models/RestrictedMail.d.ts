import type { Dateish } from 'app/models';
import type { PublicEvent } from 'app/store/models/Event';
import type { FieldGroup } from 'app/store/models/Group';
import type { FieldMeeting } from 'app/store/models/Meeting';
import type { PublicUser } from 'app/store/models/User';

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
