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
    const { toggleBlock } = this.props;
    return (
      <div>
        <button type="button" onMouseDown={e => this.toggleMark(e, 'bold')}>
          <i className="fa fa-bold" />
        </button>
        <button type="button" onMouseDown={e => this.toggleMark(e, 'italic')}>
          <i className="fa fa-italic" />
        </button>
        <button type="button" onPointerDown={e => toggleBlock(e, 'ul_list')}>
          <i className="fa fa-list-ul" />
        </button>
        <button type="button" onPointerDown={e => toggleBlock(e, 'ol_list')}>
          <i className="fa fa-list-ol" />
        </button>
        <button type="button" onPointerDown={e => toggleBlock(e, 'code')}>
          <i className="fa fa-code" />
        </button>
      </div>
    );
  }
}
