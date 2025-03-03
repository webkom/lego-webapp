import type { EntityId } from '@reduxjs/toolkit';
import type {
  ActionGrant,
  Dateish,
  PhotoConsentDomain,
  Semester,
} from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type { PublicEmailList } from 'app/store/models/EmailList';
import type { PublicGroup } from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';
import type { PastMembership } from 'app/store/models/Membership';
import type { Required } from 'utility-types';

export interface PhotoConsent {
  year: number;
  semester: Semester;
  domain: PhotoConsentDomain;
  isConsenting: boolean | null;
  updatedAt: Dateish;
}

export interface Achievement {
  id: number;
  identifier: string;
  updatedAt: Dateish;
  level: number;
  percentage: number;
}

export interface AchievementData {
  name: string;
  description: string;
  rarity: number;
  hidden: boolean;
}

export const Gender = {
  male: 'Mann',
  female: 'Kvinne',
  other: 'Annet',
} as const;

export type UserPermissionGroup = Pick<PublicGroup, 'id' | 'name'>;

interface User {
  id: EntityId;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: keyof typeof Gender;
  email: string;
  emailAddress: string;
  emailListsEnabled: boolean;
  internalEmailAddress?: string;
  phoneNumber?: string;
  profilePicture: string;
  profilePicturePlaceholder: string;
  allergies: string;
  isActive: boolean;
  isStudent: boolean;
  abakusEmailLists: PublicEmailList[];
  penalties: EntityId[];
  icalToken: string;
  abakusGroups: EntityId[];
  isAbakusMember: boolean;
  isAbakomMember: boolean;
  pastMemberships: PastMembership[];
  selectedTheme: string;
  permissionsPerGroup: {
    abakusGroup: UserPermissionGroup;
    permissions: string[];
    parentPermissions: {
      abakusGroup: UserPermissionGroup;
      permissions: string[];
    }[];
  }[];
  photoConsents?: PhotoConsent[];
  memberships: Membership[];
  githubUsername?: string;
  linkedinId?: string;
  actionGrant?: ActionGrant;
  achievements: Achievement[];
  achievementsScore: number;
  achievementRank: number;
}

// Used if the user tries to get themselves or has the EDIT permission.
export type CurrentUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'email'
  | 'emailAddress'
  | 'phoneNumber'
  | 'emailListsEnabled'
  | 'profilePicture'
  | 'profilePicturePlaceholder'
  | 'gender'
  | 'allergies'
  | 'isActive'
  | 'isStudent'
  | 'abakusEmailLists'
  | 'abakusGroups'
  | 'isAbakusMember'
  | 'isAbakomMember'
  | 'penalties'
  | 'icalToken'
  | 'memberships'
  | 'pastMemberships'
  | 'internalEmailAddress'
  | 'selectedTheme'
  | 'permissionsPerGroup'
  | 'photoConsents'
  | 'githubUsername'
  | 'linkedinId'
  | 'actionGrant'
  | 'achievements'
  | 'achievementsScore'
  | 'achievementRank'
>;

export type PublicUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'gender'
  | 'profilePicture'
  | 'profilePicturePlaceholder'
  | 'internalEmailAddress'
  | 'githubUsername'
  | 'linkedinId'
  | 'achievements'
  | 'achievementsScore'
  | 'achievementRank'
>;

export type PublicUserWithAbakusGroups = Pick<User, 'abakusGroups'> &
  PublicUser;

export type PublicUserWithGroups = Pick<
  User,
  'pastMemberships' | 'memberships'
> &
  PublicUserWithAbakusGroups;

export type AdministrateUser = Pick<User, 'abakusGroups'> & PublicUser;

// Used in event administrate view
export type AdministrateUserWithGrade = (
  | AdministrateUser
  | AdministrateAllergiesUser
) & {
  grade: PublicGroup;
};

export type AdministrateExportUser = Pick<User, 'email' | 'phoneNumber'> &
  AdministrateUser;

export type AdministrateAllergiesUser = Pick<User, 'allergies'> &
  AdministrateUser;

export type SearchUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'gender'
  | 'email'
  | 'emailAddress'
  | 'emailListsEnabled'
  | 'internalEmailAddress'
  | 'phoneNumber'
  | 'profilePicture'
  | 'profilePicturePlaceholder'
  | 'isActive'
  | 'isStudent'
  | 'isAbakusMember'
  | 'isAbakomMember'
  | 'abakusEmailLists'
  | 'penalties'
  | 'icalToken'
  | 'abakusGroups'
  | 'pastMemberships'
  | 'selectedTheme'
  | 'permissionsPerGroup'
  | 'photoConsents'
  | 'memberships'
  | 'githubUsername'
>;

export type AutocompleteUser = Pick<
  User,
  'username' | 'fullName' | 'profilePicture' | 'id'
> & {
  contentType: AutocompleteContentType.User;
  text: 'text';
};

/*
Some user object, unknown serializer
 */
export type UnknownUser =
  | CurrentUser
  | PublicUser
  | PublicUserWithAbakusGroups
  | PublicUserWithGroups
  | AdministrateUser
  | AdministrateExportUser
  | AdministrateAllergiesUser;

export type UpdateUser = Required<
  Partial<
    Pick<
      User,
      | 'username'
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'phoneNumber'
      | 'gender'
      | 'allergies'
      | 'profilePicture'
      | 'isAbakusMember'
      | 'emailListsEnabled'
      | 'selectedTheme'
      | 'githubUsername'
      | 'linkedinId'
    >
  >,
  'username'
>;
