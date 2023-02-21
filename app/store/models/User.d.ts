import type { Dateish, PhotoConsentDomain, Semester } from 'app/models';
import type EmailList from 'app/store/models/EmailList';
import type Group from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';
import type PastMembership from 'app/store/models/PastMembership';
import type { ID } from 'app/store/models/index';

export interface PhotoConsent {
  year: number;
  semester: Semester;
  domain: PhotoConsentDomain;
  isConsenting: boolean | null;
  updatedAt: Dateish;
}

interface User {
  id: number;
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
>;

export type PublicUserWithAbakusGroups = Pick<User, 'abakusGroups'> &
  PublicUser;

export type PublicUserWithGroups = Pick<
  User,
  'abakusGroups' | 'pastMemberships' | 'memberships'
> &
  PublicUser;

export type AdministrateUser = Pick<User, 'abakusGroups' | 'allergies'> &
  PublicUser;

export type AdministrateExportUser = Pick<User, 'email' | 'phoneNumber'> &
  AdministrateUser;

export type SearchUser = Pick<
  User,
  | 'id'
  | 'username'
  | 'firstName'
  | 'lastName'
  | 'fullName'
  | 'gender'
  | 'profilePicture'
  | 'profilePicturePlaceholder'
>;

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
  | SearchUser;
