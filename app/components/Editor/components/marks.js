import React from 'react';

export const ItalicMark = props => <em property="italic">{props.children}</em>;

export const BoldMark = props => <strong>{props.children}</strong>;

export const UnderlineMark = props => <u>{props.children}</u>;

export const CodeMark = props => (
  <code style={{ backgrondColor: '#ddd' }}>{props.children}</code>
);

export const LinkMark = props => (
  <a href={props.linkAddress}>{props.children}</a>
);
