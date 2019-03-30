import React from 'react';

export const ItalicMark = props => <em property="italic">{props.children}</em>;

export const BoldMark = props => <strong>{props.children}</strong>;

export const UnderlineMark = props => <u>{props.children}</u>;

export const CodeMark = props => <code>{props.children}</code>;
