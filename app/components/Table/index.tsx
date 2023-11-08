import { Button, Flex, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import cx from 'classnames';
import { debounce, isEmpty, get } from 'lodash';
import { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Dropdown from 'app/components/Dropdown';
import { TextInput, CheckBox, RadioButton } from 'app/components/Form';
import styles from './Table.css';
import type { ReactNode, ChangeEvent } from 'react';

type sortProps = {
  direction?: 'asc' | 'desc';
  dataIndex?: string;
  sorter?: boolean | ((arg0: any, arg1: any) => number);
};

type checkFilter = {
  label: string;
  value: any;
};

type columnProps = {
  dataIndex: string;
  filterIndex?: string;
  title?: string;
  sorter?: boolean | ((arg0: any, arg1: any) => number);
  filter?: Array<checkFilter>;

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
  columnChoices?: Array<columnProps>;
};

type Props = {
  rowKey?: string;
  columns: Array<columnProps>;
  data: Array<Record<string, any>>;
  hasMore: boolean;
  loading: boolean;
  onChange?: (filters: Record<string, any>, sort: sortProps) => void;
  onLoad?: (filters: Record<string, any>, sort: sortProps) => void;
  filters?: Record<string, any>;
  className?: string;
};

type State = {
  filters: Record<string, any>;
  isShown: Record<string, any>;
  sort: sortProps;
  showColumn: Record<string, any>;
};

const isVisible = ({ visible = true }: columnProps) => visible;

export default class Table extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const initialShowColumn = {};
    props.columns.forEach((column) => {
      if (column.columnChoices) {
        initialShowColumn[column.dataIndex] = 0;
      }
    });
    this.state = {
      sort: {},
      filters: props.filters || {},
      isShown: {},
      showColumn: initialShowColumn,
    };
  }

  static defaultProps = {
    rowKey: 'id',
  };
  toggleSearch = (filterIndex: string) => {
    this.setState({
      isShown: {
        [filterIndex]: !this.state.isShown[filterIndex],
      },
    });
  };
  toggleFilter = (filterIndex: string) => {
    this.setState({
      isShown: {
        [filterIndex]: !this.state.isShown[filterIndex],
      },
    });
  };
  toggleChooseColumn = (filterIndex: string) => {
    this.setState({
      isShown: {
        [filterIndex]: !this.state.isShown[filterIndex],
      },
    });
  };
  onSearchInput = (
    { target }: ChangeEvent<HTMLInputElement>,
    filterIndex: string
  ) => {
    this.setState(
      {
        filters: { ...this.state.filters, [filterIndex]: target.value },
      },
      () => this.onChange()
    );
  };
  onFilterInput = (value: any, filterIndex: string) => {
    this.setState(
      {
        filters: { ...this.state.filters, [filterIndex]: value },
      },
      () => this.onChange()
    );
  };
  onChooseColumnInput = (columnIndex: any, dataIndex: any) => {
    this.setState(
      {
        showColumn: {
          [dataIndex]: columnIndex,
        },
      },
      () => this.onChange()
    );
  };
  onSortInput = (dataIndex: any, sorter: any) => {
    const direction =
      this.state.sort.dataIndex === dataIndex &&
      this.state.sort.direction === 'asc'
        ? 'desc'
        : 'asc';
    this.setState(
      {
        sort: {
          direction,
          dataIndex,
          sorter,
        },
      },
      () => this.onChange()
    );
  };
  renderCell = (
    column: columnProps,
    data: Record<string, any>,
    index: number
  ) => {
    if (column.columnChoices) {
      const columnIndex: number = this.state.showColumn[column.dataIndex];
      column = column.columnChoices[columnIndex];
    }

    const cellData = get(data, column.dataIndex);
    const {
      render = (cellData) => cellData,
      dataIndex,
      centered = true,
    } = column;
    return (
      <td
        key={`${dataIndex}-${index}-${data.id}`}
        style={
          centered
            ? {
                textAlign: 'center',
              }
            : {}
        }
      >
        {render(cellData, data)}
      </td>
    );
  };
  renderHeadCell = (props: columnProps, index: number) => {
    let chosenProps = props;
    const columnChoices = props.columnChoices;
    const dataIndexColumnChoices = props.dataIndex;

    if (props.columnChoices) {
      const columnIndex = this.state.showColumn[dataIndexColumnChoices];
      chosenProps = { ...props, ...props.columnChoices[columnIndex] };
    }

    const {
      dataIndex,
      filterIndex = dataIndex,
      title,
      sorter,
      filter,
      search,
      filterMessage,
    } = chosenProps;
    const sortIconName =
      this.state.sort.dataIndex === dataIndex
        ? this.state.sort.direction === 'asc'
          ? 'sort-asc'
          : 'sort-desc'
        : 'sort';
    const { filters, isShown } = this.state;

    return (
      <th key={`${dataIndex}-${index}`}>
        <Flex alignItems="center" justifyContent="center" gap={4.5}>
          {sorter && (
            <i
              onClick={() => this.onSortInput(dataIndex, sorter)}
              className={`fa fa-${sortIconName}`}
            />
          )}
          {title}
          {search && (
            <Dropdown
              show={isShown[filterIndex]}
              toggle={() => this.toggleSearch(filterIndex)}
              triggerComponent={
                <Icon
                  name="search"
                  size={16}
                  className={cx(
                    (filters[filterIndex] && filters[filterIndex].length) ||
                      isShown[filterIndex]
                      ? styles.iconActive
                      : styles.icon
                  )}
                />
              }
              contentClassName={styles.overlay}
              rootClose
            >
              <TextInput
                autoFocus
                removeBorder
                placeholder={filterMessage}
                value={filters[filterIndex]}
                onChange={(e) => this.onSearchInput(e, filterIndex)}
                onKeyDown={({ keyCode }) => {
                  if (keyCode === 13) {
                    this.toggleSearch(filterIndex);
                  }
                }}
              />
            </Dropdown>
          )}
          {filter && (
            <Dropdown
              show={isShown[filterIndex]}
              toggle={() => this.toggleFilter(filterIndex)}
              triggerComponent={
                <Icon
                  name="funnel"
                  size={16}
                  className={cx(
                    filters[filterIndex] !== undefined || isShown[filterIndex]
                      ? styles.iconActive
                      : styles.icon
                  )}
                />
              }
              contentClassName={styles.checkbox}
              rootClose
            >
              {filter.map(({ label, value }) => (
                <div
                  key={label}
                  onClick={() =>
                    this.onFilterInput(
                      this.state.filters[filterIndex] === value
                        ? undefined
                        : value,
                      filterIndex
                    )
                  }
                >
                  <CheckBox
                    label={label}
                    value={value === this.state.filters[filterIndex]}
                  />
                </div>
              ))}
              <Button
                flat
                onClick={() =>
                  this.setState(
                    (state) => ({
                      filters: { ...state.filters, [filterIndex]: undefined },
                    }),
                    () => {
                      this.toggleFilter(filterIndex);
                      this.onChange();
                    }
                  )
                }
              >
                Nullstill
              </Button>
            </Dropdown>
          )}
          {columnChoices && (
            <Dropdown
              show={isShown[filterIndex]}
              toggle={() => this.toggleChooseColumn(filterIndex)}
              triggerComponent={
                <Icon
                  name="options"
                  size={16}
                  className={cx(
                    filters[filterIndex] !== undefined || isShown[filterIndex]
                      ? styles.iconActive
                      : styles.icon
                  )}
                />
              }
              contentClassName={styles.overlay}
              rootClose
            >
              {columnChoices.map(({ title }, index) => (
                <div
                  key={title}
                  onClick={() => {
                    this.onChooseColumnInput(index, dataIndexColumnChoices);
                  }}
                >
                  <RadioButton
                    id={dataIndexColumnChoices}
                    name={dataIndexColumnChoices}
                    inputValue={this.state.showColumn[dataIndexColumnChoices]}
                    value={index}
                    label={title}
                  />
                </div>
              ))}
            </Dropdown>
          )}
        </Flex>
      </th>
    );
  };
  filter = (item: Record<string, any>) => {
    if (isEmpty(this.state.filters)) {
      return true;
    }

    const match = Object.keys(this.state.filters).filter((key) => {
      const {
        inlineFiltering = true,
        filterMapping = (val) => val,
        dataIndex = key,
      } = this.props.columns.find(
        (col) => col.filterIndex ?? col.dataIndex === key
      ) || {};
      if (!inlineFiltering) return true;

      if (this.state.filters[key] === undefined) {
        return true;
      }

      if (typeof this.state.filters[key] === 'boolean') {
        return this.state.filters[key] === get(item, key);
      }

      const filter = this.state.filters[key].toLowerCase();

      if (!filter.length) {
        return true;
      }

      return filterMapping(get(item, dataIndex)).toLowerCase().includes(filter);
    }).length;
    return match > 0;
  };
  loadMore = () => {
    if (this.props.onLoad && !this.props.loading) {
      this.props.onLoad(this.state.filters, this.state.sort);
    }
  };
  onChange = debounce(() => {
    if (this.props.onChange) {
      this.props.onChange(this.state.filters, this.state.sort);
    }
  }, 170);

  render() {
    const { columns, data, rowKey, hasMore, loading, className } = this.props;
    let sorter = this.state.sort.sorter;
    const { direction, dataIndex } = this.state.sort;
    if (typeof sorter == 'boolean')
      sorter = (a, b) => {
        if (a[dataIndex] > b[dataIndex]) return 1;
        return -1;
      };
    const sortedData = [...data].sort((a, b) =>
      sorter !== undefined && typeof sorter !== 'boolean' ? sorter(a, b) : 0
    );
    if (direction === 'desc') sortedData.reverse();

    return (
      <div className={cx(styles.wrapper, className)}>
        <table>
          <thead>
            <tr>
              {columns
                .filter(isVisible)
                .map((column, index) => this.renderHeadCell(column, index))}
            </tr>
          </thead>
          <InfiniteScroll
            element="tbody"
            hasMore={hasMore && !loading}
            loadMore={this.loadMore}
            threshold={50}
          >
            {sortedData.filter(this.filter).map((item) => (
              <tr key={item[rowKey]}>
                {columns
                  .filter(isVisible)
                  .map((column, index) => this.renderCell(column, item, index))}
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
  }
}
