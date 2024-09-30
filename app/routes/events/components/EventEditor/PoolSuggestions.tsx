import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState } from 'react';
import Pill from 'app/components/Pill';
import styles from './EventEditor.module.css';
import type { SuggestionComponent } from 'app/components/Form/SelectInput';

type GroupSuggestion = {
  label: string;
  values: { label: string; value: number }[];
  children?: number[]; // Child group ids of the suggestion (these will be removed if this suggestion is selected)
};

const suggestions: GroupSuggestion[] = [
  {
    label: 'Alle studenter',
    values: [{ label: 'Students', value: 14 }],
    children: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26],
  },
  {
    label: 'Data',
    values: [{ label: 'Datateknologi', value: 15 }],
    children: [16, 17, 18, 19, 20],
  },
  {
    label: 'Cybdat',
    values: [{ label: 'Kommunikasjonsteknologi', value: 21 }],
    children: [22, 23, 24, 25, 26],
  },
  {
    label: '1. klasse',
    values: [
      { label: '1. klasse Datateknologi', value: 16 },
      { label: '1. klasse Kommunikasjonsteknologi', value: 22 },
    ],
  },
  {
    label: '2. klasse',
    values: [
      { label: '2. klasse Datateknologi', value: 17 },
      { label: '2. klasse Kommunikasjonsteknologi', value: 23 },
    ],
  },
  {
    label: '3. klasse',
    values: [
      { label: '3. klasse Datateknologi', value: 18 },
      { label: '3. klasse Kommunikasjonsteknologi', value: 24 },
    ],
  },
  {
    label: '4. klasse',
    values: [
      { label: '4. klasse Datateknologi', value: 19 },
      { label: '4. klasse Kommunikasjonsteknologi', value: 25 },
    ],
  },
  {
    label: '5. klasse',
    values: [
      { label: '5. klasse Datateknologi', value: 20 },
      { label: '5. klasse Kommunikasjonsteknologi', value: 26 },
    ],
  },
];

const PoolSuggestion: SuggestionComponent = ({
  value: selectedValues,
  onChange,
}) => {
  const [implicitGroupIds, setImplicitGroupIds] = useState<number[]>([]);
  const selectedValueArr = selectedValues.map(({ value }) => value);

  const allSelected = (values: GroupSuggestion['values']) =>
    values.every(
      ({ value }) =>
        implicitGroupIds.includes(value) || selectedValueArr.includes(value),
    );

  const implicit = (values: GroupSuggestion['values']) =>
    values.every((value) => implicitGroupIds.includes(value.value));

  /**
   * Toggle the groups belonging to the suggestion, but ignoring groups that are implicit and preventing duplicates
   */
  const toggleSuggestion = ({
    values: suggestedValues,
    children,
  }: GroupSuggestion) => {
    const suggestedValueArr = suggestedValues.map(({ value }) => value);

    if (allSelected(suggestedValues)) {
      // Remove implicit groups
      setImplicitGroupIds((prevGroups) =>
        prevGroups.filter((group) => !children?.includes(group)),
      );
      // Remove all the suggested values
      return selectedValues.filter(
        (selectedValue) => !suggestedValueArr.includes(selectedValue.value),
      );
    }

    // Add implicit groups
    children &&
      setImplicitGroupIds([...new Set([...implicitGroupIds, ...children])]);

    return [
      // Remove all selected values that are children of the toggled suggestion
      ...selectedValues.filter(
        (selectedValue) => !children?.includes(selectedValue.value),
      ),
      // Add new values that are not already implicit or selected
      ...suggestedValues.filter(
        (suggestedValue) =>
          !implicit([suggestedValue]) &&
          !selectedValueArr.includes(suggestedValue.value),
      ),
    ];
  };

  return (
    <Flex
      wrap
      gap="var(--spacing-sm)"
      className={styles.groupSuggestionWrapper}
    >
      {suggestions.map((suggestion) => (
        <Pill
          key={suggestion.label}
          className={cx(
            styles.groupSuggestion,
            allSelected(suggestion.values) ? styles.selected : undefined,
            implicit(suggestion.values) ? styles.implicit : undefined,
          )}
          onClick={() =>
            !implicit(suggestion.values) &&
            onChange?.(toggleSuggestion(suggestion))
          }
        >
          {suggestion.label}
        </Pill>
      ))}
    </Flex>
  );
};

export default PoolSuggestion;
