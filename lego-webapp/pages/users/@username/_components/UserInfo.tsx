import { Flex, Icon } from '@webkom/lego-bricks';
import Emoji from '~/components/Emoji';
import Pill from '~/components/Pill';
import {
  EmailInfoField,
  InfoField,
  ProfileSection,
} from '~/pages/users/@username/_components/ProfileSection';
import styles from '~/pages/users/@username/_components/UserProfile.module.css';
import { Exchange } from '~/redux/models/Exchange';
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

export const ExchangesInfo = ({ exchanges }: { exchanges: Exchange[] }) => (
  // <ProfileSection title="Utvekslingsopphold">
  //   {exchanges.map((exchange) => <ExchangePill key={exchange.id} exchange={exchange} />)}
  // </ProfileSection >
  <>
    <h3>Utvekslingsopphold</h3>
    <>  {exchanges.map((exchange) => <ExchangePill key={exchange.id} exchange={exchange} />)}
    </>
  </>
);

export const ExchangePill = ({ exchange }: { exchange: Exchange }) => (
  <Flex gap="var(--spacing-sm">
    <Pill color={exchange.semester == 'vår' ? 'var(--success-color)' : 'peru'}>{exchange.semester.slice(0, 1)}{exchange.year - 2000}</Pill>
    <Pill key={exchange.id}>{exchange.university.name}</Pill>
    <Pill key={exchange.id}><Emoji unicodeString={exchange.university.country.emoji.unicodeString} /></Pill>

  </Flex>
)