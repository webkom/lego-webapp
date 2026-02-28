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
import type { CSSProperties, ReactNode } from 'react';

export type Sort = {
  direction?: 'asc' | 'desc';
  dataIndex?: string;
  sorter?: boolean | ((arg0: any, arg1: any) => number);
};
export type Filters = Record<string, string[] | undefined>;
type QueryFilters = Record<string, string | undefined>;
export type IsShown = Record<string, boolean>;
export type ShowColumn = Record<string, number>;
export type EditPrimitive = string | number | boolean | null | undefined;
export type EditDraft<T = unknown> = Record<string, EditPrimitive> &
  Partial<Record<keyof T, EditPrimitive>>;
export type EditErrors = Record<string, string | undefined>;

export type RowActionContext<T extends { id: EntityId }> = {
  row: T;
  isEditing: boolean;
  isSaving: boolean;
  canSave: boolean;
  isLocked: boolean;
  isEditable: boolean;
  startEdit: () => void;
  cancelEdit: () => void;
  saveEdit: () => Promise<void>;
};

export type EditCellContext<T extends { id: EntityId }> = {
  row: T;
  column: ColumnProps<T>;
  value: EditPrimitive;
  draft: EditDraft<T>;
  setValue: (next: EditPrimitive) => void;
  error?: string;
  isSaving: boolean;
  onSaveRow: () => Promise<void>;
  onCancelRow: () => void;
};

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
  render?: (data: any, object: T, context?: RowActionContext<T>) => ReactNode;
  editable?: boolean;
  editRender?: (context: EditCellContext<T>) => ReactNode;
  columnChoices?: ColumnProps<T>[];
  visible?: boolean;
  centered?: boolean;
  padding?: number /** Affects only body columns */;
  maxWidth?: number;
};

export type TableEditableProps<T extends { id: EntityId }> = {
  enabled: boolean;
  mode?: 'row';
  actionColumnWidth?: string | number;
  isRowEditable?: (row: T) => boolean;
  getInitialDraft?: (row: T) => EditDraft<T>;
  validateDraft?: (draft: EditDraft<T>, row: T) => EditErrors | null;
  onSaveRow: (row: T, draft: EditDraft<T>) => Promise<void>;
  onCancelRow?: (row: T) => void;
  renderRowActions?: (context: RowActionContext<T>) => ReactNode;
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
  editable?: TableEditableProps<T>;
  editingRowId?: EntityId | null;
  onEditingRowChange?: (editingRowId: EntityId | null) => void;
  className?: string;
};

