import { Flex, Icon } from '@webkom/lego-bricks';
import {
  EmailInfoField,
  InfoField,
  ProfileSection,
} from '~/pages/users/@username/_components/ProfileSection';
import styles from '~/pages/users/@username/_components/UserProfile.module.css';
import type { CurrentUser, PublicUserWithGroups } from '~/redux/models/User';

const GithubField = ({ githubUsername }: { githubUsername: string }) => (
  <a href={`https://github.com/${githubUsername}`}>
    <Flex alignItems="center">
      <Icon name={'logo-github'} className={styles.soMeIcon} />
      {githubUsername}
    </Flex>
  </a>
);
const LinkedInField = ({
  linkedinId,
  fullName,
}: {
  linkedinId: string;
  fullName: string;
}) => (
  <a href={`https://www.linkedin.com/in/${linkedinId}`}>
    <Flex alignItems="center">
      <Icon name={'logo-linkedin'} className={styles.soMeIcon} />
      {fullName}
    </Flex>
  </a>
);

interface Props {
  user: PublicUserWithGroups | CurrentUser;
}

export const UserInfo = ({ user }: Props) => (
  <ProfileSection title="Brukerinfo">
    <Flex column gap="var(--spacing-sm)">
      <InfoField name="Brukernavn">{user.username}</InfoField>
      <InfoField name="Navn">{user.fullName}</InfoField>
      {'email' in user && <EmailInfoField name="E-post" email={user.email} />}
      {'internalEmailAddress' in user && user.internalEmailAddress && (
        <EmailInfoField
          name="Abakus e-post"
          email={user.internalEmailAddress}
        />
      )}
      {user.githubUsername && (
        <GithubField githubUsername={user.githubUsername} />
      )}
      {user.linkedinId && (
        <LinkedInField linkedinId={user.linkedinId} fullName={user.fullName} />
      )}
    </Flex>
  </ProfileSection>
);
