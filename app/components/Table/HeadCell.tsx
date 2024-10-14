import { Button, Flex, Icon } from '@webkom/lego-bricks';
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ListFilter,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import Dropdown from 'app/components/Dropdown';
import { TextInput, RadioButton, CheckBox } from 'app/components/Form';
import styles from './Table.css';
import type { ColumnProps, Filters, IsShown, ShowColumn, Sort } from '.';

type HeadCellProps = {
  column: ColumnProps;
  index: number;
  sort: Sort;
  filters: Filters;
  isShown: IsShown;
  showColumn?: ShowColumn;
  setSort: React.Dispatch<React.SetStateAction<Sort>>;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  setIsShown: React.Dispatch<React.SetStateAction<IsShown>>;
  setShowColumn: React.Dispatch<React.SetStateAction<ShowColumn>>;
};

const HeadCell: React.FC<HeadCellProps> = ({
  column,
  index,
  sort,
  filters,
  isShown,
  showColumn,
  setSort,
  setFilters,
  setIsShown,
  setShowColumn,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  const onSortInput = (dataIndex: any, sorter: any) => {
    const direction =
      sort.dataIndex === dataIndex && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({
      direction,
      dataIndex,
      sorter,
    });
  };

  const toggleFilter = (filterIndex: string, value: string) =>
    setFilters((prevFilters) => {
      const filter = prevFilters[filterIndex];
      const updatedFilters = { ...prevFilters };
      if (filter === undefined) {
        updatedFilters[filterIndex] = [value];
        return updatedFilters;
      }
      if (!column.filterOptions?.multiSelect) {
        return filter[0] === value
          ? { ...filters, [filterIndex]: undefined }
          : { ...filters, [filterIndex]: [value] };
      }
      updatedFilters[filterIndex] = filter.includes(value)
        ? filter.filter((filter) => filter !== value)
        : [...filter, value];
      return updatedFilters;
    });

  const toggleIsShown = (filterIndex: string) =>
    setIsShown({
      [filterIndex]: !isShown[filterIndex],
    });

  const onChooseColumnInput = (columnIndex: any, dataIndex: any) => {
    setShowColumn({
      [dataIndex]: columnIndex,
    });
  };

  let chosenProps = column;
  const columnChoices = column.columnChoices;
  const dataIndexColumnChoices = column.dataIndex;

  if (column.columnChoices) {
    const columnIndex = showColumn ? showColumn[dataIndexColumnChoices] : 0;
    chosenProps = { ...column, ...column.columnChoices[columnIndex] };
  }

  const {
    dataIndex,
    filterIndex = dataIndex,
    title,
    sorter,
    filter,
    filterOptions,
    search,
    filterMessage,
  } = chosenProps;

  useEffect(() => {
    search &&
      isShown[filterIndex] &&
      searchInputRef.current?.focus({ preventScroll: true });
  }, [search, isShown, filterIndex]);

  const sortIconNode =
    sort.dataIndex === dataIndex ? (
      sort.direction === 'asc' ? (
        <ChevronDown />
      ) : (
        <ChevronUp />
      )
    ) : (
      <ChevronsUpDown />
    );

  const iconIsActive =
    (!!filters[filterIndex] && String(filters[filterIndex])) ||
    isShown[filterIndex];

  return (
    <th key={`${dataIndex}-${index}`} style={{ maxWidth: column.maxWidth }}>
      <Flex alignItems="center" justifyContent="center" gap="var(--spacing-sm)">
        {sorter && (
          <Icon
            iconNode={sortIconNode}
            size={16}
            onPress={() => onSortInput(dataIndex, sorter)}
            className={styles.icon}
          />
        )}
        {title}
        {search && (
          <Dropdown
            show={isShown[filterIndex]}
            toggle={() => toggleIsShown(filterIndex)}
            triggerComponent={
              <Icon
                iconNode={<Search />}
                size={16}
                className={iconIsActive ? styles.iconActive : styles.icon}
              />
            }
            contentClassName={styles.overlay}
            rootClose
          >
            <TextInput
              inputRef={searchInputRef}
              removeBorder
              placeholder={filterMessage}
              value={filters[filterIndex]}
              onChange={(e) => toggleFilter(filterIndex, e.target.value)}
              onKeyDown={({ keyCode }) => {
                if (keyCode === 13) {
                  toggleIsShown(filterIndex);
                }
              }}
            />
          </Dropdown>
        )}
        {filter && (
          <Dropdown
            show={isShown[filterIndex]}
            toggle={() => toggleIsShown(filterIndex)}
            triggerComponent={
              <Icon
                iconNode={<ListFilter />}
                size={16}
                className={iconIsActive ? styles.iconActive : styles.icon}
              />
            }
            contentClassName={styles.checkbox}
            rootClose
          >
            {filter.map(({ label, value }) =>
              filterOptions?.multiSelect ? (
                <div
                  key={label}
                  onClick={() => toggleFilter(filterIndex, value)}
                >
                  <CheckBox
                    label={label}
                    checked={filters[filterIndex]?.includes(value)}
                  />
                </div>
              ) : (
                <div key={label}>
                  <RadioButton
                    id={filterIndex + value}
                    name={filterIndex}
                    label={label}
                    checked={filters[filterIndex]?.includes(value)}
                    onClick={() => toggleFilter(filterIndex, value)}
                  />
                </div>
              ),
            )}
            <Button
              flat
              onPress={() => {
                setFilters((prevFilters) => {
                  const updatedFilters = { ...prevFilters };
                  delete updatedFilters[filterIndex];
                  return updatedFilters;
                });
                toggleIsShown(filterIndex);
              }}
            >
              Nullstill
            </Button>
          </Dropdown>
        )}
        {columnChoices && (
          <Dropdown
            show={isShown[filterIndex]}
            toggle={() => toggleIsShown(filterIndex)}
            triggerComponent={
              <Icon
                iconNode={<SlidersHorizontal />}
                size={16}
                className={iconIsActive ? styles.iconActive : styles.icon}
              />
            }
            contentClassName={styles.overlay}
            rootClose
          >
            {showColumn &&
              columnChoices.map(({ title }, index) => (
                <div key={title}>
                  <RadioButton
                    id={dataIndexColumnChoices + index}
                    name={dataIndexColumnChoices}
                    value={index}
                    label={title}
                    checked={showColumn[dataIndexColumnChoices] === index}
                    onChange={() => null}
                    onClick={() => {
                      onChooseColumnInput(index, dataIndexColumnChoices);
                    }}
                  />
                </div>
              ))}
          </Dropdown>
        )}
      </Flex>
    </th>
  );
};

export default HeadCell;
