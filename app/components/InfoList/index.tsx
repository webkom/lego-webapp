import type { ReactNode } from 'react';

type Item = {
  key: string;
  keyNode?: ReactNode;
  value: ReactNode;
};
type Props = {
  items: Array<Item | null | undefined>;
  className?: string;
};

/**
 * Renders a list of key/value info pairs, e.g.:
 * Location <strong>Oslo</strong>
 * Time <strong>Yesterday</strong>
 */
function InfoList({ items, className }: Props) {
  return (
    <table className={className}>
      <tbody>
        {items.filter(Boolean).map(({ key, keyNode, value }) => (
          <tr key={key}>
            <td>
              {keyNode ?? (
                <span
                  style={{
                    marginRight: 5,
                  }}
                >
                  {key}
                </span>
              )}
            </td>
            <td>
              <strong>{value}</strong>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default InfoList;
