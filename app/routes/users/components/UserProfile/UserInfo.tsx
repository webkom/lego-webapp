import { Card, Flex, Icon } from '@webkom/lego-bricks';
import styles from 'app/routes/users/components/UserProfile/UserProfile.css';
import type { CurrentUser, DetailedUser } from 'app/store/models/User';

const DefaultField = ({ field, value }: { field: string; value: string }) => (
  <span>
    <strong>{field}:</strong> {value}
  </span>
);

const EmailField = ({ field, value }: { field: string; value: string }) => (
  <span>
    <strong>{field}:</strong>
    <a href={`mailto:${value}`}> {value}</a>
  </span>
);

const GithubField = ({ githubUsername }: { githubUsername: string }) => (
  <span>
    <Flex alignItems="center">
      <Icon name={'logo-github'} className={styles.githubIcon} />
      <a href={`https://github.com/${githubUsername}`}> {githubUsername}</a>
    </Flex>
  </span>
);

const LinkedInField = ({
  linkedinId,
  fullName,
}: {
  linkedinId: string;
  fullName: string;
}) => (
  <span>
    <Flex alignItems="center">
      <Icon name={'logo-linkedin'} className={styles.githubIcon} />
      <a href={`https://www.linkedin.com/in/${linkedinId}`}> {fullName}</a>
    </Flex>
  </span>
);

interface Props {
  user: DetailedUser | CurrentUser;
}

export const UserInfo = ({ user }: Props) => (
  <>
    <h3>Brukerinfo</h3>
    <Card className={styles.infoCard}>
      <Flex column gap="var(--spacing-sm)">
        <DefaultField field="Brukernavn" value={user.username} />
        <EmailField field="E-post" value={user.email} />
        {'internalEmailAddress' in user && user.internalEmailAddress && (
          <EmailField field="Abakus e-post" value={user.internalEmailAddress} />
        )}
        {user.githubUsername && (
          <GithubField githubUsername={user.githubUsername} />
        )}
        {user.linkedinId && (
          <LinkedInField
            linkedinId={user.linkedinId}
            fullName={user.fullName}
          />
        )}
      </Flex>
    </Card>
  </>
);
