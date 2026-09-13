import cx from 'classnames';
import { Check, ListFilter } from 'lucide-react';
import { Button, Dialog, DialogTrigger, Popover } from 'react-aria-components';
import { GroupType } from 'app/models';
import { getGroupKeywordTypeLabel } from '~/components/Search/searchGroupTags';
import styles from './AttendanceModalContent.module.css';
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

export const AttendanceFilterPicker = ({
  groups,
  selectedGroups,
  onToggleGroup,
}: Props) => {
  const gradeGroups = groups.filter((group) => group.type === GroupType.Grade);
  const membershipGroups = groups.filter(
    (group) => group.type !== GroupType.Grade,
  );
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

  return (
    <DialogTrigger>
      <Button
        className={styles.filterPickerTrigger}
        aria-label={triggerLabel}
        data-test-id="attendance-filter-trigger"
        data-active-count={activeFilterCount}
      >
        <ListFilter size={18} strokeWidth={1.75} aria-hidden="true" />
        {activeFilterCount > 0 && (
          <span className={styles.filterPickerCount} aria-hidden="true">
            {activeFilterCount}
          </span>
        )}
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
        </Dialog>
      </Popover>
    </DialogTrigger>
  );
};
