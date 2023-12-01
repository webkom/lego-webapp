import type { Dateish, PhotoConsentDomain, Semester } from 'app/models';
import type { AutocompleteContentType } from 'app/store/models/Autocomplete';
import type EmailList from 'app/store/models/EmailList';
import type Group from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';
import type PastMembership from 'app/store/models/PastMembership';
import type { ID } from 'app/store/models/index';
import type { Required } from 'utility-types';

export interface PhotoConsent {
  year: number;
  semester: Semester;
  domain: PhotoConsentDomain;
  isConsenting: boolean | null;
  updatedAt: Dateish;
}

interface User {
  id: ID;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female' | 'other';
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
  abakusEmailLists: EmailList[];
  penalties: ID[];
  icalToken: string;
  abakusGroups: ID[];
  isAbakusMember: boolean;
  isAbakomMember: boolean;
  pastMemberships: PastMembership[];
  selectedTheme: string;
  permissionsPerGroup: {
    abakusGroup: Pick<Group, 'id' | 'name'>;
    permissions: string[];
    parentPermissions: {
      abakusGroup: Pick<Group, 'id' | 'name'>;
      permissions: string[];
    }[];
  }[];
  photoConsents?: PhotoConsent[];
  memberships: Membership[];
  githubUsername?: string;
  linkedinId?: string;
}

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
>;

export type DetailedUser = Pick<
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
  | 'profilePicture'
  | 'profilePicturePlaceholder'
  | 'allergies'
  | 'isActive'
  | 'penalties'
  | 'abakusGroups'
  | 'pastMemberships'
  | 'permissionsPerGroup'
  | 'githubUsername'
  | 'linkedinId'
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
>;

export type PublicUserWithAbakusGroups = Pick<User, 'abakusGroups'> &
  PublicUser;

export type PublicUserWithGroups = Pick<
  User,
  'abakusGroups' | 'pastMemberships' | 'memberships'
> &
  PublicUser;

export type AdministrateUser = Pick<User, 'abakusGroups'> & PublicUser;

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
  | DetailedUser
  | PublicUser
  | PublicUserWithAbakusGroups
  | PublicUserWithGroups
  | AdministrateUser
  | AdministrateExportUser
  | AdministrateAllergiesUser
  | SearchUser;

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
