import { LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { debounce, isEmpty, get } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BodyCell from './BodyCell';
import HeadCell from './HeadCell';
import styles from './Table.css';
import type { ID } from 'app/store/models';
import type { ReactNode } from 'react';

export type Sort = {
  direction?: 'asc' | 'desc';
  dataIndex?: string;
  sorter?: boolean | ((arg0: any, arg1: any) => number);
};
export type Filters = Record<string, string[] | undefined>;
type QueryFilters = Record<string, string | undefined>;
export type IsShown = Record<string, boolean>;
export type ShowColumn = Record<string, number>;

export type TableData = object & { id: ID };

type CheckFilter = {
  label: string;
  value: any;
};

export type ColumnProps = {
  dataIndex: string;
  filterIndex?: string;
  title?: string;
  sorter?: boolean | ((arg0: any, arg1: any) => number);
  filter?: Array<CheckFilter>;
  filterOptions?: {
    multiSelect?: boolean;
  };

  /*
   * Map the value to to "another" value to use
   * for filtering. Eg. the result from the backend
   * is in english, and the search should be in norwegian
   *
   */
  filterMapping?: (arg0: any) => any;
  search?: boolean;
  width?: number;
  render?: (arg0: any, arg1: Record<string, any>) => ReactNode;
  // Should column be rendered. Will render when not set
  visible?: boolean;
  centered?: boolean;
  inlineFiltering?: boolean;
  filterMessage?: string;
  columnChoices?: ColumnProps[];
};

type TableProps = {
  rowKey?: string;
  columns: ColumnProps[];
  data: TableData[];
  hasMore: boolean;
  loading: boolean;
  onChange?: (queryFilters: QueryFilters, querySort: Sort) => void;
  onLoad?: (queryFilters: QueryFilters, querySort: Sort) => void;
  filters?: QueryFilters;
  className?: string;
};

const isVisible = ({ visible = true }: ColumnProps) => visible;

const filtersToQueryFilters: (filters: Filters) => QueryFilters = (filters) => {
  const queryFilters: QueryFilters = {};
  Object.entries(filters).forEach(
    ([key, filter]) =>
      (queryFilters[key] = filter?.length ? filter?.join(',') : undefined)
  );
  return queryFilters;
};

const queryFiltersToFilters: (queryFilters?: QueryFilters) => Filters = (
  queryFilters
) => {
  if (!queryFilters) return {};
  const filters: Filters = {};
  Object.entries(queryFilters).forEach(
    ([key, queryFilter]) => (filters[key] = queryFilter?.split(','))
  );
  return filters;
};

const Table: React.FC<TableProps> = ({
  columns,
  data,
  rowKey = 'id',
  hasMore,
  loading,
  className,
  onChange,
  onLoad,
  ...props
}) => {
  const [sort, setSort] = useState<Sort>({});
  const [filters, setFilters] = useState<Filters>(
    queryFiltersToFilters(props.filters)
  );
  const [isShown, setIsShown] = useState<IsShown>({});
  const [showColumn, setShowColumn] = useState<ShowColumn>({});

  useEffect(() => {
    const initialShowColumn = {};
    columns.forEach((column) => {
      if (column.columnChoices) {
        initialShowColumn[column.dataIndex] = 0;
      }
    });
    setShowColumn(initialShowColumn);
  }, [columns]);

  useEffect(() => {
    debounce(() => {
      if (onChange) {
        onChange(filtersToQueryFilters(filters), sort);
      }
    }, 170)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  const sortedData = useMemo<typeof data>(() => {
    let sorter = sort.sorter;
    const { direction, dataIndex } = sort;
    if (dataIndex && typeof sorter == 'boolean')
      sorter = (a, b) => {
        if (a[dataIndex] > b[dataIndex]) return 1;
        return -1;
      };
    const sortedData = [...data].sort((a, b) =>
      sorter !== undefined && typeof sorter !== 'boolean' ? sorter(a, b) : 0
    );
    if (direction === 'desc') sortedData.reverse();
    return sortedData;
  }, [sort, data]);

  const filter: (item: TableData) => boolean = (item) => {
    if (isEmpty(filters)) {
      return true;
    }

    const match = Object.keys(filters).filter((key) => {
      const {
        inlineFiltering = true,
        filterMapping = (val) => val,
        dataIndex = key,
      } = columns.find(
        (column) => column.filterIndex ?? column.dataIndex === key
      ) || {};
      if (!inlineFiltering) return true;

      if (filters[key] === undefined) {
        return true;
      }

      if (typeof filters[key] === 'boolean') {
        return filters[key] === get(item, key);
      }

      return filters[key]?.some((arrayFilter) =>
        filterMapping(get(item, dataIndex)).toLowerCase().includes(arrayFilter)
      );
    }).length;
    return match > 0;
  };

  const loadMore = () => {
    if (onLoad && !loading) {
      onLoad(filtersToQueryFilters(filters), sort);
    }
  };

  return (
    <div className={cx(styles.wrapper, className)}>
      <table>
        <thead>
          <tr>
            {columns.filter(isVisible).map((column, index) => (
              <HeadCell
                key={column.dataIndex + column.title}
                column={column}
                index={index}
                sort={sort}
                filters={filters}
                isShown={isShown}
                showColumn={showColumn}
                setSort={setSort}
                setFilters={setFilters}
                setIsShown={setIsShown}
                setShowColumn={setShowColumn}
              />
            ))}
          </tr>
        </thead>
        <InfiniteScroll
          element="tbody"
          hasMore={hasMore && !loading}
          loadMore={loadMore}
          threshold={50}
        >
          {sortedData.filter(filter).map((data) => (
            <tr key={data[rowKey]}>
              {columns.filter(isVisible).map((column, index) => (
                <BodyCell
                  key={column.title + column.dataIndex}
                  column={column}
                  data={data}
                  index={index}
                  showColumn={showColumn}
                />
              ))}
            </tr>
          ))}
          {loading && (
            <tr>
              <td className={styles.loader} colSpan={columns.length}>
                <LoadingIndicator loading={loading} />
              </td>
            </tr>
          )}
        </InfiniteScroll>
      </table>
    </div>
  );
};

export default Table;
