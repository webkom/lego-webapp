import {
  Button,
  ConfirmModal,
  Flex,
  Icon,
  PressEvent,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { groupBy, orderBy } from 'lodash';
import { CircleMinus } from 'lucide-react';
import moment from 'moment-timezone';
import { Link } from 'react-router';
import { CircularPicture } from 'app/components/Image';
import Pill from 'app/components/Pill';
import Tooltip from 'app/components/Tooltip';
import { resolveGroupLink, selectGroupEntities } from 'app/reducers/groups';
import styles from 'app/routes/users/components/UserProfile/UserProfile.module.css';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { GroupType, type Dateish } from 'app/models';
import type { PublicGroup } from 'app/store/models/Group';
import type Membership from 'app/store/models/Membership';
import type { PastMembership } from 'app/store/models/Membership';
import type { Optional } from 'utility-types';
import { deleteMembershipHistory } from 'app/actions/GroupActions';
import { useCurrentUser } from 'app/reducers/auth';
import { useIsCurrentUser } from '../../utils';
import { useEffect } from 'react';

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
    <Flex column gap="var(--spacing-sm)" className={styles.rightContent}>
      <Flex wrap gap="var(--spacing-sm)">
        {membershipsAsPills.map((membership) => (
          <GroupPill key={membership.id} group={membership.abakusGroup} />
        ))}
      </Flex>
      <Flex wrap gap="var(--spacing-sm)">
        {groupedMemberships.map((memberships) => (
          <GroupBadge memberships={memberships} key={memberships[0].id} />
        ))}
      </Flex>
    </Flex>
  );
};

const GroupPill = ({ group }: { group: PublicGroup }) =>
  group.showBadge ? <Pill key={group.id}>{group.name}</Pill> : null;

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
  const dispatch = useAppDispatch();

  const params = useParams<{ username: string }>();
  const isCurrentUser = useIsCurrentUser(params.username);

  useEffect(() => {
    console.log(params, isCurrentUser);
  }, [params, isCurrentUser]);

  const abakusGroup = memberships[0].abakusGroup;
  if (!abakusGroup.showBadge) return null;
  const sortedMemberships = orderBy(memberships, (membership) =>
    moment(membership.startDate || membership.createdAt),
  );
  const firstMembership = sortedMemberships[0];
  const lastMembership = sortedMemberships[sortedMemberships.length - 1];
  const { id, name, logo, type } = abakusGroup;
  const isInterestGroup = type === GroupType.Interest;
  const groupElement = (
    <div className={styles.badges}>
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
    </div>
  );
  const link = resolveGroupLink(abakusGroup);

  if (!link) {
    return groupElement;
  }

  return (
    <div className={styles.badgeContainer}>
      <Link key={id} to={link}>
        {groupElement}
      </Link>
      {!activeMembership && isCurrentUser && isInterestGroup && (
        <ConfirmModal
          title="Fjern historikk"
          message={
            <>
              Dette vil slette historikken din med{' '}
              <strong>{abakusGroup.name}</strong>
            </>
          }
          onConfirm={() =>
            dispatch(
              deleteMembershipHistory({
                userId: user?.id,
                groupId: abakusGroup.id,
              }),
            )
          }
        >
          {({ openConfirmModal }) => (
            <Icon
              onClick={openConfirmModal}
              className={styles.removeBadge}
              iconNode={<CircleMinus />}
              size={14}
            />
          )}
        </ConfirmModal>
      )}
    </div>
  );
};
