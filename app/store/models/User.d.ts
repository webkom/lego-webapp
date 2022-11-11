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

export default interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female';
  profilePicture: string;
  profilePicturePlaceholder: string;
  internalEmailAddress?: string;

  // only on user detail
  abakusGroups?: ID[];
  pastMemberships?: PastMembership[];
  memberships?: Membership[];
  actionGrant?: string[];
}

export interface MeUser extends User {
  email: string;
  emailAddress: string;
  phoneNumber: string;
  emailListsEnabled: boolean;
  allergies: string;
  isActive: boolean;
  isStudent: boolean;
  abakusEmailLists: EmailList[];
  isAbakusMember: boolean;
  isAbakomMember: boolean;
  penalties: ID;
  iCalToken: string;
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
}
