import React from 'react';

export default function joinValues(values) {
  if (values.length < 2) {
    return values[0] || '';
  }

  return (
    <span>
      {values.map((el, i) => (
        <span key={i}>
          {i > 0 && i !== values.length - 1 && ', '}
          {i === values.length - 1 && ' og '}
          {el}
        </span>
      ))}
    </span>
  );
}
