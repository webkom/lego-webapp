import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { groupBy, orderBy } from 'lodash';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import { CircularPicture } from 'app/components/Image';
import Pill from 'app/components/Pill';
import Tooltip from 'app/components/Tooltip';
import { resolveGroupLink, selectGroupEntities } from 'app/reducers/groups';
import styles from 'app/routes/users/components/UserProfile/UserProfile.module.css';
import { useAppSelector } from 'app/store/hooks';
import type { Dateish } from 'app/models';
import type { PublicGroup } from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';
import type { PastMembership } from 'app/store/models/Membership';
import type { Optional } from 'utility-types';

export const GroupMemberships = ({
  memberships,
  pastMemberships,
}: {
  memberships: Membership[];
  pastMemberships: PastMembership[];
}) => {
  const groupEntities = useAppSelector(selectGroupEntities);

  const { membershipsAsBadges = [], membershipsAsPills = [] } = groupBy(
    memberships.map((membership) => ({
      ...membership,
      abakusGroup: groupEntities[membership.abakusGroup] as PublicGroup,
    })),
    (membership) =>
      membership.abakusGroup.logo
        ? 'membershipsAsBadges'
        : 'membershipsAsPills',
  );

  const { pastMembershipsAsBadges = [] } = groupBy(pastMemberships, (m) =>
    m.abakusGroup.logo ? 'pastMembershipsAsBadges' : 'pastMembershipsAsPills',
  );
  const filteredPastMembershipsAsBadges = pastMembershipsAsBadges.filter(
    (membership) => {
      const membershipDuration = moment.duration(
        moment(membership.endDate).diff(membership.startDate),
      );
      return (
        membership.abakusGroup.type !== 'interesse' ||
        membershipDuration.asWeeks() > 2
      );
    },
  );

  const groupedMemberships = orderBy(
    groupBy(
      [...filteredPastMembershipsAsBadges, ...membershipsAsBadges],
      (membership) => membership.abakusGroup.id,
    ),
    [
      (memberships) => !memberships.some((membership) => membership.isActive),
      (memberships) => memberships[0].abakusGroup.type === 'interesse',
      (memberships) => memberships[0].abakusGroup.type !== 'styre',
    ],
  );

  return (
    <Flex column className={styles.rightContent}>
      <Flex wrap>
        {membershipsAsPills.map((membership) => (
          <GroupPill key={membership.id} group={membership.abakusGroup} />
        ))}
      </Flex>
      <Flex wrap>
        {groupedMemberships.map((memberships) => (
          <GroupBadge memberships={memberships} key={memberships[0].id} />
        ))}
      </Flex>
    </Flex>
  );
};

const GroupPill = ({ group }: { group: PublicGroup }) =>
  group.showBadge ? (
    <Pill key={group.id} className={styles.membershipPill}>
      {group.name}
    </Pill>
  ) : null;

const badgeTooltip = (groupName: string, start: Dateish, end?: Dateish) => {
  const startYear = moment(start).year();
  const endYear = end ? moment(end).year() : 'd.d.';
  return `${groupName} (${startYear} - ${endYear})`;
};

const GroupBadge = ({
  memberships,
}: {
  memberships: Optional<PastMembership, 'startDate' | 'endDate'>[];
}) => {
  const activeMembership = memberships.find(
    (membership) => membership.isActive,
  );
  const abakusGroup = memberships[0].abakusGroup;
  if (!abakusGroup.showBadge) return null;
  const sortedMemberships = orderBy(memberships, (membership) =>
    moment(membership.startDate || membership.createdAt),
  );
  const firstMembership = sortedMemberships[0];
  const lastMembership = sortedMemberships[sortedMemberships.length - 1];
  const { id, name, logo } = abakusGroup;
  const groupElement = (
    <Tooltip
      key={id}
      content={badgeTooltip(
        abakusGroup.name,
        firstMembership.startDate || firstMembership.createdAt,
        lastMembership.endDate,
      )}
    >
      <CircularPicture
        alt={name}
        src={logo!}
        size={50}
        className={cx(
          styles.membershipBadge,
          !activeMembership && styles.inactive,
        )}
      />
    </Tooltip>
  );
  const link = resolveGroupLink(abakusGroup);

  if (!link) {
    return groupElement;
  }

  return (
    <Link key={id} to={link}>
      {groupElement}
    </Link>
  );
};
