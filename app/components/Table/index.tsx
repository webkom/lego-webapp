import cx from 'classnames';
import { debounce, isEmpty, get } from 'lodash';
import { Component } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Dropdown from 'app/components/Dropdown';
import { TextInput, CheckBox, RadioButton } from 'app/components/Form';
import Icon from 'app/components/Icon';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Button from '../Button';
import styles from './Table.css';
import type { Node } from 'react';

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
  render?: (arg0: any, arg1: Record<string, any>) => Node;
  // Should column be rendered. Will render when not set
  visible?: boolean;
  center?: boolean;
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
  toggleSearch = (dataIndex: string) => {
    this.setState({
      isShown: {
        [dataIndex]: !this.state.isShown[dataIndex],
      },
    });
  };
  toggleFilter = (dataIndex: string) => {
    this.setState({
      isShown: {
        [dataIndex]: !this.state.isShown[dataIndex],
      },
    });
  };
  toggleChooseColumn = (dataIndex: string) => {
    this.setState({
      isShown: {
        [dataIndex]: !this.state.isShown[dataIndex],
      },
    });
  };
  onSearchInput = (
    { target }: React.SyntheticEvent<any>,
    dataIndex: string
  ) => {
    this.setState(
      {
        filters: { ...this.state.filters, [dataIndex]: target.value },
      },
      () => this.onChange()
    );
  };
  onFilterInput = (value: any, dataIndex: string) => {
    this.setState(
      {
        filters: { ...this.state.filters, [dataIndex]: value },
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
  checkifActive = (dataIndex: string) => {
    return (
      this.state.filters[dataIndex].length &&
      typeof this.state.filters[dataIndex].find((e) => e.value) !== 'undefined'
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
      render = (cellData, data) => cellData,
      dataIndex,
      center = false,
    } = column;
    return (
      <td
        key={`${dataIndex}-${index}-${data.id}`}
        style={
          center
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

    const { dataIndex, title, sorter, filter, search, center, filterMessage } =
      chosenProps;
    const sortIconName =
      this.state.sort.dataIndex === dataIndex
        ? this.state.sort.direction === 'asc'
          ? 'sort-asc'
          : 'sort-desc'
        : 'sort';
    const { filters, isShown } = this.state;
    return (
      <th
        key={`${dataIndex}-${index}`}
        style={
          center
            ? {
                textAlign: 'center',
              }
            : {}
        }
      >
        <div className={styles.tableHeader}>
          {sorter && (
            <div className={styles.sorter}>
              <i
                onClick={() => this.onSortInput(dataIndex, sorter)}
                className={`fa fa-${sortIconName}`}
              />
            </div>
          )}
          {title}
          {search && (
            <div className={styles.searchIcon}>
              <Dropdown
                show={isShown[dataIndex]}
                toggle={() => this.toggleSearch(dataIndex)}
                triggerComponent={
                  <Icon
                    name="search"
                    size={21}
                    className={cx(
                      (filters[dataIndex] && filters[dataIndex].length) ||
                        isShown[dataIndex]
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
                  placeholder={filterMessage}
                  value={filters[dataIndex]}
                  onChange={(e) => this.onSearchInput(e, dataIndex)}
                  onKeyDown={({ keyCode }) => {
                    if (keyCode === 13) {
                      this.toggleSearch(dataIndex);
                    }
                  }}
                />
              </Dropdown>
            </div>
          )}
          {filter && (
            <div className={styles.filterIcon}>
              <Dropdown
                show={isShown[dataIndex]}
                toggle={() => this.toggleFilter(dataIndex)}
                triggerComponent={
                  <Icon
                    name="funnel"
                    className={cx(
                      filters[dataIndex] !== undefined || isShown[dataIndex]
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
                        this.state.filters[dataIndex] === value
                          ? undefined
                          : value,
                        dataIndex
                      )
                    }
                  >
                    <p key={label}>
                      <CheckBox
                        label={label}
                        value={value === this.state.filters[dataIndex]}
                      />
                    </p>
                  </div>
                ))}
                <Button
                  flat
                  onClick={() =>
                    this.setState(
                      (state) => ({
                        filters: { ...state.filters, [dataIndex]: undefined },
                      }),
                      () => {
                        this.toggleFilter(dataIndex);
                        this.onChange();
                      }
                    )
                  }
                >
                  Nullstill
                </Button>
              </Dropdown>
            </div>
          )}
          {columnChoices && (
            <div className={styles.arrowDownIcon}>
              <Dropdown
                show={isShown[dataIndex]}
                toggle={() => this.toggleChooseColumn(dataIndex)}
                triggerComponent={
                  <Icon name="arrow-down" className={styles.icon} />
                }
                contentClassName={styles.overlay}
                rootClose
              >
                {columnChoices.map(({ title }, index) => (
                  <div
                    key={title}
                    onClick={() =>
                      this.onChooseColumnInput(index, dataIndexColumnChoices)
                    }
                  >
                    <p key={title}>
                      <RadioButton
                        name={dataIndexColumnChoices}
                        inputValue={
                          this.state.showColumn[dataIndexColumnChoices]
                        }
                        value={index}
                        label={title}
                      />
                    </p>
                  </div>
                ))}
              </Dropdown>
            </div>
          )}
        </div>
      </th>
    );
  };
  filter = (item: Record<string, any>) => {
    if (isEmpty(this.state.filters)) {
      return true;
    }

    const match = Object.keys(this.state.filters).filter((key) => {
      const { inlineFiltering = true, filterMapping = (val) => val } =
        this.props.columns.find((col) => col.dataIndex === key) || {};
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

      return filterMapping(get(item, key)).toLowerCase().includes(filter);
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
    const { columns, data, rowKey, hasMore, loading } = this.props;
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
      <div>
        <div className={styles.tableDiv}>
          <table className={styles.table}>
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
              {sortedData.filter(this.filter).map((item, index) => (
                <tr key={item[rowKey]}>
                  {columns
                    .filter(isVisible)
                    .map((column, index) =>
                      this.renderCell(column, item, index)
                    )}
                </tr>
              ))}
              <tr>
                <td className={styles.loader} colSpan={columns.length}>
                  <LoadingIndicator loading={loading} />
                </td>
              </tr>
            </InfiniteScroll>
          </table>
        </div>
      </div>
    );
  }
}
