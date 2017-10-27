// @flow

import React, { Component, type Node } from 'react';
import Icon from 'app/components/Icon';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { TextInput } from 'app/components/Form';
import { Overlay } from 'react-overlays';
import cx from 'classnames';
import { isEmpty } from 'lodash';
import InfiniteScroll from 'react-infinite-scroller';
import styles from './Table.css';

type sortProps = {
  direction?: 'asc' | 'desc',
  sort?: string
};

type columnProps = {
  dataIndex: string,
  title: string,
  sorter?: (any, any) => number,
  search?: boolean,
  width?: number,
  render?: (any, Object) => Node
};

type Props = {
  rowKey?: string,
  columns: Array<columnProps>,
  data: Array<Object>,
  hasMore: boolean,
  loading: boolean,
  onChange?: (filters: Object, sort: sortProps) => void,
  onLoad?: (filters: Object, sort: sortProps) => void
};

type State = {
  filters: Object,
  isShown: Object,
  sort: sortProps
};

export default class Table extends Component<Props, State> {
  props: Props;

  state: State = {
    sort: {},
    filters: {},
    isShown: {}
  };

  static defaultProps = {
    rowKey: 'id'
  };

  toggleSearch = (dataIndex: string) => {
    this.setState({
      isShown: {
        [dataIndex]: !this.state.isShown[dataIndex]
      }
    });
  };

  onSearchInput = ({ target }: SyntheticInputEvent<*>, dataIndex: string) => {
    this.setState(
      { filters: { ...this.state.filters, [dataIndex]: target.value } },
      () => this.onChange()
    );
  };

  renderCell = (column: columnProps, data: Object, index: number) => {
    return (
      <td key={`${column.dataIndex}-${index}`}>
        {column.render
          ? column.render(data[column.dataIndex], data)
          : data[column.dataIndex]}
      </td>
    );
  };

  renderHeadCell = ({ dataIndex, search, title, sorter }: columnProps) => {
    const { filters, isShown } = this.state;

    return (
      <th key={dataIndex}>
        {title}
        {sorter && (
          <div className={styles.sorter}>
            <Icon name="arrow-up" />
            <Icon name="arrow-down" />
          </div>
        )}
        {search && (
          <div className={styles.searchIcon}>
            <div
              // $FlowFixMe
              ref={c => (this[dataIndex] = c)}
              className={styles.searchIcon}
            >
              <Icon
                onClick={() => this.toggleSearch(dataIndex)}
                name="search"
                className={cx(
                  styles.icon,
                  ((filters[dataIndex] && filters[dataIndex].length) ||
                    isShown[dataIndex]) &&
                    styles.iconActive
                )}
              />
            </div>
            <Overlay
              show={isShown[dataIndex]}
              onHide={() => this.toggleSearch(dataIndex)}
              placement="bottom"
              // $FlowFixMe
              container={this[dataIndex]}
              // $FlowFixMe
              target={() => this[dataIndex]}
              rootClose
            >
              <div className={styles.overlay}>
                <TextInput
                  autoFocus
                  placeholder="Filtrer"
                  value={filters[dataIndex]}
                  onChange={e => this.onSearchInput(e, dataIndex)}
                  onKeyDown={({ keyCode }) => {
                    if (keyCode === 13) {
                      this.toggleSearch(dataIndex);
                    }
                  }}
                />
              </div>
            </Overlay>
          </div>
        )}
      </th>
    );
  };

  filter = (item: Object) => {
    if (isEmpty(this.state.filters)) {
      return true;
    }

    const match = Object.keys(this.state.filters).filter(key => {
      const filter = this.state.filters[key].toLowerCase();

      if (!filter.length) {
        return true;
      }

      return item[key].toLowerCase().includes(filter);
    }).length;

    return match > 0;
  };

  loadMore = () => {
    if (this.props.onLoad && this.props.loading) {
      this.props.onLoad(this.state.filters, this.state.sort);
    }
  };

  onChange = () => {
    if (this.props.onChange) {
      this.props.onChange(this.state.filters, this.state.sort);
    }
  };

  render() {
    const { columns, data, rowKey, hasMore, loading } = this.props;

    return (
      <table className={styles.table}>
        <thead>
          <tr>{columns.map(column => this.renderHeadCell(column))}</tr>
        </thead>
        <InfiniteScroll
          element="tbody"
          hasMore={hasMore}
          loadMore={this.loadMore}
          threshold={50}
          loader={
            <tr>
              <td className={styles.loader} colSpan={columns.length}>
                <LoadingIndicator loading={loading} />
              </td>
            </tr>
          }
        >
          {data
            .filter(this.filter)
            .map((item, index) => (
              <tr key={item[rowKey]}>
                {columns.map(column => this.renderCell(column, item, index))}
              </tr>
            ))}
        </InfiniteScroll>
      </table>
    );
  }
}
