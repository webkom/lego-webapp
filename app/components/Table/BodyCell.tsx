import { get } from 'lodash';
import type { ColumnProps, ShowColumn, TableData } from '.';

type CellProps = {
  column: ColumnProps;
  data: TableData;
  index: number;
  showColumn: ShowColumn;
};

const BodyCell: React.FC<CellProps> = ({ column, data, index, showColumn }) => {
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

export default BodyCell;
