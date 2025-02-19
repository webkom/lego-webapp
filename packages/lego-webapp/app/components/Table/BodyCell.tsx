import { get } from 'lodash';
import styles from './Table.module.css';
import type { ColumnProps, ShowColumn } from '.';
import type { EntityId } from '@reduxjs/toolkit';

type CellProps<T> = {
  column: ColumnProps<T>;
  data: T;
  index: number;
  showColumn: ShowColumn;
};

const BodyCell = <T extends { id: EntityId }>({
  column,
  data,
  index,
  showColumn,
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
      {render(cellData, data)}
    </td>
  );
};

export default BodyCell;
