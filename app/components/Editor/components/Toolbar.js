import React from 'react';
import styles from './Toolbar.css';

export const Toolbar = props => (
  <div>
    <button onClick={e => props.handler(e, 'bold')}>
      <i className="fa fa-bold" />
    </button>
    <button onPointerDown={e => props.handler(e, 'italic')}>
      <i className="fa fa-italic" />
    </button>
    <button onPointerDown={e => props.handler(e, 'bold')}>
      <i className="fa fa-list" />
    </button>
  </div>
);
