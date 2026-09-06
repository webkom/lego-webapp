import { get } from 'lodash-es';
import { TextInput } from '~/components/Form';
import styles from './Table.module.css';
import type {
  ColumnProps,
  EditCellContext,
  EditDraft,
  EditErrors,
  EditPrimitive,
  RowActionContext,
  ShowColumn,
} from './index';
import type { EntityId } from '@reduxjs/toolkit';

type CellProps<T extends { id: EntityId }> = {
  column: ColumnProps<T>;
  data: T;
  index: number;
  showColumn: ShowColumn;
  rowActionContext: RowActionContext<T>;
  editableEnabled: boolean;
  isEditingRow: boolean;
  isSavingRow: boolean;
  draft?: EditDraft<T>;
  errors?: EditErrors;
  setDraftValue: (dataIndex: string, value: EditPrimitive) => void;
  onSaveRow: () => Promise<void>;
  onCancelRow: () => void;
};

const BodyCell = <T extends { id: EntityId }>({
  column,
  data,
  index,
  showColumn,
  rowActionContext,
  editableEnabled,
  isEditingRow,
  isSavingRow,
  draft,
  errors,
  setDraftValue,
  onSaveRow,
  onCancelRow,
}: CellProps<T>) => {
  if (column.columnChoices) {
    if (Object.keys(showColumn).length === 0) {
      return null;
    }
    const columnIndex: number = showColumn[column.dataIndex];
    column = column.columnChoices[columnIndex];
  }

  const cellData = get(data, column.dataIndex);

  const {
    render = (cellData) => cellData,
    dataIndex,
    centered = true,
  } = column;
  const isEditableCell = editableEnabled && isEditingRow && column.editable;
  const value = draft?.[dataIndex] ?? cellData;
  const inputValue = value === null || value === undefined ? '' : String(value);
  const fieldError = errors?.[dataIndex];

  const defaultEditor = (
    <TextInput
      value={inputValue}
      disabled={isSavingRow}
      aria-invalid={!!fieldError}
      onChange={(event) => setDraftValue(dataIndex, event.target.value)}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          event.preventDefault();
          onCancelRow();
          return;
        }
        if (event.key === 'Enter') {
          event.preventDefault();
          void onSaveRow();
        }
      }}
    />
  );

  const editCellContext: EditCellContext<T> = {
    row: data,
    column,
    value,
    draft: draft ?? ({} as EditDraft<T>),
    setValue: (nextValue) => setDraftValue(dataIndex, nextValue),
    error: fieldError,
    isSaving: isSavingRow,
    onSaveRow,
    onCancelRow,
  };

  return (
    <td
      key={`${dataIndex}-${index}-${data.id}`}
      style={{
        maxWidth: column.maxWidth,
        wordWrap: column.maxWidth ? 'break-word' : 'inherit',
        padding: column.padding,
        textAlign: centered ? 'center' : 'inherit',
      }}
      className={styles.td}
    >
      {isEditableCell ? (
        <div className={styles.editableCellContent}>
          {column.editRender?.(editCellContext) ?? defaultEditor}
        </div>
      ) : (
        render(cellData, data, rowActionContext)
      )}
    </td>
  );
};

export default BodyCell;
