import { Skeleton } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import cx from 'classnames';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
} from 'lucide-react';
import { useLayoutEffect, useRef, useState } from 'react';
import { navigate } from 'vike/client/router';
import { GroupType } from 'app/models';
import { activateOnKey } from '~/pages/events/interest/utils';
import {
  fetchAllWithType,
  fetchMemberships,
  joinGroup,
  leaveGroup,
} from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { resolveGroupLink, selectGroupsByType } from '~/redux/slices/groups';
import GroupCircle from './GroupCircle';
import styles from './GroupsSection.module.css';
import { agendaEase } from './useAgendaAnimations';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicListGroup } from '~/redux/models/Group';
import type { TransformedMembership } from '~/redux/slices/memberships';

gsap.registerPlugin(DrawSVGPlugin);

const GROUPS_PER_PAGE = 15;

const subline = (group: PublicListGroup) => {
  const status = group.active ? `${group.numberOfUsers} medlemmer` : 'inaktiv';
  return group.description ? `${group.description} · ${status}` : status;
};

type TileProps = {
  group: PublicListGroup;
  isMember: boolean;
  justJoined: boolean;
  pending: boolean;
  onToggleMembership?: () => void;
};

const GroupTile = ({
  group,
  isMember,
  justJoined,
  pending,
  onToggleMembership,
}: TileProps) => {
  const link = resolveGroupLink(group) ?? `/interest-groups/${group.id}`;
  const markRef = useRef<HTMLButtonElement>(null);

  // Pop the mark and draw the check stroke on the +→✓ transition
  useLayoutEffect(() => {
    const mark = markRef.current;
    const check = mark?.querySelector('path');
    if (!justJoined || !mark || !check) return;

    const timeline = gsap
      .timeline()
      .fromTo(
        mark,
        { scale: 0.85 },
        { scale: 1, duration: 0.3, ease: 'back.out(1.7)', clearProps: 'all' },
        0,
      )
      // The check path starts at its top-right tip, so draw it backwards to
      // get the natural left-to-right handwriting motion
      .fromTo(
        check,
        { drawSVG: '100% 100%' },
        {
          drawSVG: '0% 100%',
          duration: 0.4,
          ease: agendaEase,
          clearProps: 'all',
        },
        0.1,
      );

    return () => {
      timeline.kill();
      gsap.set([mark, check], { clearProps: 'all' });
    };
  }, [justJoined]);

  const mark = isMember ? (
    <Check size={14} />
  ) : group.active ? (
    <Plus size={14} />
  ) : (
    <RotateCcw size={13} />
  );

  return (
    <div
      role="button"
      tabIndex={0}
      title={
        group.active
          ? 'Se gruppen'
          : 'Inaktiv gruppe — se hvordan du starter den opp igjen'
      }
      className={cx(styles.tile, !group.active && styles.tileInactive)}
      onClick={() => navigate(link)}
      onKeyDown={activateOnKey(() => navigate(link))}
    >
      <GroupCircle group={group} />
      <span className={styles.tileText}>
        <span className={styles.tileName}>{group.name}</span>
        <span className={styles.tileSubline}>{subline(group)}</span>
      </span>
      {onToggleMembership ? (
        <button
          ref={markRef}
          type="button"
          aria-label={
            isMember ? `Forlat ${group.name}` : `Bli med i ${group.name}`
          }
          className={cx(
            styles.tileMark,
            styles.tileMarkInteractive,
            isMember && styles.tileMarkMember,
          )}
          disabled={pending}
          onClick={(e) => {
            e.stopPropagation();
            onToggleMembership();
          }}
        >
          {mark}
        </button>
      ) : (
        <span
          className={cx(styles.tileMark, isMember && styles.tileMarkMember)}
        >
          {mark}
        </span>
      )}
    </div>
  );
};

