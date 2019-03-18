import React from 'react';
import styles from './Toolbar.css';

export default class Toolbar extends React.Component<Props, State> {
  toggleMark(e, type) {
    e.preventDefault();
    const { editor } = this.props;

    editor.toggleMark(type);
  }

  toggleBlock(e, type) {
    e.preventDefault();
    const { editor } = this.props;

    editor.setBlocks(type);
  }

  render() {
    return (
      <div>
        <button onClick={e => this.toggleMark(e, 'bold')}>
          <i className="fa fa-bold" />
        </button>
        <button onPointerDown={e => this.toggleMark(e, 'italic')}>
          <i className="fa fa-italic" />
        </button>
        <button onPointerDown={e => this.toggleBlock(e, 'ul_list')}>
          <i className="fa fa-list" />
        </button>
      </div>
    );
  }
}
