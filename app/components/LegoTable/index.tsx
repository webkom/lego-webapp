import { flexRender } from '@tanstack/react-table';
import InfiniteScroll from 'react-infinite-scroller';
import { TableHeader } from 'app/components/LegoTable/TableHeader';
import styles from './LegoTable.css';
import type { Table } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
  loading?: boolean;
  hasMore?: boolean;
  onLoad?: () => void;
}
export const LegoTable = <TData,>({
  table,
  loading,
  hasMore,
  onLoad,
}: Props<TData>) => {
  const loadMore = () => {
    if (onLoad && !loading) {
      onLoad();
    }
  };

  return (
    <div className={styles.wrapper}>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHeader key={header.id} header={header} />
              ))}
            </tr>
          ))}
        </thead>
        <InfiniteScroll
          element="tbody"
          hasMore={hasMore && !loading}
          loadMore={loadMore}
          threshold={50}
        >
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ textAlign: 'center' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
          {loading &&
            Array.from({ length: 10 }).map((_, index) => (
              <tr key={index}>
                {Array.from({ length: table.getAllColumns().length }).map(
                  (_, index) => (
                    <td key={index} className={styles.loader} />
                  ),
                )}
              </tr>
            ))}
        </InfiniteScroll>
      </table>
    </div>
  );
};
