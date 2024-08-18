import { flexRender } from '@tanstack/react-table';
import { FilterButton } from 'app/components/LegoTable/FilterButton';
import { SortButton } from 'app/components/LegoTable/SortButton';
import styles from './LegoTable.css';
import type { Header as HeaderType } from '@tanstack/react-table';

interface Props<TData, TValue> {
  header: HeaderType<TData, TValue>;
}

export const TableHeader = <TData, TValue>({
  header,
}: Props<TData, TValue>) => {
  return (
    <th>
      <div className={styles.header}>
        {header.isPlaceholder
          ? null
          : flexRender(header.column.columnDef.header, header.getContext())}
        <FilterButton column={header.column} />
        <SortButton column={header.column} />
      </div>
    </th>
  );
};
