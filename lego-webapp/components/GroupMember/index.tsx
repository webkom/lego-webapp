import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import React from 'react';
import { ProfilePicture } from '~/components/Image';
import Tooltip from '~/components/Tooltip';
import { ROLES, type RoleType } from '~/utils/constants';
import styles from './GroupMember.module.css';
import type { PublicUser } from '~/redux/models/User';

type Props = {
  user: PublicUser;
  roles?: RoleType[];
  groupName?: string;
};

const DisplayRoles: React.FC<{
  roles?: RoleType[];
  groupName?: string;
  user: PublicUser;
}> = ({ roles, groupName, user }) => {
  const isReadme = groupName === 'readme';
  const filteredRoles = roles?.filter((role) => role !== 'member') || [];
  const visibleRoles = filteredRoles.slice(0, 2);
  const hiddenRoles = filteredRoles.slice(2);
  const titleElement = filteredRoles.length > 0 && (
    <Flex column alignItems="center">
      {visibleRoles.map((role) => (
        <span key={role} className={styles.title}>
          {isReadme && role === 'leader' ? 'Redaktør' : ROLES[role]}
        </span>
      ))}
      {hiddenRoles.length > 0 && (
        <Tooltip
          className={styles.tooltipContainer}
          content={hiddenRoles.map((role) => ROLES[role]).join(', ')}
          positions={'right'}
        >
          <span className={styles.title}>+{hiddenRoles.length}</span>
        </Tooltip>
      )}
    </Flex>
  );

  return (
    <Flex column alignItems="center">
      <a href={`/users/${user.username}`}>
        <Flex column alignItems="center">
          <ProfilePicture user={user} size={90} />
          <span className={styles.name}>{user.fullName}</span>
        </Flex>
      </a>
      {titleElement}
    </Flex>
  );
};

const GroupMember = ({ user, roles, groupName }: Props) => {
  return (
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
      <DisplayRoles roles={roles} groupName={groupName} user={user} />
    </Flex>
  );
};

export default GroupMember;
