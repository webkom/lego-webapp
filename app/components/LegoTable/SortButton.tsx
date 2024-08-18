import { ChevronDown, ChevronsUpDown, ChevronUp, Filter } from 'lucide-react';
import { Button } from 'react-aria-components';
import styles from './LegoTable.css';
import type { Column } from '@tanstack/react-table';

interface Props<TData, TValue> {
  column: Column<TData, TValue>;
}

export const SortButton = <TData, TValue>({ column }: Props<TData, TValue>) => {
  if (!column.getCanSort()) return;

  const sortDirection = column.getIsSorted();

  return (
    <Button
      onPress={column.getToggleSortingHandler()}
      className={styles.sortFilterButton}
    >
      {
        {
          asc: <ChevronUp size={20} color="var(--color-gray-7)" />,
          desc: <ChevronDown size={20} color="var(--color-gray-7)" />,
          none: <ChevronsUpDown size={20} color="var(--color-gray-7)" />,
        }[sortDirection || 'none']
      }
    </Button>
  );
};
