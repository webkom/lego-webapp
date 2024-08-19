import { flexRender } from '@tanstack/react-table';
import { useWindowVirtualizer } from '@tanstack/react-virtual';
import cx from 'classnames';
import { useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { TableHeader } from 'app/components/LegoTable/TableHeader';
import styles from './LegoTable.css';
import type { Table } from '@tanstack/react-table';

interface Props<TData> {
  table: Table<TData>;
  loading?: boolean;
  hasMore?: boolean;
  onLoad?: () => void;
  rowHeightEstimate?: number;
}
export const LegoTable = <TData,>({
  table,
  loading,
  hasMore,
  onLoad,
  rowHeightEstimate = 42,
}: Props<TData>) => {
  const tableRef = useRef<HTMLTableElement>(null);

  const loadMore = () => {
    if (onLoad && !loading) {
      onLoad();
    }
  };

  const { rows } = table.getRowModel();

  const virtualizer = useWindowVirtualizer({
    count: rows.length + (loading ? 10 : 0),
    estimateSize: () => rowHeightEstimate,
    overscan: 40,
    scrollMargin: tableRef.current?.offsetTop ?? 0,
  });

  return (
    <div className={styles.wrapper}>
      <table ref={tableRef}>
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
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const row = rows[virtualRow.index];

            const loader = !row;

            return (
              <tr
                key={loader ? `loader${virtualRow.index}` : row.id}
                data-index={virtualRow.index}
                ref={virtualRow.measureElement}
                className={cx(
                  loader && styles.loader,
                  virtualRow.index % 2 === 1 && styles.even,
                )}
                style={{
                  transform: `translateY(${
                    virtualRow.start - virtualizer.options.scrollMargin
                  }px)`,
                }}
              >
                {loader
                  ? Array.from({
                      length: table
                        .getAllColumns()
                        .filter((col) => col.getIsVisible()).length,
                    }).map((_, index) => <td key={index} />)
                  : row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          textAlign: 'center',
                          width: cell.column.getSize(),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
              </tr>
            );
          })}
        </InfiniteScroll>
      </table>
    </div>
  );
};
