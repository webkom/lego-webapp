import { Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { flatMap } from 'lodash-es';
import { Check, ChevronDown, Send, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProfilePicture } from '~/components/Image';
import PillSwitch, { type PillSwitchOption } from '~/components/PillSwitch';
import {
  getActiveGroupKeyword,
  getGroupKeywordSuggestions,
  getGroupKeywordTypeLabel,
  replaceActiveGroupKeyword,
  type SearchGroupKeyword,
} from '~/components/Search/searchGroupTags';
import { useAppSelector } from '~/redux/hooks';
import { useCurrentUser } from '~/redux/slices/auth';
import { selectGroupEntities } from '~/redux/slices/groups';
import { isNotNullish } from '~/utils';
import { Keyboard } from '~/utils/constants';
import EmptyState from '../EmptyState';
import styles from './AttendanceModalContent.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { KeyboardEvent } from 'react';
import type {
  PublicUser,
  PublicUserWithAbakusGroups,
} from '~/redux/models/User';

export type AttendanceModalRegistration = {
  id: EntityId;
  user: PublicUser | PublicUserWithAbakusGroups;
  pool?: EntityId;
};

export type AttendanceModalPool = {
  name: string;
  registrations: AttendanceModalRegistration[];
};

type Props = {
  pools: AttendanceModalPool[];
  togglePool: (index: number) => void;
  selectedPool: number;
  isMeeting?: boolean;
};

const filterableGroups = [
  {
    name: '1. Klasse',
    ids: [16, 22],
  },
  {
    name: '2. Klasse',
    ids: [17, 23],
  },
  {
    name: '3. Klasse',
    ids: [18, 24],
  },
  {
    name: '4. Klasse',
    ids: [19, 25],
  },
  {
    name: '5. Klasse',
    ids: [20, 26],
  },
];

const generateAmendedPools = (pools: AttendanceModalPool[]) => {
  if (pools.length === 1) return pools;

  const registrations = flatMap(pools, (pool) => pool.registrations);
  const summaryPool = {
    id: 'all',
    name: 'Alle',
    registrations,
  };
  return [summaryPool, ...pools];
};

const normalizeSearchValue = (value: string) =>
  value.toLowerCase().trim().replace(/\s+/g, ' ');

const getGroupTypeClass = (type: string) => {
  switch (type) {
    case 'komite':
      return styles.chipCommittee;
    case 'interesse':
      return styles.chipInterestGroup;
    case 'styre':
      return styles.chipBoard;
    case 'revy':
      return styles.chipRevue;
    case 'gruppe':
      return styles.chipGroup;
    default:
      return '';
  }
};

const GROUP_SUGGESTION_STAGGER_BASE_DELAY_MS = 20;
const GROUP_SUGGESTION_STAGGER_STEP_MS = 50;
const GROUP_SUGGESTION_STAGGER_MAX_INDEX = 5;
const CLASS_FILTER_STAGGER_BASE_DELAY_MS = 20;
const CLASS_FILTER_STAGGER_STEP_MS = 50;

const getGroupSuggestionAnimationDelay = (index: number) =>
  GROUP_SUGGESTION_STAGGER_BASE_DELAY_MS +
  Math.min(index, GROUP_SUGGESTION_STAGGER_MAX_INDEX) *
    GROUP_SUGGESTION_STAGGER_STEP_MS;

const getClassFilterAnimationDelay = (index: number) =>
  CLASS_FILTER_STAGGER_BASE_DELAY_MS + index * CLASS_FILTER_STAGGER_STEP_MS;

const AttendanceModalContent = ({
  pools,
  togglePool,
  selectedPool,
  isMeeting,
}: Props) => {
  const [search, setSearch] = useState<string>('');
  const [groupTags, setGroupTags] = useState<SearchGroupKeyword[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] =
    useState<number>(0);
  const [groupFilter, setGroupFilter] = useState<EntityId[] | null>(null);
  const [isClassFilterOpen, setIsClassFilterOpen] = useState(false);
  const [isGroupSuggestionsOpen, setIsGroupSuggestionsOpen] = useState(false);
  const [showActiveFiltersLeftShadow, setShowActiveFiltersLeftShadow] =
    useState(false);
  const [showActiveFiltersRightShadow, setShowActiveFiltersRightShadow] =
    useState(false);
  const [showSearchAnchor, setShowSearchAnchor] = useState(false);
  const [showBottomBarShadow, setShowBottomBarShadow] = useState(false);

  const groupEntities = useAppSelector(selectGroupEntities);
  const currentUser = useCurrentUser();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const classFilterRef = useRef<HTMLDivElement>(null);
  const groupSuggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeFiltersScrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const amendedPools = useMemo(() => generateAmendedPools(pools), [pools]);

  const poolOptions = useMemo<PillSwitchOption<string>[]>(
    () =>
      amendedPools.map((pool, index) => ({
        label: pool.name,
        value: String(index),
      })),
    [amendedPools],
  );

  const registrations = useMemo(
    () => amendedPools[selectedPool]?.registrations,
    [amendedPools, selectedPool],
  );

  const currentUserGroups = useMemo(
    () =>
      (currentUser?.abakusGroups ?? [])
        .map((groupId) => groupEntities[groupId])
        .filter(isNotNullish)
        .map((group) => ({
          id: group.id,
          name: group.name,
          type: String(group.type),
        })),
    [currentUser?.abakusGroups, groupEntities],
  );

  const groupSuggestions = useMemo(
    () =>
      getGroupKeywordSuggestions({
        availableGroups: currentUserGroups,
        selectedTags: groupTags,
        text: search,
      }),
    [currentUserGroups, groupTags, search],
  );

  const activeClassFilter = useMemo(
    () => filterableGroups.find((group) => groupFilter === group.ids),
    [groupFilter],
  );

  const activeGroupKeyword = getActiveGroupKeyword(search);
  const isGroupKeywordActive = Boolean(activeGroupKeyword);
  const showGroupSuggestions =
    isGroupKeywordActive && isGroupSuggestionsOpen && !isClassFilterOpen;
  const showGroupSuggestionList =
    showGroupSuggestions && groupSuggestions.length > 0;
  const showEmptyGroupSuggestions =
    showGroupSuggestions && groupSuggestions.length === 0;
  const showActiveFilters = groupTags.length > 0;
  const groupSuggestionsStatusMessage = showGroupSuggestions
    ? groupSuggestions.length > 0
      ? `${groupSuggestions.length} forslag tilgjengelig. Bruk pilene for å navigere, Enter for å velge og Escape for å lukke.`
      : 'Ingen grupper matcher akkurat nå.'
    : '';

  useEffect(() => {
    setSelectedSuggestionIndex((currentIndex) =>
      Math.min(currentIndex, Math.max(groupSuggestions.length - 1, 0)),
    );
  }, [groupSuggestions]);

  useEffect(() => {
    if (isClassFilterOpen) {
      setIsGroupSuggestionsOpen(false);
    }
  }, [isClassFilterOpen]);

  useEffect(() => {
    const selectedSuggestion =
      groupSuggestionRefs.current[selectedSuggestionIndex];
    if (!showGroupSuggestionList || !selectedSuggestion) {
      return;
    }

    selectedSuggestion.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [groupSuggestions, selectedSuggestionIndex, showGroupSuggestionList]);

  useEffect(() => {
    const scrollElement = activeFiltersScrollRef.current;
    if (!scrollElement || !showActiveFilters) {
      setShowActiveFiltersLeftShadow(false);
      setShowActiveFiltersRightShadow(false);
      return;
    }

    const updateActiveFilterShadows = () => {
      const maxScrollLeft =
        scrollElement.scrollWidth - scrollElement.clientWidth;
      const hasOverflow = maxScrollLeft > 1;

      if (!hasOverflow) {
        setShowActiveFiltersLeftShadow(false);
        setShowActiveFiltersRightShadow(false);
        return;
      }

      setShowActiveFiltersLeftShadow(scrollElement.scrollLeft > 1);
      setShowActiveFiltersRightShadow(
        scrollElement.scrollLeft < maxScrollLeft - 1,
      );
    };

    updateActiveFilterShadows();
    scrollElement.addEventListener('scroll', updateActiveFilterShadows, {
      passive: true,
    });
    window.addEventListener('resize', updateActiveFilterShadows);

    const resizeObserver = new ResizeObserver(updateActiveFilterShadows);
    resizeObserver.observe(scrollElement);

    return () => {
      scrollElement.removeEventListener('scroll', updateActiveFilterShadows);
      window.removeEventListener('resize', updateActiveFilterShadows);
      resizeObserver.disconnect();
    };
  }, [groupTags, showActiveFilters]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        classFilterRef.current &&
        !classFilterRef.current.contains(event.target as Node)
      ) {
        setIsClassFilterOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGroupTagSelect = (group: SearchGroupKeyword) => {
    setGroupTags((currentTags) => [...currentTags, group]);
    setSearch(replaceActiveGroupKeyword(search));
    setSelectedSuggestionIndex(0);
    setIsGroupSuggestionsOpen(false);
    searchInputRef.current?.focus();
  };

  const handleGroupTagRemove = (groupId: EntityId) => {
    setGroupTags((currentTags) =>
      currentTags.filter((group) => String(group.id) !== String(groupId)),
    );
    searchInputRef.current?.focus();
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === 'Backspace' &&
      search.length === 0 &&
      groupTags.length > 0
    ) {
      event.preventDefault();
      handleGroupTagRemove(groupTags[groupTags.length - 1].id);
      return;
    }

    if (!isGroupKeywordActive) {
      return;
    }

    switch (event.key) {
      case Keyboard.ESCAPE:
        event.preventDefault();
        setIsGroupSuggestionsOpen(false);
        return;

      case Keyboard.UP:
        event.preventDefault();
        if (groupSuggestions.length === 0) return;
        setSelectedSuggestionIndex((currentIndex) =>
          currentIndex <= 0 ? groupSuggestions.length - 1 : currentIndex - 1,
        );
        return;

      case Keyboard.DOWN:
        event.preventDefault();
        if (groupSuggestions.length === 0) return;
        setSelectedSuggestionIndex((currentIndex) =>
          currentIndex >= groupSuggestions.length - 1 ? 0 : currentIndex + 1,
        );
        return;

      case Keyboard.ENTER:
        if (groupSuggestions.length === 0) return;
        event.preventDefault();
        handleGroupTagSelect(groupSuggestions[selectedSuggestionIndex]);
        return;

      default:
        return;
    }
  };

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(
      replaceActiveGroupKeyword(search),
    );
    const selectedGroupIds = new Set(
      groupTags.map((group) => String(group.id)),
    );

    return (registrations ?? []).filter((registration) => {
      const nameMatch = normalizeSearchValue(
        registration.user.fullName,
      ).includes(normalizedSearch);

      const groupKeywordMatch =
        groupTags.length === 0 ||
        ('abakusGroups' in registration.user &&
          registration.user.abakusGroups.some((groupId) =>
            selectedGroupIds.has(String(groupId)),
          ));

      const groupFilterMatch =
        !groupFilter ||
        ('abakusGroups' in registration.user &&
          registration.user.abakusGroups.some((groupId) =>
            groupFilter.includes(groupId),
          ));

      if (!normalizedSearch) return groupKeywordMatch && groupFilterMatch;
      return nameMatch && groupKeywordMatch && groupFilterMatch;
    });
  }, [registrations, search, groupTags, groupFilter]);

  useEffect(() => {
    const listElement = listRef.current;
    if (!listElement) {
      return;
    }

    const updateScrollChrome = () => {
      const hasOverflow =
        listElement.scrollHeight > listElement.clientHeight + 2;
      const isScrolled = listElement.scrollTop > 4;

      setShowSearchAnchor(hasOverflow && isScrolled);
      setShowBottomBarShadow(hasOverflow && isScrolled);
    };

    updateScrollChrome();
    listElement.addEventListener('scroll', updateScrollChrome, {
      passive: true,
    });
    window.addEventListener('resize', updateScrollChrome);

    const resizeObserver = new ResizeObserver(updateScrollChrome);
    resizeObserver.observe(listElement);

    return () => {
      listElement.removeEventListener('scroll', updateScrollChrome);
      window.removeEventListener('resize', updateScrollChrome);
      resizeObserver.disconnect();
    };
  }, [filteredRegistrations.length, selectedPool]);

  return (
    <Flex
      column
      className={styles.modalContent}
      data-test-id="attendance-modal-content"
    >
      <div
        className={cx(
          styles.searchInput,
          showSearchAnchor && styles.searchAnchored,
        )}
      >
        <div
          className={styles.topBar}
          onClick={() => searchInputRef.current?.focus()}
        >
          <div
            className={cx(
              styles.searchField,
              !isMeeting && styles.searchFieldJoined,
            )}
          >
            <div className={styles.searchPrefix}>
              <Icon name="search" size={16} />
            </div>

            <div className={styles.searchValue}>
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Søk etter navn, eller skriv :gruppe"
                value={search}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setSearch(nextValue);
                  setIsGroupSuggestionsOpen(
                    Boolean(getActiveGroupKeyword(nextValue)),
                  );
                  setSelectedSuggestionIndex(0);
                }}
                onFocus={() => {
                  if (getActiveGroupKeyword(search)) {
                    setIsGroupSuggestionsOpen(true);
                  }
                }}
                onBlur={() => setIsGroupSuggestionsOpen(false)}
                onKeyDown={handleSearchKeyDown}
                className={styles.searchFieldInput}
                aria-autocomplete="list"
                aria-expanded={showGroupSuggestions}
                aria-controls={
                  showGroupSuggestions ? 'group-suggestions-list' : undefined
                }
                aria-activedescendant={
                  showGroupSuggestionList
                    ? `group-suggestion-${selectedSuggestionIndex}`
                    : undefined
                }
                aria-describedby="group-suggestions-hint group-suggestions-status"
              />
            </div>
          </div>

          {!isMeeting && (
            <div
              ref={classFilterRef}
              className={styles.classFilterAnchor}
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className={cx(
                  styles.classFilterButton,
                  activeClassFilter && styles.classFilterButtonActive,
                  isClassFilterOpen && styles.classFilterButtonOpen,
                )}
                onClick={() => setIsClassFilterOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isClassFilterOpen}
                aria-label={
                  activeClassFilter
                    ? `Filtrer på ${activeClassFilter.name}`
                    : 'Filtrer på klasse'
                }
                title={
                  activeClassFilter
                    ? `Filtrerer på ${activeClassFilter.name}`
                    : 'Filtrer på klasse'
                }
              >
                <span className={styles.classFilterButtonLabel}>
                  {activeClassFilter ? activeClassFilter.name : 'Klasse'}
                </span>
                <ChevronDown size={14} />
              </button>

              {isClassFilterOpen && (
                <div className={styles.classFilterPopover} role="menu">
                  <button
                    type="button"
                    className={cx(
                      styles.classFilterOption,
                      !groupFilter && styles.classFilterOptionActive,
                    )}
                    style={{
                      animationDelay: `${getClassFilterAnimationDelay(0)}ms`,
                    }}
                    onClick={() => {
                      setGroupFilter(null);
                      setIsClassFilterOpen(false);
                    }}
                  >
                    <span className={styles.classFilterOptionContent}>
                      Alle kull
                    </span>
                    <Check
                      size={16}
                      aria-hidden="true"
                      className={styles.classFilterOptionIcon}
                    />
                  </button>

                  {filterableGroups.map((group, index) => {
                    const active = groupFilter === group.ids;

                    return (
                      <button
                        key={group.name}
                        type="button"
                        className={cx(
                          styles.classFilterOption,
                          active && styles.classFilterOptionActive,
                        )}
                        style={{
                          animationDelay: `${getClassFilterAnimationDelay(index + 1)}ms`,
                        }}
                        onClick={() => {
                          setGroupFilter(active ? null : group.ids);
                          setIsClassFilterOpen(false);
                        }}
                      >
                        <span className={styles.classFilterOptionContent}>
                          {group.name}
                        </span>
                        <Check
                          size={16}
                          aria-hidden="true"
                          className={styles.classFilterOptionIcon}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {showActiveFilters && (
          <div
            className={cx(
              styles.activeFilters,
              showActiveFiltersLeftShadow && styles.activeFiltersShadowLeft,
              showActiveFiltersRightShadow && styles.activeFiltersShadowRight,
            )}
          >
            <div
              ref={activeFiltersScrollRef}
              className={styles.activeFiltersScroll}
            >
              {groupTags.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={cx(styles.chip, getGroupTypeClass(group.type))}
                  onClick={() => handleGroupTagRemove(group.id)}
                  aria-label={`Fjern gruppefilter ${group.name}`}
                >
                  <span className={styles.chipLabel}>{group.name}</span>
                  <X size={12} />
                </button>
              ))}
            </div>
          </div>
        )}

        {showGroupSuggestions && (
          <div
            id="group-suggestions-list"
            className={styles.groupSuggestions}
            role="listbox"
            aria-label="Forslag til grupper"
          >
            {showEmptyGroupSuggestions && (
              <div className={styles.groupSuggestionsEmpty}>
                Ingen grupper matcher akkurat nå.
              </div>
            )}

            {showGroupSuggestionList &&
              groupSuggestions.map((group, index) => (
                <button
                  key={`${group.id}-${search}`}
                  id={`group-suggestion-${index}`}
                  ref={(element) => {
                    groupSuggestionRefs.current[index] = element;
                  }}
                  type="button"
                  className={cx(
                    styles.groupSuggestion,
                    index === selectedSuggestionIndex &&
                      styles.selectedGroupSuggestion,
                  )}
                  style={{
                    animationDelay: `${getGroupSuggestionAnimationDelay(index)}ms`,
                  }}
                  role="option"
                  aria-selected={index === selectedSuggestionIndex}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    handleGroupTagSelect(group);
                  }}
                  onFocus={() => setSelectedSuggestionIndex(index)}
                  onKeyDown={(event) => {
                    if (event.key === Keyboard.ESCAPE) {
                      event.preventDefault();
                      setIsGroupSuggestionsOpen(false);
                      searchInputRef.current?.focus();
                    }
                  }}
                >
                  <div className={styles.groupSuggestionContent}>
                    <span className={styles.groupSuggestionName}>
                      {group.name}
                    </span>
                  </div>
                  <span
                    className={cx(
                      styles.groupSuggestionType,
                      group.type === 'komite' &&
                        styles.groupSuggestionTypeCommittee,
                      group.type === 'interesse' &&
                        styles.groupSuggestionTypeInterestGroup,
                      group.type === 'styre' && styles.groupSuggestionTypeBoard,
                      group.type === 'revy' && styles.groupSuggestionTypeRevue,
                      group.type === 'gruppe' &&
                        styles.groupSuggestionTypeGroup,
                    )}
                  >
                    {getGroupKeywordTypeLabel(group.type)}
                  </span>
                </button>
              ))}
          </div>
        )}

        <p id="group-suggestions-hint" className={styles.srOnly}>
          Skriv kolon for å filtrere på grupper. Bruk pilene, Enter for å velge
          og Escape for å lukke.
        </p>

        <div
          id="group-suggestions-status"
          className={styles.srOnly}
          aria-live="polite"
          aria-atomic="true"
        >
          {groupSuggestionsStatusMessage}
        </div>
      </div>

      <ul ref={listRef} className={styles.list}>
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration) => (
            <li key={registration.id}>
              <a
                href={`/users/${registration.user.username}`}
                className={styles.rowLink}
              >
                <Flex
                  alignItems="center"
                  className={cx(
                    styles.row,
                    !isMeeting &&
                      !registration.pool &&
                      amendedPools[selectedPool].name === 'Alle' &&
                      styles.opacity,
                  )}
                >
                  <ProfilePicture size={30} user={registration.user} />
                  <span className={styles.rowName}>
                    {registration.user.fullName}
                  </span>
                </Flex>
              </a>
            </li>
          ))
        ) : (
          <EmptyState
            iconNode={<Send />}
            header={!isMeeting ? 'Ingen påmeldte ...' : undefined}
            body={!isMeeting ? 'Meld deg på da vel!' : 'Ingen brukere her ...'}
            className={styles.emptyState}
          />
        )}
      </ul>

      <div
        className={cx(
          styles.bottomBar,
          showBottomBarShadow && styles.bottomBarElevated,
        )}
      >
        <PillSwitch
          className={styles.poolSwitch}
          options={poolOptions}
          value={String(selectedPool)}
          onChange={(value) => togglePool(Number(value))}
          ariaLabel={
            isMeeting ? 'Velg invitasjonsliste' : 'Velg påmeldingsliste'
          }
        />
      </div>
    </Flex>
  );
};

export default AttendanceModalContent;
