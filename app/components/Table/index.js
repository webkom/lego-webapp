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
  onChange?: (filters: Object, sort: Object) => void,
  onLoad?: (filters: Object, sort: Object) => void
};

type State = {
  filters: Object,
  sort: {
    direction?: 'asc' | 'desc',
    sort?: string
  }
};

export default class Table extends Component<Props, State> {
  props: Props;

  state: State = {
    sort: {},
    filters: {}
  };

  static defaultProps = {
    rowKey: 'id'
  };

  toggleSearch = (column: Object) => {
    this.setState({
      [`show${column.dataIndex}Search`]: !this.state[
        `show${column.dataIndex}Search`
      ]
    });
  };

  onSearchInput = ({ target }: SyntheticInputEvent<*>, column: columnProps) => {
    this.setState(
      { filters: { ...this.state.filters, [column.dataIndex]: target.value } },
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

  renderHeadCell = (column: columnProps) => {
    const searchActive =
      (this.state.filters[column.dataIndex] &&
        this.state.filters[column.dataIndex].length) ||
      this.state[`show${column.dataIndex}Search`];
    return (
      <th key={column.dataIndex}>
        {column.title}
        {column.sorter && (
          <div className={styles.sorter}>
            <Icon name="arrow-up" />
            <Icon name="arrow-down" />
          </div>
        )}
        {column.search && (
          <div className={styles.searchIcon}>
            <div
              ref={c => {
                // $FlowFixMe
                this[`${column.dataIndex}Search`] = c;
              }}
              className={styles.searchIcon}
            >
              <Icon
                onClick={() => this.toggleSearch(column)}
                name="search"
                className={cx(styles.icon, searchActive && styles.iconActive)}
              />
            </div>
            <Overlay
              show={this.state[`show${column.dataIndex}Search`]}
              onHide={() => this.toggleSearch(column)}
              placement="bottom"
              // $FlowFixMe
              container={this[`${column.dataIndex}Search`]}
              // $FlowFixMe
              target={() => this[`${column.dataIndex}Search`]}
              rootClose
            >
              <div className={styles.overlay}>
                <TextInput
                  autoFocus
                  placeholder="Filtrer"
                  value={this.state.filters[column.dataIndex]}
                  onChange={e => this.onSearchInput(e, column)}
                  onKeyDown={({ keyCode }) => {
                    if (keyCode === 13) {
                      this.toggleSearch(column);
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

  loadMore = (loading: boolean) => {
    if (this.props.onLoad && !loading) {
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
          loadMore={() => this.loadMore(loading)}
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
