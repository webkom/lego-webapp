import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { flatMap } from 'lodash-es';
import { RotateCcw, SearchX, Send, X } from 'lucide-react';
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
  replaceActiveGroupKeyword,
  toggleGroupTag,
  type SearchGroupKeyword,
} from '~/components/Search/searchGroupTags';
import { AttendanceFilterPicker } from '~/components/UserAttendance/AttendanceFilterPicker';
import {
  gradeGroupFilters,
  studyProgramGroupFilters,
} from '~/components/UserAttendance/gradeGroupFilters';
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
  const [searchText, setSearchText] = useState('');
  const [selectedTags, setSelectedTags] = useState<SearchGroupKeyword[]>([]);
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
        ...(!isMeeting ? studyProgramGroupFilters : []),
        ...currentUserGroups.filter(
          (group) =>
            group.type !== GroupType.Grade && group.type !== 'studieretning',
        ),
      ]),
    [currentUserGroups, isMeeting],
  );

  const activeGroupKeyword = getActiveGroupKeyword(searchText);
  const groupSuggestions = useMemo(
    () =>
      getGroupKeywordSuggestions({
        availableGroups: availableGroupFilters,
        selectedTags,
        text: searchText,
      }),
    [availableGroupFilters, selectedTags, searchText],
  );
  const showGroupSuggestions =
    Boolean(activeGroupKeyword) && isGroupSuggestionsOpen;
  const textWithoutActiveKeyword = activeGroupKeyword
    ? replaceActiveGroupKeyword(searchText)
    : searchText;

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

  const selectGroupSuggestion = (group: SearchGroupKeyword) => {
    setSelectedTags((tags) => toggleGroupTag(tags, group));
    setSearchText((text) => replaceActiveGroupKeyword(text));
    setSelectedSuggestionIndex(0);
    setIsGroupSuggestionsOpen(false);
    searchInputRef.current?.focus();
  };

  const toggleGroupFilter = (group: SearchGroupKeyword) => {
    setSelectedTags((tags) => toggleGroupTag(tags, group));
  };

  const removeGroupTag = (group: SearchGroupKeyword) => {
    setSelectedTags((tags) =>
      tags.filter((tag) => String(tag.id) !== String(group.id)),
    );
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key === Keyboard.BACKSPACE &&
      searchText === '' &&
      selectedTags.length > 0
    ) {
      event.preventDefault();
      setSelectedTags((tags) => tags.slice(0, -1));
      return;
    }

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
      selectedTags.length === 0
        ? currentUserGroups.filter(
            (group) => normalizeSearchValue(group.name) === normalizedSearch,
          )
        : [];
    const selectedGradeGroups = selectedTags.filter(
      (group) => group.type === GroupType.Grade,
    );
    const selectedStudyProgramGroups = selectedTags.filter(
      (group) => group.type === 'studieretning',
    );
    const selectedMembershipGroups = selectedTags.filter(
      (group) =>
        group.type !== GroupType.Grade && group.type !== 'studieretning',
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
      const studyProgramMatch = matchesGroupKeywords(
        userGroupIds,
        selectedStudyProgramGroups,
      );
      const membershipMatch = matchesGroupKeywords(
        userGroupIds,
        selectedMembershipGroups,
      );
      const plainGroupMatch =
        plainSearchGroups.length > 0 &&
        matchesGroupKeywords(userGroupIds, plainSearchGroups);

      return (
        (nameMatch || plainGroupMatch) &&
        gradeMatch &&
        studyProgramMatch &&
        membershipMatch
      );
    });
  }, [
    currentUserGroups,
    registrations,
    selectedTags,
    textWithoutActiveKeyword,
  ]);

  const isFiltering =
    selectedTags.length > 0 || normalizeSearchValue(searchText) !== '';

  const suggestionStatus = showGroupSuggestions
    ? groupSuggestions.length > 0
      ? `${groupSuggestions.length} gruppeforslag tilgjengelig.`
      : 'Ingen grupper matcher søket.'
    : isFiltering
      ? `Viser ${filteredRegistrations.length} av ${registrations.length}`
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
            placeholder={
              availableGroupFilters.length > 0
                ? 'Søk etter navn eller skriv :gruppe'
                : 'Søk etter navn'
            }
            value={searchText}
            onChange={(event) => {
              const nextSearch = event.target.value;
              setSearchText(nextSearch);
              setIsGroupSuggestionsOpen(
                Boolean(getActiveGroupKeyword(nextSearch)),
              );
              setSelectedSuggestionIndex(0);
            }}
            onFocus={() => {
              if (getActiveGroupKeyword(searchText)) {
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
            selectedGroups={selectedTags}
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
          Skriv kolon for å filtrere på klasse eller gruppe. Valgte filtre vises
          som etiketter under søkefeltet og kan fjernes ved å trykke på dem
          eller slettetasten.
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

      {selectedTags.length > 0 && (
        <div className={styles.activeFilterBar}>
          <div className={styles.activeFilterChips}>
            {selectedTags.map((tag) => (
              <button
                key={String(tag.id)}
                type="button"
                className={styles.activeFilterChip}
                data-test-id="attendance-filter-chip"
                data-group-type={tag.type}
                aria-label={`Fjern filter: ${tag.name}`}
                onClick={() => removeGroupTag(tag)}
              >
                <span>{tag.name}</span>
                <X size={14} strokeWidth={2} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className={styles.activeFilterMeta}>
            <button
              type="button"
              className={styles.activeFilterClear}
              onClick={() => setSelectedTags([])}
            >
              <RotateCcw size={12} strokeWidth={2} aria-hidden="true" />
              <span>Nullstill</span>
            </button>
            <span
              className={styles.activeFilterCount}
              data-test-id="attendance-filter-count"
            >
              {filteredRegistrations.length} av {registrations.length}
            </span>
          </div>
        </div>
      )}

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
            iconNode={isFiltering ? <SearchX /> : <Send />}
            header={
              isFiltering
                ? 'Ingen treff'
                : !isMeeting
                  ? 'Ingen påmeldte ...'
                  : undefined
            }
            body={
              isFiltering
                ? 'Prøv et annet søk eller fjern noen filtre.'
                : !isMeeting
                  ? 'Meld deg på da vel!'
                  : 'Ingen brukere her ...'
            }
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
