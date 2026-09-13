import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { flatMap } from 'lodash-es';
import { Send } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { GroupType } from 'app/models';
import { TextInput } from '~/components/Form';
import { ProfilePicture } from '~/components/Image';
import {
  buildGroupFilterOptions,
  getActiveGroupKeyword,
  getGroupKeywordSuggestions,
  getGroupKeywordTypeLabel,
  matchesGroupKeywords,
  parseGroupSearchQuery,
  replaceActiveGroupKeyword,
  serializeGroupSearchQuery,
  type SearchGroupKeyword,
} from '~/components/Search/searchGroupTags';
import { AttendanceFilterPicker } from '~/components/UserAttendance/AttendanceFilterPicker';
import { gradeGroupFilters } from '~/components/UserAttendance/gradeGroupFilters';
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

type TabProps = {
  name: string;
  index: number;
  activePoolIndex: number;
  togglePool: (pool: number) => void;
};

const Tab = ({ name, index, activePoolIndex, togglePool }: TabProps) => (
  <button
    type="button"
    onClick={() => togglePool(index)}
    aria-pressed={activePoolIndex === index}
    className={cx(
      styles.navButton,
      activePoolIndex === index && styles.activeItem,
    )}
  >
    {name}
  </button>
);

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

const AttendanceModalContent = ({
  pools,
  togglePool,
  selectedPool,
  isMeeting = false,
}: Props) => {
  const [search, setSearch] = useState('');
  const [isGroupSuggestionsOpen, setIsGroupSuggestionsOpen] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(0);
  const groupEntities = useAppSelector(selectGroupEntities);
  const currentUser = useCurrentUser();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const groupSuggestionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const amendedPools = useMemo(() => generateAmendedPools(pools), [pools]);

  const registrations = useMemo(
    () => amendedPools[selectedPool]?.registrations ?? [],
    [amendedPools, selectedPool],
  );

  const currentUserGroups = useMemo(
    () =>
      buildGroupFilterOptions(
        (currentUser?.abakusGroups ?? [])
          .map((groupId) => groupEntities[groupId])
          .filter(isNotNullish)
          .map((group) => ({
            id: group.id,
            groupIds: [group.id],
            name: group.name,
            type: String(group.type),
          })),
      ),
    [currentUser?.abakusGroups, groupEntities],
  );

  const availableGroupFilters = useMemo(
    () =>
      buildGroupFilterOptions([
        ...(!isMeeting ? gradeGroupFilters : []),
        ...currentUserGroups.filter((group) => group.type !== GroupType.Grade),
      ]),
    [currentUserGroups, isMeeting],
  );

  const parsedSearch = useMemo(
    () => parseGroupSearchQuery(search, availableGroupFilters),
    [availableGroupFilters, search],
  );

  const activeGroupKeyword = getActiveGroupKeyword(search);
  const groupSuggestions = useMemo(
    () =>
      getGroupKeywordSuggestions({
        availableGroups: availableGroupFilters,
        selectedTags: parsedSearch.tags,
        text: search,
      }),
    [availableGroupFilters, parsedSearch.tags, search],
  );
  const activeKeywordIsSelected =
    activeGroupKeyword &&
    parsedSearch.tags.some(
      (group) =>
        normalizeSearchValue(group.name) ===
        normalizeSearchValue(activeGroupKeyword.query),
    );
  const showGroupSuggestions =
    Boolean(activeGroupKeyword) &&
    !activeKeywordIsSelected &&
    isGroupSuggestionsOpen;
  const textWithoutActiveKeyword = activeGroupKeyword
    ? replaceActiveGroupKeyword(parsedSearch.text)
    : parsedSearch.text;

  useEffect(() => {
    setSelectedSuggestionIndex((currentIndex) =>
      Math.min(currentIndex, Math.max(groupSuggestions.length - 1, 0)),
    );
  }, [groupSuggestions.length]);

  useEffect(() => {
    if (!showGroupSuggestions) return;

    groupSuggestionRefs.current[selectedSuggestionIndex]?.scrollIntoView({
      block: 'nearest',
    });
  }, [selectedSuggestionIndex, showGroupSuggestions]);

  const updateGroupFilters = (
    groups: SearchGroupKeyword[],
    text = textWithoutActiveKeyword,
  ) => {
    const nextSearch = serializeGroupSearchQuery(groups, text);

    setSearch(groups.length > 0 && nextSearch ? `${nextSearch} ` : nextSearch);
    setSelectedSuggestionIndex(0);
    setIsGroupSuggestionsOpen(false);
  };

  const selectGroupSuggestion = (group: SearchGroupKeyword) => {
    const nextGroups =
      group.type === GroupType.Grade
        ? [
            group,
            ...parsedSearch.tags.filter((tag) => tag.type !== GroupType.Grade),
          ]
        : [...parsedSearch.tags, group];

    updateGroupFilters(nextGroups);
    searchInputRef.current?.focus();
  };

  const toggleGroupFilter = (group: SearchGroupKeyword) => {
    const isSelected = parsedSearch.tags.some(
      (tag) => String(tag.id) === String(group.id),
    );
    const groupsWithoutSelected = parsedSearch.tags.filter(
      (tag) => String(tag.id) !== String(group.id),
    );

    if (isSelected) {
      updateGroupFilters(groupsWithoutSelected);
      return;
    }

    if (group.type === GroupType.Grade) {
      updateGroupFilters([
        group,
        ...parsedSearch.tags.filter((tag) => tag.type !== GroupType.Grade),
      ]);
      return;
    }

    updateGroupFilters([...parsedSearch.tags, group]);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!showGroupSuggestions) return;

    switch (event.key) {
      case Keyboard.ESCAPE:
        event.preventDefault();
        event.stopPropagation();
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
        selectGroupSuggestion(groupSuggestions[selectedSuggestionIndex]);
        return;

      default:
        return;
    }
  };

  const filteredRegistrations = useMemo(() => {
    const normalizedSearch = normalizeSearchValue(textWithoutActiveKeyword);
    const plainSearchGroups =
      parsedSearch.tags.length === 0
        ? currentUserGroups.filter(
            (group) => normalizeSearchValue(group.name) === normalizedSearch,
          )
        : [];
    const selectedGradeGroups = parsedSearch.tags.filter(
      (group) => group.type === GroupType.Grade,
    );
    const selectedMembershipGroups = parsedSearch.tags.filter(
      (group) => group.type !== GroupType.Grade,
    );

    return registrations.filter((registration) => {
      const nameMatch = normalizeSearchValue(
        registration.user.fullName,
      ).includes(normalizedSearch);

      const userGroupIds =
        'abakusGroups' in registration.user
          ? registration.user.abakusGroups
          : [];
      const gradeMatch = matchesGroupKeywords(
        userGroupIds,
        selectedGradeGroups,
      );
      const membershipMatch = matchesGroupKeywords(
        userGroupIds,
        selectedMembershipGroups,
      );
      const plainGroupMatch =
        plainSearchGroups.length > 0 &&
        matchesGroupKeywords(userGroupIds, plainSearchGroups);

      return (nameMatch || plainGroupMatch) && gradeMatch && membershipMatch;
    });
  }, [
    currentUserGroups,
    parsedSearch.tags,
    registrations,
    textWithoutActiveKeyword,
  ]);

  const suggestionStatus = showGroupSuggestions
    ? groupSuggestions.length > 0
      ? `${groupSuggestions.length} gruppeforslag tilgjengelig.`
      : 'Ingen grupper matcher søket.'
    : '';

  return (
    <Flex
      column
      gap="var(--spacing-md)"
      className={styles.modalContent}
      data-test-id="attendance-modal-content"
    >
      <div className={styles.searchContainer}>
        <div className={styles.searchControls}>
          <TextInput
            inputRef={searchInputRef}
            type="text"
            prefix="search"
            placeholder="Søk etter navn eller skriv :gruppe"
            value={search}
            onChange={(event) => {
              const nextSearch = event.target.value;
              setSearch(nextSearch);
              setIsGroupSuggestionsOpen(
                Boolean(getActiveGroupKeyword(nextSearch)),
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
            className={styles.searchInput}
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={showGroupSuggestions}
            aria-controls={
              showGroupSuggestions ? 'attendance-group-suggestions' : undefined
            }
            aria-activedescendant={
              showGroupSuggestions && groupSuggestions.length > 0
                ? `attendance-group-suggestion-${selectedSuggestionIndex}`
                : undefined
            }
            aria-describedby="attendance-group-filter-hint attendance-group-filter-status"
          />

          <AttendanceFilterPicker
            groups={availableGroupFilters}
            selectedGroups={parsedSearch.tags}
            onToggleGroup={toggleGroupFilter}
          />
        </div>

        {showGroupSuggestions && (
          <div
            id="attendance-group-suggestions"
            className={styles.groupSuggestions}
            role="listbox"
            aria-label="Gruppeforslag"
          >
            {groupSuggestions.length > 0 ? (
              groupSuggestions.map((group, index) => (
                <button
                  key={group.id}
                  id={`attendance-group-suggestion-${index}`}
                  ref={(element) => {
                    groupSuggestionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  tabIndex={-1}
                  aria-selected={index === selectedSuggestionIndex}
                  className={cx(
                    styles.groupSuggestion,
                    index === selectedSuggestionIndex &&
                      styles.selectedGroupSuggestion,
                  )}
                  onMouseEnter={() => setSelectedSuggestionIndex(index)}
                  onPointerDown={(event) => {
                    event.preventDefault();
                  }}
                  onClick={() => selectGroupSuggestion(group)}
                >
                  <span>{group.name}</span>
                  <span
                    className={styles.groupSuggestionType}
                    data-group-type={group.type}
                  >
                    {getGroupKeywordTypeLabel(group.type)}
                  </span>
                </button>
              ))
            ) : (
              <div className={styles.emptyGroupSuggestions}>
                Ingen grupper matcher søket.
              </div>
            )}
          </div>
        )}

        <span id="attendance-group-filter-hint" className={styles.srOnly}>
          Skriv kolon for å filtrere på klasse eller gruppe.
        </span>
        <span
          id="attendance-group-filter-status"
          className={styles.srOnly}
          aria-live="polite"
          aria-atomic="true"
        >
          {suggestionStatus}
        </span>
      </div>

      <ul className={styles.list}>
        {filteredRegistrations.length > 0 ? (
          filteredRegistrations.map((registration) => (
            <li key={registration.id}>
              <Flex
                alignItems="center"
                className={cx(
                  styles.row,
                  !isMeeting &&
                    !registration.pool &&
                    amendedPools[selectedPool]?.name === 'Alle' &&
                    styles.opacity,
                )}
              >
                <ProfilePicture size={30} user={registration.user} />
                <a href={`/users/${registration.user.username}`}>
                  {registration.user.fullName}
                </a>
              </Flex>
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

      <Flex alignItems="stretch" className={styles.nav}>
        {amendedPools.map((pool, index) => (
          <Tab
            name={pool.name}
            key={pool.name}
            index={index}
            activePoolIndex={selectedPool}
            togglePool={togglePool}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default AttendanceModalContent;
