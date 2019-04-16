import React, { ReactNode } from 'react';

interface Item {
  key: string,
  value: ReactNode
};

interface Props {
  items: Array<?Item>
};

/**
 * Renders a list of key/value info pairs, e.g.:
 * Location <strong>Oslo</strong>
 * Time <strong>Yesterday</strong>
 */
function InfoList({ items }: Props) {
  return (
    <ul>
      {items.filter(Boolean).map(({ key, value }) => (
        <li key={key}>
          <span style={{ marginRight: 5 }}>{key}</span>
          <strong>{value}</strong>
        </li>
      ))}
    </ul>
  );
}

export default InfoList;
