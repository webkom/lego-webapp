import { Button, Card } from '@webkom/lego-bricks';
import { Filter, Search } from 'lucide-react';
import { useState } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import Dropdown from 'app/components/Dropdown';
import { CheckBox, RadioButton, TextInput } from 'app/components/Form';
import styles from './LegoTable.css';
import type { Column } from '@tanstack/react-table';

interface Props<TData, TValue> {
  column: Column<TData, TValue>;
}

export const FilterButton = <TData, TValue>({
  column,
}: Props<TData, TValue>) => {
  const [open, setOpen] = useState(false);

  if (!column.getCanFilter()) return;

  const { filter } = column.columnDef.meta ?? {};
  if (!filter) return;

  const IconComponent = filter.variant === 'search' ? Search : Filter;

  return (
    <Dropdown
      show={open}
      toggle={() => setOpen(!open)}
      triggerComponent={
        <AriaButton
          className={styles.sortFilterButton}
          onPress={() => setOpen(!open)}
        >
          <IconComponent
            size={20}
            color={
              column.getIsFiltered()
                ? 'var(--lego-red-color)'
                : 'var(--color-gray-7)'
            }
          />
        </AriaButton>
      }
      contentClassName={styles.filterOverlay}
      rootClose
    >
      {filter.variant === 'search' ? (
        <SearchFilter column={column} filter={filter} setOpen={setOpen} />
      ) : filter.variant === 'select' ? (
        <SelectFilter column={column} filter={filter} setOpen={setOpen} />
      ) : (
        <Card severity="danger">Unknown filter type</Card>
      )}
    </Dropdown>
  );
};

export interface SearchFilterOptions {
  variant: 'search';
  placeholder?: string;
}

interface SearchFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  filter: SearchFilterOptions;
  setOpen: (open: boolean) => void;
}

const SearchFilter = <TData, TValue>({
  column,
  filter,
  setOpen,
}: SearchFilterProps<TData, TValue>) => {
  return (
    <TextInput
      autoFocus
      removeBorder
      placeholder={filter.placeholder}
      value={(column.getFilterValue() as string) || ''}
      onChange={(e) => column.setFilterValue(e.target.value)}
      onKeyDown={({ key }) => {
        if (key === 'Enter') {
          setOpen(false);
        }
      }}
    />
  );
};

export interface SelectFilterOptions {
  variant: 'select';
  options: {
    label: string;
    value: string;
  }[];
  multiple?: boolean;
}

interface SelectFilterProps<TData, TValue> {
  column: Column<TData, TValue>;
  filter: SelectFilterOptions;
  setOpen: (open: boolean) => void;
}

const SelectFilter = <TData, TValue>({
  column,
  filter,
  setOpen,
}: SelectFilterProps<TData, TValue>) => {
  const resetButton = (
    <Button
      flat
      onPress={() => {
        column.setFilterValue([]);
        setOpen(false);
      }}
    >
      Nullstill
    </Button>
  );

  if (filter.multiple) {
    const rawFilterValue = (column.getFilterValue() ?? []) as string | string[];
    const filterValue =
      typeof rawFilterValue === 'string' ? [rawFilterValue] : rawFilterValue;

    const toggleFilter = (value: string) => {
      if (filterValue.includes(value)) {
        column.setFilterValue(filterValue.filter((v) => v !== value));
      } else {
        column.setFilterValue([...filterValue, value]);
      }
    };

    return (
      <>
        {filter.options.map(({ label, value }) => (
          <div key={label} onClick={() => toggleFilter(value)}>
            <CheckBox label={label} checked={filterValue.includes(value)} />
          </div>
        ))}
        {resetButton}
      </>
    );
  } else {
    return (
      <>
        {filter.options.map(({ label, value }) => (
          <div key={label}>
            <RadioButton
              label={label}
              checked={column.getFilterValue() === value}
              onClick={() => column.setFilterValue(value)}
            />
          </div>
        ))}
        {resetButton}
      </>
    );
  }
};
