import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import React from 'react';
import { ProfilePicture } from '~/components/Image';
import { ROLES, type RoleType } from '~/utils/constants';
import styles from './GroupMember.module.css';
import type { PublicUser } from '~/redux/models/User';

type Props = {
  user: PublicUser;
  roles?: RoleType[];
  groupName?: string;
};

const DisplayElement: React.FC<{
  roles: RoleType[] | undefined;
  groupName: string | undefined;
  user: PublicUser;
}> = ({ roles, groupName, user }) => {
  const isReadme = groupName === 'readme';
  let titleElement = null;

  if (roles?.includes('leader')) {
    titleElement = (
      <span className={styles.title}>
        {isReadme ? 'Redaktør' : ROLES['leader']}
      </span>
    );
  } else if (roles?.includes('co-leader')) {
    titleElement = <span className={styles.title}>{ROLES['co-leader']}</span>;
  } else if ((roles && roles.length > 1) || (roles && roles[0] !== 'member')) {
    titleElement = (
      <span className={styles.title}>
        {roles?.map((role) => (
          <span key={role}>
            {ROLES[role]}
            <br />
          </span>
        ))}
      </span>
    );
  }

  return (
    <div className={styles.container}>
      <ProfilePicture user={user} size={90} />
      <span className={styles.name}>{user.fullName}</span>
      <br />
      {titleElement}
    </div>
  );
};

const GroupMember = ({ user, roles, groupName }: Props) => {
  return (
    <a href={`/users/${user.username}`}>
      <Flex
        column
        gap="var(--spacing-xs)"
        alignItems="center"
        className={cx(
          styles.member,
          roles?.includes('leader') && styles.leader,
          roles?.includes('co-leader') && styles.coLeader,
        )}
      >
        <DisplayElement roles={roles} groupName={groupName} user={user} />
      </Flex>
    </a>
  );
};

export default GroupMember;
