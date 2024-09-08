import { Flex, Icon, LinkButton } from '@webkom/lego-bricks';
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
  showSettings: boolean;
}

export const UserInfo = ({ user, showSettings }: Props) => (
  <>
    <ul>
      <li>
        <DefaultField field="Brukernavn" value={user.username} />
      </li>
      <li>
        <EmailField field="E-post" value={user.email} />
      </li>
      {'internalEmailAddress' in user && user.internalEmailAddress && (
        <li>
          <EmailField field="Abakus e-post" value={user.internalEmailAddress} />
        </li>
      )}
      {user.githubUsername && (
        <li>
          <GithubField githubUsername={user.githubUsername} />
        </li>
      )}
      {user.linkedinId && (
        <li>
          <LinkedInField
            linkedinId={user.linkedinId}
            fullName={user.fullName}
          />
        </li>
      )}
    </ul>
    {showSettings && (
      <LinkButton href={`/users/${user.username}/settings/profile`}>
        Innstillinger
      </LinkButton>
    )}
  </>
);
