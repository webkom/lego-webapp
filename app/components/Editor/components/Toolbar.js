import React from 'react';
import styles from './Toolbar.css';

class ToolbarButton extends React.Component<Props, State> {
  handleClick(e) {
    this.props.handler(e);
  }

  render() {
    const { children, active } = this.props;

    const className = active ? styles.active : styles.inactive;

    return (
      <button
        className={className}
        onPointerDown={e => this.handleClick(e)}
        type="button"
      >
        {children}
      </button>
    );
  }
}

const LinkInput = () => {
  return (
    <div className={styles.linkInput}>
      <input type="link" />
    </div>
  );
};

export default class Toolbar extends React.Component<Props, State> {
  state = {
    insertLink: false,
    insertImage: false
  };

  checkActiveMark(type) {
    const { editor } = this.props;
    return editor.value.activeMarks.some(mark => mark.type === type);
  }

  checkActiveBlock(type) {
    const { editor } = this.props;
    const { document } = editor.value;

    if (type == 'ol_list' || type == 'ul_list') {
      if (!editor.value.startBlock) return false;
      const parentList = document.getClosest(
        editor.value.startBlock.key,
        a => a.type == 'ol_list' || a.type == 'ul_list'
      );

      return parentList && parentList.type === type;
    }

    return editor.value.blocks.some(block =>
      document.getClosest(block.key, a => a.type === type)
    );
  }

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

  insertImage(e) {
    e.preventDefault();
    //TODO add image modal and integrate uploader
  }

  insertLink(e) {
    e.preventDefault();
    this.setState({ insertingLink: !this.state.insertingLink });
  }

  render() {
    const { toggleBlock } = this.props;
    const { insertingLink } = this.state;

    return (
      <div className={styles.root}>
        <ToolbarButton
          active={this.checkActiveMark('bold')}
          handler={e => this.toggleMark(e, 'bold')}
        >
          <i className="fa fa-bold" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveMark('italic')}
          handler={e => this.toggleMark(e, 'italic')}
        >
          <i className="fa fa-italic" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveMark('underline')}
          handler={e => this.toggleMark(e, 'underline')}
        >
          <i className="fa fa-underline" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveMark('code')}
          handler={e => this.toggleMark(e, 'code')}
        >
          <i className="fa fa-code" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('ul_list')}
          handler={e => toggleBlock(e, 'ul_list')}
        >
          <i className="fa fa-list-ul" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('ol_list')}
          handler={e => toggleBlock(e, 'ol_list')}
        >
          <i className="fa fa-list-ol" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('code-block')}
          handler={e => toggleBlock(e, 'code-block')}
        >
          <i className="fa fa-file-code" />
        </ToolbarButton>
        <ToolbarButton handler={e => this.insertLink(e)}>
          {insertingLink && <LinkInput />}
          <i className="fa fa-link" />
        </ToolbarButton>
        <ToolbarButton handler={e => this.insertImage(e)}>
          <i className="fa fa-image" />
        </ToolbarButton>
      </div>
    );
  }
}
