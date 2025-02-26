import type { EntityId } from '@reduxjs/toolkit';
import type { GroupType, ActionGrant } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';

interface Group {
  id: EntityId;
  name: string;
  description: string;
  contactEmail: string;
  parent?: EntityId;
  permissions: string[];
  parentPermissions: {
    abakusGroup: Pick<Group, 'id' | 'name'>;
    permissions: string[];
  }[];
  logo: string | null;
  logoPlaceholder: string | null;
  numberOfUsers: number;
  type: GroupType;
  text: string;
  showBadge: boolean;
  active: boolean;
  actionGrant: ActionGrant;
}

export type DetailedGroup = Pick<
  Group,
  | 'id'
  | 'name'
  | 'description'
  | 'contactEmail'
  | 'parent'
  | 'permissions'
  | 'parentPermissions'
  | 'type'
  | 'text'
  | 'logo'
  | 'numberOfUsers'
  | 'showBadge'
  | 'active'
  | 'actionGrant'
>;

export type PublicGroup = Pick<
  Group,
  | 'id'
  | 'name'
  | 'description'
  | 'contactEmail'
  | 'parent'
  | 'logo'
  | 'logoPlaceholder'
  | 'type'
  | 'showBadge'
  | 'active'
>;

export type PublicListGroup = Pick<Group, 'numberOfUsers'> & PublicGroup;

export type PublicDetailedGroup = Pick<Group, 'text' | 'actionGrant'> &
  PublicListGroup;

export type SearchGroup = Pick<Group, 'id' | 'name' | 'type' | 'logo'>;

export type AutocompleteGroup = Pick<Group, 'name' | 'type' | 'logo' | 'id'> & {
  contentType: AutocompleteContentType.Group;
  text: 'text';
};

export type UnknownGroup =
  | PublicGroup
  | DetailedGroup
  | PublicListGroup
  | PublicDetailedGroup;

// Used when a group is a field in another model
export type FieldGroup = Pick<Group, 'id' | 'name' | 'contactEmail' | 'type'>;