const isVisible = ({ visible = true }: ColumnProps) => visible;
const hasValidationErrors = (errors?: EditErrors | null) =>
  Boolean(errors && Object.values(errors).some(Boolean));

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
  filters: queryFilters,
  editable,
  editingRowId,
  onEditingRowChange,
}: TableProps<T>) => {
  const [sort, setSort] = useState<Sort>({});
  const [filters, setFilters] = useState<Filters>(
    queryFiltersToFilters(queryFilters),
  );
  const prevPropsFilters = useRef(queryFilters);

  useEffect(() => {
    if (!isEqual(queryFilters, prevPropsFilters.current)) {
      prevPropsFilters.current = queryFilters;
      setFilters(queryFiltersToFilters(queryFilters));
    }
  }, [queryFilters]);

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
  const [internalEditingRowId, setInternalEditingRowId] =
    useState<EntityId | null>(null);
  const [draftByRowId, setDraftByRowId] = useState<
    Record<string, EditDraft<T>>
  >({});
  const [errorsByRowId, setErrorsByRowId] = useState<
    Record<string, EditErrors>
  >({});
  const [savingRowId, setSavingRowId] = useState<EntityId | null>(null);

  useEffect(() => {
    const initialShowColumn = {};
    columns.forEach((column) => {
      if (column.columnChoices) {
        initialShowColumn[column.dataIndex] = 0;
      }
    });
    setShowColumn(initialShowColumn);
  }, [columns]);

  const visibleColumns = columns.filter(isVisible);
  const editableColumns = useMemo(
    () =>
      visibleColumns.filter((column) =>
        Boolean(column.editable && column.dataIndex),
      ),
    [visibleColumns],
  );
  const isEditable = Boolean(
    editable?.enabled && (editable.mode ?? 'row') === 'row',
  );
  const actionColumnWidth = editable?.actionColumnWidth ?? 150;
  const actionColumnStyle: CSSProperties = {
    width: actionColumnWidth,
    minWidth: actionColumnWidth,
  };
  const activeEditingRowId = editingRowId ?? internalEditingRowId;

  const getRowIdentifier = (row: T): EntityId =>
    (get(row, rowKey) as EntityId) ?? row.id;
  const getRowDraftKey = (rowId: EntityId) => String(rowId);

  const setActiveEditingRowId = (nextEditingRowId: EntityId | null) => {
    if (editingRowId === undefined) {
      setInternalEditingRowId(nextEditingRowId);
    }
    onEditingRowChange?.(nextEditingRowId);
  };

  const getInitialDraft = (row: T): EditDraft<T> => {
    if (editable?.getInitialDraft) {
      return editable.getInitialDraft(row);
    }

    return editableColumns.reduce((draft, column) => {
      draft[column.dataIndex] = get(row, column.dataIndex) as EditPrimitive;
      return draft;
    }, {} as EditDraft<T>);
  };

  const getDraftForRow = (row: T): EditDraft<T> => {
    const rowId = getRowIdentifier(row);
    const rowDraftKey = getRowDraftKey(rowId);
    return draftByRowId[rowDraftKey] ?? getInitialDraft(row);
  };

  const clearRowEditState = (rowId: EntityId) => {
    const rowDraftKey = getRowDraftKey(rowId);

    setDraftByRowId((prevDrafts) => {
      if (!(rowDraftKey in prevDrafts)) return prevDrafts;
      const nextDrafts = { ...prevDrafts };
      delete nextDrafts[rowDraftKey];
      return nextDrafts;
    });

    setErrorsByRowId((prevErrors) => {
      if (!(rowDraftKey in prevErrors)) return prevErrors;
      const nextErrors = { ...prevErrors };
      delete nextErrors[rowDraftKey];
      return nextErrors;
    });
  };

  const isRowEditable = (row: T): boolean =>
    (editable?.isRowEditable?.(row) ?? true) && isEditable;

  const getValidationErrors = (
    row: T,
    rowDraft: EditDraft<T>,
  ): EditErrors | null => {
    if (!editable?.validateDraft) return null;
    const validationErrors = editable.validateDraft(rowDraft, row);
    return hasValidationErrors(validationErrors) ? validationErrors : null;
  };

  const hasDraftChanges = (row: T, rowDraft: EditDraft<T>): boolean => {
    const initialDraft = getInitialDraft(row);
    const draftKeys = new Set([
      ...Object.keys(initialDraft),
      ...Object.keys(rowDraft),
    ]);
    return [...draftKeys].some(
      (draftKey) => initialDraft[draftKey] !== rowDraft[draftKey],
    );
  };

  const updateDraftValue = (
    row: T,
    dataIndex: string,
    value: EditPrimitive,
  ) => {
    const rowId = getRowIdentifier(row);
    const rowDraftKey = getRowDraftKey(rowId);

    setDraftByRowId((prevDrafts) => ({
      ...prevDrafts,
      [rowDraftKey]: {
        ...(prevDrafts[rowDraftKey] ?? getInitialDraft(row)),
        [dataIndex]: value,
      },
    }));

    setErrorsByRowId((prevErrors) => {
      if (!prevErrors[rowDraftKey]?.[dataIndex]) return prevErrors;
      return {
        ...prevErrors,
        [rowDraftKey]: {
          ...prevErrors[rowDraftKey],
          [dataIndex]: undefined,
        },
      };
    });
  };

  const startEditRow = (row: T) => {
    if (!isRowEditable(row)) return;

    const rowId = getRowIdentifier(row);
    const rowDraftKey = getRowDraftKey(rowId);
    const rowIsLocked =
      activeEditingRowId !== null && activeEditingRowId !== rowId;
    if (rowIsLocked) return;

    setDraftByRowId((prevDrafts) => ({
      ...prevDrafts,
      [rowDraftKey]: prevDrafts[rowDraftKey] ?? getInitialDraft(row),
    }));
    setErrorsByRowId((prevErrors) => {
      if (!(rowDraftKey in prevErrors)) return prevErrors;
      const nextErrors = { ...prevErrors };
      delete nextErrors[rowDraftKey];
      return nextErrors;
    });
    setActiveEditingRowId(rowId);
  };

  const cancelEditRow = (row: T) => {
    const rowId = getRowIdentifier(row);
    clearRowEditState(rowId);
    if (activeEditingRowId === rowId) {
      setActiveEditingRowId(null);
    }
    editable?.onCancelRow?.(row);
  };

  const saveEditRow = async (row: T) => {
    if (!editable?.onSaveRow || !isEditable) return;

    const rowId = getRowIdentifier(row);
    if (activeEditingRowId !== rowId) return;

    const rowDraftKey = getRowDraftKey(rowId);
    const rowDraft = getDraftForRow(row);
    const validationErrors = getValidationErrors(row, rowDraft);
    if (validationErrors) {
      setErrorsByRowId((prevErrors) => ({
        ...prevErrors,
        [rowDraftKey]: validationErrors,
      }));
      return;
    }

    setSavingRowId(rowId);
    try {
      await editable.onSaveRow(row, rowDraft);
      clearRowEditState(rowId);
      if (activeEditingRowId === rowId) {
        setActiveEditingRowId(null);
      }
    } catch {
      // Keep row in edit mode for retry after failed save.
    } finally {
      setSavingRowId((currentSavingRowId) =>
        currentSavingRowId === rowId ? null : currentSavingRowId,
      );
    }
  };

  useEffect(() => {
    if (activeEditingRowId === null) return;
    const editedRowExists = data.some(
      (row) => String(getRowIdentifier(row)) === String(activeEditingRowId),
    );
    if (!editedRowExists) {
      setActiveEditingRowId(null);
      setSavingRowId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, activeEditingRowId]);

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

  const getRowActionContext = (row: T): RowActionContext<T> => {
    const rowId = getRowIdentifier(row);
    const rowDraft = getDraftForRow(row);
    const validationErrors = getValidationErrors(row, rowDraft);
    const isEditing = activeEditingRowId === rowId;
    const isSaving = savingRowId === rowId;
    const rowIsEditable = isRowEditable(row);
    const isLocked = activeEditingRowId !== null && !isEditing;
    const canSave =
      isEditing &&
      rowIsEditable &&
      !isSaving &&
      hasDraftChanges(row, rowDraft) &&
      !hasValidationErrors(validationErrors);

    return {
      row,
      isEditing,
      isSaving,
      canSave,
      isLocked,
      isEditable: rowIsEditable,
      startEdit: () => startEditRow(row),
      cancelEdit: () => cancelEditRow(row),
      saveEdit: () => saveEditRow(row),
    };
  };

  const defaultRenderRowActions = (context: RowActionContext<T>) =>
    context.isEditing ? (
      <Flex justifyContent="center" alignItems="center" gap="var(--spacing-sm)">
        <Button
          size="small"
          onPress={() => void context.saveEdit()}
          disabled={!context.canSave}
        >
          Lagre
        </Button>
        <Button
          size="small"
          flat
          onPress={context.cancelEdit}
          disabled={context.isSaving}
        >
          Avbryt
        </Button>
      </Flex>
    ) : (
      <Button
        size="small"
        flat
        onPress={context.startEdit}
        disabled={context.isLocked || !context.isEditable}
      >
        Rediger
      </Button>
    );

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
              {isEditable && (
                <th
                  className={styles.actionHeader}
                  style={actionColumnStyle}
                  aria-label="Handlinger"
                />
              )}
            </tr>
          </thead>
          <InfiniteScroll
            element="tbody"
            hasMore={hasMore && !loading && (!collapseAfter || isExpanded)}
            loadMore={loadMore}
            threshold={50}
          >
            {displayData.map((data) => {
              const rowId = getRowIdentifier(data);
              const rowDraftKey = getRowDraftKey(rowId);
              const rowActionContext = getRowActionContext(data);

              return (
                <tr key={rowId}>
                  {visibleColumns.map((column, index) => (
                    <BodyCell
                      key={column.title + column.dataIndex}
                      column={column}
                      data={data}
                      index={index}
                      showColumn={showColumn}
                      rowActionContext={rowActionContext}
                      editableEnabled={isEditable}
                      isEditingRow={rowActionContext.isEditing}
                      isSavingRow={rowActionContext.isSaving}
                      draft={draftByRowId[rowDraftKey]}
                      errors={errorsByRowId[rowDraftKey]}
                      setDraftValue={(dataIndex, value) =>
                        updateDraftValue(data, dataIndex, value)
                      }
                      onSaveRow={() => rowActionContext.saveEdit()}
                      onCancelRow={rowActionContext.cancelEdit}
                    />
                  ))}
                  {isEditable && (
                    <td
                      className={cx(styles.td, styles.actionCell)}
                      style={actionColumnStyle}
                    >
                      {(editable?.renderRowActions ?? defaultRenderRowActions)(
                        rowActionContext,
                      )}
                    </td>
                  )}
                </tr>
              );
            })}
            {loading &&
              Array.from({ length: 10 }).map((_, index) => (
                <tr key={index}>
                  {Array.from({ length: visibleColumns.length }).map(
                    (_, index) => (
                      <td key={index} className={styles.loader} />
                    ),
                  )}
                  {isEditable && (
                    <td
                      className={cx(styles.loader, styles.actionCell)}
                      style={actionColumnStyle}
                    />
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
