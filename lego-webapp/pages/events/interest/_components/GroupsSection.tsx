import { ConfirmModal, Skeleton } from '@webkom/lego-bricks';
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
  joinGroup,
  leaveGroup,
} from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { resolveGroupLink, selectGroupsByType } from '~/redux/slices/groups';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import GroupCircle from './GroupCircle';
import styles from './GroupsSection.module.css';
import { agendaEase, slideSwap } from './useAgendaAnimations';
import type { EntityId } from '@reduxjs/toolkit';
import type { PublicListGroup } from '~/redux/models/Group';

gsap.registerPlugin(DrawSVGPlugin);

const TILES_PER_PAGE = 16;
const TILES_PER_PAGE_MOBILE = 8;

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

  const markButton = (onPress: () => void) => (
    <button
      ref={markRef}
      type="button"
      aria-label={isMember ? `Forlat ${group.name}` : `Bli med i ${group.name}`}
      className={cx(
        styles.tileMark,
        styles.tileMarkInteractive,
        isMember && styles.tileMarkMember,
      )}
      disabled={pending}
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
    >
      {mark}
    </button>
  );

  // Leaving as leader hands the group to a co-leader, or deactivates it if
  // there is none - too much to hide behind a one-tap toggle
  const leaderLeaving = isMember && group.userMembership?.role === 'leader';

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
        leaderLeaving ? (
          <ConfirmModal
            title={`Forlat ${group.name}`}
            message="Du er leder for gruppen. En nestleder tar over hvis gruppen har en — ellers blir gruppen deaktivert. Er du sikker?"
            onConfirm={onToggleMembership}
          >
            {({ openConfirmModal }) => markButton(openConfirmModal)}
          </ConfirmModal>
        ) : (
          markButton(onToggleMembership)
        )
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
  const [pendingGroupId, setPendingGroupId] = useState<EntityId | null>(null);
  const [justJoinedId, setJustJoinedId] = useState<EntityId | null>(null);

  const groups = useAppSelector((state) =>
    selectGroupsByType<PublicListGroup>(state, GroupType.Interest),
  );
  const fetching = useAppSelector((state) => state.groups.fetching);
  const currentUser = useCurrentUser();

  const dispatch = useAppDispatch();

  const toggleMembership = async (group: PublicListGroup) => {
    if (!currentUser || pendingGroupId !== null) return;

    setPendingGroupId(group.id);
    try {
      if (group.userMembership) {
        await dispatch(
          leaveGroup(
            { id: group.userMembership.id, user: currentUser },
            group.id,
          ),
        );
      } else {
        await dispatch(joinGroup(group.id, currentUser));
      }
      await dispatch(fetchAllWithType(GroupType.Interest));

      if (group.userMembership) {
        setJustJoinedId((id) => (id === group.id ? null : id));
      } else {
        setJustJoinedId(group.id);
      }
    } catch {
      // joinGroup/leaveGroup carry errorMessage metas, so failures have
      // already been toasted - the mark just settles back
    } finally {
      setPendingGroupId(null);
    }
  };

  const sortedGroups = [...groups].sort(
    (a, b) =>
      Number(b.active) - Number(a.active) || a.name.localeCompare(b.name, 'nb'),
  );

  const isMobile = useIsMobileViewport();
  const tilesPerPage = isMobile ? TILES_PER_PAGE_MOBILE : TILES_PER_PAGE;
  const firstPageCapacity = tilesPerPage - 1;
  const pageCount =
    1 +
    Math.max(
      0,
      Math.ceil((sortedGroups.length - firstPageCapacity) / tilesPerPage),
    );
  const currentPage = Math.min(page, pageCount - 1);
  const pageStart =
    currentPage === 0
      ? 0
      : firstPageCapacity + (currentPage - 1) * tilesPerPage;
  const pageGroups = sortedGroups.slice(
    pageStart,
    pageStart + (currentPage === 0 ? firstPageCapacity : tilesPerPage),
  );

  const gridRef = useRef<HTMLDivElement>(null);
  const prevPageRef = useRef(currentPage);

  useLayoutEffect(() => {
    const grid = gridRef.current;
    const prevPage = prevPageRef.current;
    prevPageRef.current = currentPage;

    if (!grid || prevPage === currentPage) return;

    const timeline = slideSwap(
      gsap.timeline(),
      grid,
      currentPage > prevPage ? 72 : -72,
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
        {currentPage === 0 && (
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
        )}
        {pageGroups.map((group) => (
          <GroupTile
            key={group.id}
            group={group}
            isMember={!!group.userMembership}
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
      <div className={styles.note}>Du kan starte opp en inaktiv gruppe</div>
    </section>
  );
};

export default GroupsSection;
