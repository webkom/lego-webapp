import cx from 'classnames';
import { Check, ListFilter } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { GroupType } from 'app/models';
import { getGroupKeywordTypeLabel } from '~/components/Search/searchGroupTags';
import { useIsMobileViewport } from '~/utils/isMobileViewport';
import styles from './AttendanceModalContent.module.css';
import type { KeyboardEvent } from 'react';
import type { SearchGroupKeyword } from '~/components/Search/searchGroupTags';

type Props = {
  groups: SearchGroupKeyword[];
  selectedGroups: SearchGroupKeyword[];
  onToggleGroup: (group: SearchGroupKeyword) => void;
};

const FilterOption = ({
  group,
  isSelected,
  showType,
  onToggleGroup,
}: {
  group: SearchGroupKeyword;
  isSelected: boolean;
  showType?: boolean;
  onToggleGroup: (group: SearchGroupKeyword) => void;
}) => (
  <Button
    className={cx(
      styles.filterPickerOption,
      isSelected && styles.filterPickerOptionSelected,
    )}
    aria-pressed={isSelected}
    onPress={() => onToggleGroup(group)}
  >
    <span>{group.name}</span>
    <span className={styles.filterPickerOptionMeta}>
      {showType && (
        <span
          className={styles.groupSuggestionType}
          data-group-type={group.type}
        >
          {getGroupKeywordTypeLabel(group.type)}
        </span>
      )}
      <Check
        size={16}
        strokeWidth={2}
        aria-hidden="true"
        className={cx(
          styles.filterPickerOptionCheck,
          isSelected && styles.filterPickerOptionCheckVisible,
        )}
      />
    </span>
  </Button>
);

const FilterSections = ({
  groups,
  selectedGroupIds,
  onToggleGroup,
}: {
  groups: SearchGroupKeyword[];
  selectedGroupIds: Set<string>;
  onToggleGroup: (group: SearchGroupKeyword) => void;
}) => {
  const gradeGroups = groups.filter((group) => group.type === GroupType.Grade);
  const studyProgramGroups = groups.filter(
    (group) => group.type === 'studieretning',
  );
  const membershipGroups = groups.filter(
    (group) => group.type !== GroupType.Grade && group.type !== 'studieretning',
  );

  return (
    <>
      {gradeGroups.length > 0 && (
        <section className={styles.filterPickerSection}>
          <h3 className={styles.filterPickerSectionTitle}>Kull</h3>
          <div
            className={styles.filterPickerOptions}
            role="group"
            aria-label="Filtrer på kull"
          >
            {gradeGroups.map((group) => (
              <FilterOption
                key={group.id}
                group={group}
                isSelected={selectedGroupIds.has(String(group.id))}
                onToggleGroup={onToggleGroup}
              />
            ))}
          </div>
        </section>
      )}

      {studyProgramGroups.length > 0 && (
        <section className={styles.filterPickerSection}>
          <h3 className={styles.filterPickerSectionTitle}>Studieretning</h3>
          <div
            className={styles.filterPickerOptions}
            role="group"
            aria-label="Filtrer på studieretning"
          >
            {studyProgramGroups.map((group) => (
              <FilterOption
                key={group.id}
                group={group}
                isSelected={selectedGroupIds.has(String(group.id))}
                onToggleGroup={onToggleGroup}
              />
            ))}
          </div>
        </section>
      )}

      {membershipGroups.length > 0 && (
        <section className={styles.filterPickerSection}>
          <h3 className={styles.filterPickerSectionTitle}>Grupper</h3>
          <div
            className={styles.filterPickerOptions}
            role="group"
            aria-label="Filtrer på grupper"
          >
            {membershipGroups.map((group) => (
              <FilterOption
                key={group.id}
                group={group}
                isSelected={selectedGroupIds.has(String(group.id))}
                showType
                onToggleGroup={onToggleGroup}
              />
            ))}
          </div>
        </section>
      )}
    </>
  );
};

const PickerTriggerContent = ({
  activeFilterCount,
}: {
  activeFilterCount: number;
}) => (
  <>
    <ListFilter size={18} strokeWidth={1.75} aria-hidden="true" />
    {activeFilterCount > 0 && (
      <span
        className={styles.filterPickerCount}
        data-test-id="attendance-filter-badge"
        aria-hidden="true"
      >
        {activeFilterCount}
      </span>
    )}
  </>
);

export const AttendanceFilterPicker = ({
  groups,
  selectedGroups,
  onToggleGroup,
}: Props) => {
  const isMobile = useIsMobileViewport();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const panelTriggerRef = useRef<HTMLButtonElement>(null);
  const selectedGroupIds = new Set(
    selectedGroups.map((group) => String(group.id)),
  );
  const activeFilterCount = selectedGroups.length;
  const triggerLabel =
    activeFilterCount === 0
      ? 'Filtrer deltakere'
      : `Filtrer deltakere, ${activeFilterCount} ${
          activeFilterCount === 1 ? 'aktivt filter' : 'aktive filtre'
        }`;

  if (groups.length === 0) return null;

  if (isMobile) {
    const closePanel = () => {
      setIsPanelOpen(false);
      panelTriggerRef.current?.focus();
    };

    const handlePanelKeyDown = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key !== 'Escape') return;
      event.stopPropagation();
      closePanel();
    };

    return (
      <>
        <button
          ref={panelTriggerRef}
          type="button"
          className={styles.filterPickerTrigger}
          aria-label={triggerLabel}
          aria-expanded={isPanelOpen}
          aria-controls="attendance-filter-panel"
          data-test-id="attendance-filter-trigger"
          data-active-count={activeFilterCount}
          onClick={() => setIsPanelOpen((open) => !open)}
        >
          <PickerTriggerContent activeFilterCount={activeFilterCount} />
        </button>

        {isPanelOpen && (
          <div
            id="attendance-filter-panel"
            className={styles.filterPickerPanel}
            data-test-id="attendance-filter-panel"
            role="group"
            aria-label="Filtrer deltakere"
            onKeyDown={handlePanelKeyDown}
          >
            <FilterSections
              groups={groups}
              selectedGroupIds={selectedGroupIds}
              onToggleGroup={onToggleGroup}
            />
          </div>
        )}
      </>
    );
  }

  return (
    <DialogTrigger>
      <Button
        className={styles.filterPickerTrigger}
        aria-label={triggerLabel}
        data-test-id="attendance-filter-trigger"
        data-active-count={activeFilterCount}
      >
        <PickerTriggerContent activeFilterCount={activeFilterCount} />
      </Button>

      <Popover
        placement="bottom end"
        offset={6}
        maxHeight={360}
        className={styles.filterPickerPopover}
        data-test-id="attendance-filter-popover"
      >
        <Dialog
          aria-label="Filtrer deltakere"
          className={styles.filterPickerDialog}
        >
          <FilterSections
            groups={groups}
            selectedGroupIds={selectedGroupIds}
            onToggleGroup={onToggleGroup}
          />
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