const GroupsSection = () => {
  const [page, setPage] = useState(0);
  const [membershipOverrides, setMembershipOverrides] = useState<
    Record<EntityId, boolean>
  >({});
  const [pendingGroupId, setPendingGroupId] = useState<EntityId | null>(null);
  const [justJoinedId, setJustJoinedId] = useState<EntityId | null>(null);

  const groups = useAppSelector((state) =>
    selectGroupsByType(state, GroupType.Interest),
  ) as PublicListGroup[];
  const fetching = useAppSelector((state) => state.groups.fetching);
  const currentUser = useCurrentUser();
  const memberGroupIds = currentUser?.abakusGroups ?? [];

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    [],
  );

  // Join/leave changes aren't reflected in currentUser.abakusGroups, so
  // completed toggles are tracked here to keep the marks in sync
  const isMemberOf = (group: PublicListGroup) =>
    membershipOverrides[group.id] ?? memberGroupIds.includes(group.id);

  const toggleMembership = async (group: PublicListGroup) => {
    if (!currentUser || pendingGroupId !== null) return;

    setPendingGroupId(group.id);
    try {
      if (isMemberOf(group)) {
        // Leaving requires the membership id, which only lives on the
        // memberships endpoint
        const result = (await dispatch(
          fetchMemberships({
            groupId: group.id,
            query: { userUsername: currentUser.username },
          }),
        )) as unknown as {
          payload?: {
            entities?: {
              memberships?: Record<string, { id: EntityId; user: EntityId }>;
            };
          };
        };
        const membership = Object.values(
          result.payload?.entities?.memberships ?? {},
        ).find((m) => m.user === currentUser.id);

        if (membership) {
          // leaveGroup only reads the membership id and the user's username
          await dispatch(
            leaveGroup(
              {
                ...membership,
                user: currentUser,
              } as unknown as TransformedMembership,
              group.id,
            ),
          );
          setMembershipOverrides((o) => ({ ...o, [group.id]: false }));
          setJustJoinedId((id) => (id === group.id ? null : id));
        }
      } else {
        await dispatch(joinGroup(group.id, currentUser));
        setMembershipOverrides((o) => ({ ...o, [group.id]: true }));
        setJustJoinedId(group.id);
      }
    } finally {
      setPendingGroupId(null);
    }
  };

  const sortedGroups = [...groups].sort((a, b) =>
    a.name.localeCompare(b.name, 'nb'),
  );

  const pageCount = Math.max(
    1,
    Math.ceil(sortedGroups.length / GROUPS_PER_PAGE),
  );
  const currentPage = Math.min(page, pageCount - 1);
  const pageGroups = sortedGroups.slice(
    currentPage * GROUPS_PER_PAGE,
    (currentPage + 1) * GROUPS_PER_PAGE,
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(currentPage);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const prevPage = prevPageRef.current;
    prevPageRef.current = currentPage;

    if (!grid || prevPage === currentPage) return;

    const timeline = gsap
      .timeline()
      .fromTo(
        grid,
        { x: currentPage > prevPage ? 72 : -72 },
        { x: 0, duration: 0.55, ease: agendaEase, clearProps: 'transform' },
      )
      .fromTo(
        grid,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.25,
          ease: 'power1.out',
          clearProps: 'opacity',
        },
        0,
      );

    return () => {
      timeline.kill();
      gsap.set(grid, { clearProps: 'transform,opacity' });
    };
  }, [currentPage]);

  return (
    <section id="grupper" className={styles.groups}>
      <div className={styles.header}>
        <h2>Finn din greie</h2>
        <div className={styles.pageArrows}>
          <button
            type="button"
            aria-label="Forrige gruppeside"
            className={styles.pageArrow}
            disabled={currentPage === 0}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            aria-label="Neste gruppeside"
            className={styles.pageArrow}
            disabled={currentPage >= pageCount - 1}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
      <div ref={gridRef} className={styles.grid}>
        <a
          href="/interest-groups/create-application"
          title="Start en ny gruppe"
          className={cx(styles.tile, styles.createTile)}
        >
          <span className={styles.createCircle} aria-hidden>
            <Plus size={14} />
          </span>
          <span className={styles.tileText}>
            <span className={styles.tileName}>Start en ny gruppe</span>
            <span className={styles.tileSubline}>
              har du en idé? det tar to minutter
            </span>
          </span>
        </a>
        {pageGroups.map((group) => (
          <GroupTile
            key={group.id}
            group={group}
            isMember={isMemberOf(group)}
            justJoined={justJoinedId === group.id}
            pending={pendingGroupId === group.id}
            onToggleMembership={
              currentUser && group.active
                ? () => toggleMembership(group)
                : undefined
            }
          />
        ))}
        {sortedGroups.length === 0 && fetching && (
          <Skeleton array={5} className={styles.skeletonTile} />
        )}
      </div>
      <div className={styles.note}>
        Du kan starte opp inaktive grupper igjen
      </div>
    </section>
  );
};

export default GroupsSection;
