import { Button, Flex, Icon } from '@webkom/lego-bricks';
import cx from 'classnames';
import { debounce, isEmpty, get, isEqual } from 'lodash-es';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useMemo, useState, useRef } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import BodyCell from './BodyCell';
import HeadCell from './HeadCell';
import styles from './Table.module.css';
import type { EntityId } from '@reduxjs/toolkit';
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

type CheckFilter = {
  label: string;
  value: any;
};

export type ColumnProps<T = unknown> = {
  dataIndex: string;
  filterIndex?: string;
  title?: string | ReactNode;
  sorter?: boolean | ((arg0: T, arg1: T) => number);
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
  inlineFiltering?: boolean;
  filterMessage?: string;
  render?: (data: any, object: T) => ReactNode;
  columnChoices?: ColumnProps<T>[];
  visible?: boolean;
  centered?: boolean;
  padding?: number /** Affects only body columns */;
  maxWidth?: number;
};

type TableProps<T extends { id: EntityId }> = {
  rowKey?: string;
  columns: ColumnProps<T>[];
  data: T[];
  collapseAfter?: number;
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
      (queryFilters[key] = filter?.length
        ? filter?.filter((filter) => filter !== '').join(',')
        : undefined),
  );
  return queryFilters;
};

const queryFiltersToFilters: (queryFilters?: QueryFilters) => Filters = (
  queryFilters,
) => {
  if (!queryFilters) return {};
  const filters: Filters = {};
  Object.entries(queryFilters).forEach(
    ([key, queryFilter]) => (filters[key] = queryFilter?.split(',')),
  );
  return filters;
};

const Table = <T extends { id: EntityId }>({
  columns,
  data,
  rowKey = 'id',
  hasMore,
  loading,
  className,
  onChange,
  onLoad,
  collapseAfter,
  ...props
}: TableProps<T>) => {
  const [sort, setSort] = useState<Sort>({});
  const [filters, setFilters] = useState<Filters>(
    queryFiltersToFilters(props.filters),
  );
  const prevPropsFilters = useRef(props.filters);

  useEffect(() => {
    if (!isEqual(props.filters, prevPropsFilters.current)) {
      prevPropsFilters.current = props.filters;
      setFilters(queryFiltersToFilters(props.filters));
    }
  }, [props.filters]);

  useEffect(() => {
    debounce(() => {
      if (onChange) {
        const queryFilters = filtersToQueryFilters(filters);
        prevPropsFilters.current = queryFilters;
        onChange(queryFilters, sort);
      }
    }, 170)();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort]);

  const [isShown, setIsShown] = useState<IsShown>({});
  const [showColumn, setShowColumn] = useState<ShowColumn>({});
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const initialShowColumn = {};
    columns.forEach((column) => {
      if (column.columnChoices) {
        initialShowColumn[column.dataIndex] = 0;
      }
    });
    setShowColumn(initialShowColumn);
  }, [columns]);

  const sortedData = useMemo<typeof data>(() => {
    let sorter = sort.sorter;
    const { direction, dataIndex } = sort;
    if (dataIndex && typeof sorter == 'boolean')
      sorter = (a, b) => {
        if (a[dataIndex] > b[dataIndex]) return 1;
        return -1;
      };
    const sortedData = [...data].sort((a, b) =>
      sorter !== undefined && typeof sorter !== 'boolean' ? sorter(a, b) : 0,
    );
    if (direction === 'desc') sortedData.reverse();
    return sortedData;
  }, [sort, data]);

  const filter: (item: T) => boolean = (item) => {
    if (Object.values(filters).every(isEmpty)) {
      return true;
    }

    return Object.keys(filters).every((key) => {
      const {
        inlineFiltering = true,
        filterMapping = (val) => val,
        dataIndex,
        filterIndex,
      } = columns.find(
        (column) => column.filterIndex === key || column.dataIndex === key,
      ) || { inlineFiltering: false };

      if (!inlineFiltering) return true;

      if (filters[key] === undefined) {
        return true;
      }

      const index = filterIndex || dataIndex || key;

      if (typeof filters[key] === 'boolean') {
        return filters[key] === get(item, index);
      }

      return filters[key]?.some((arrayFilter) =>
        String(filterMapping(get(item, index) ?? ''))
          .toLowerCase()
          .includes(arrayFilter.toLowerCase()),
      );
    });
  };

  const loadMore = () => {
    if (onLoad && !loading) {
      onLoad(filtersToQueryFilters(filters), sort);
    }
  };

  const visibleColumns = columns.filter(isVisible);

  const filteredAndSortedData = sortedData.filter(filter);
  const displayData =
    collapseAfter && !isExpanded
      ? filteredAndSortedData.slice(0, collapseAfter)
      : filteredAndSortedData;

  return (
    <Flex
      column
      alignItems="center"
      gap="var(--spacing-md)"
      className={cx(styles.wrapper, className)}
    >
      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              {visibleColumns.map((column, index) => (
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
            hasMore={hasMore && !loading && (!collapseAfter || isExpanded)}
            loadMore={loadMore}
            threshold={50}
          >
            {displayData.map((data) => (
              <tr key={data[rowKey]}>
                {visibleColumns.map((column, index) => (
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
            {loading &&
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: visibleColumns.length }).map(
                    (_, index) => (
                      <td key={index} className={styles.loader} />
                    ),
                  )}
                </tr>
              ))}
          </InfiniteScroll>
        </table>
        {collapseAfter &&
          filteredAndSortedData.length > collapseAfter &&
          !isExpanded && <div className={styles.fadeOverlay} />}
      </div>
      {collapseAfter && filteredAndSortedData.length > collapseAfter && (
        <Button flat onPress={() => setIsExpanded((prev) => !prev)}>
          <Icon
            iconNode={isExpanded ? <ChevronUp /> : <ChevronDown />}
            size={19}
          />
          {isExpanded
            ? 'Vis mindre'
            : `Vis alle ${filteredAndSortedData.length} rader`}
        </Button>
      )}
    </Flex>
  );
};

export default Table;
