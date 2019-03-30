import React from 'react';
import styles from './Toolbar.css';
import ImageUpload from 'app/components/Upload/ImageUpload';
import type { DropFile } from 'app/components/Upload';

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

class LinkInput extends React.Component<Props, State> {
  state = {
    value: this.props.activeLink ? this.props.activeLink.data.get('url') : ''
  };

  onChange = e => {
    if (e.key == 'Enter') {
      this.submit(e);
      return;
    }
    this.setState({ value: e.target.value });
  };

  submit = e => {
    const { value } = this.state;
    this.props.toggleLinkInput(e);
    if (value == '') return;
    this.props.updateLink({ url: value });
  };

  componentDidMount() {
    this.input.focus();
  }

  render() {
    return (
      <div className={styles.linkInput}>
        <input
          type="link"
          placeholder="Link"
          ref={input => {
            this.input = input;
          }}
          onBlur={this.submit}
          onChange={this.onChange}
          value={this.state.value}
        />
        <button onClick={this.submit}>Lagre</button>
      </div>
    );
  }
}

export default class Toolbar extends React.Component<Props, State> {
  state = {
    insertingLink: false,
    insertingImage: false
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

    return editor.value.blocks.some(block => block.type === type);
  }

  checkActiveInline(type) {
    const { editor } = this.props;
    return editor.value.inlines.some(inline => inline.type === type);
  }

  setListType(e, type) {
    const { editor } = this.props;
    e.preventDefault();
    editor.setListType(type);
  }

  increaseIndent(e) {
    const { editor } = this.props;
    e.preventDefault();
    if (editor.isList()) editor.increaseListDepth();
    else editor.insertText('\t');
  }

  decreaseIndent(e) {
    const { editor } = this.props;
    e.preventDefault();
    if (editor.isList()) editor.decreaseListDepth();
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

  toggleLinkInput(e) {
    e.preventDefault();
    this.setState({ insertingLink: !this.state.insertingLink });
  }

  updateLink(data) {
    const { editor } = this.props;

    if (this.checkActiveInline('link')) {
      editor.setNodeByKey(this.getCurrentLink().key, { data, type: 'link' });
    } else {
      editor.wrapLink(data.url);
    }
  }

  getCurrentLink() {
    const { editor } = this.props;

    if (!this.checkActiveInline('link')) return;

    return editor.value.inlines.find(inline => inline.type == 'link');
  }

  insertImage(e) {
    e.preventDefault();
    this.setState({ insertingImage: true });
  }

  onClose() {
    this.setState({ insertingImage: false });
  }

  onSubmit(image) {
    const { editor } = this.props;
    editor.insertImage(image);
  }

  render() {
    const { toggleBlock } = this.props;
    const { insertingLink, insertingImage } = this.state;

    return (
      <div className={styles.root}>
        <ToolbarButton
          active={this.checkActiveBlock('h1')}
          handler={e => toggleBlock(e, 'h1')}
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('h4')}
          handler={e => toggleBlock(e, 'h4')}
        >
          H4
        </ToolbarButton>
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
          active={this.checkActiveBlock('code-block')}
          handler={e => toggleBlock(e, 'code-block')}
        >
          <i className="fa fa-file-code-o" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('ul_list')}
          handler={e => this.setListType(e, 'ul_list')}
        >
          <i className="fa fa-list-ul" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveBlock('ol_list')}
          handler={e => this.setListType(e, 'ol_list')}
        >
          <i className="fa fa-list-ol" />
        </ToolbarButton>
        <ToolbarButton handler={e => this.decreaseIndent(e)}>
          <i className="fa fa-outdent" />
        </ToolbarButton>
        <ToolbarButton handler={e => this.increaseIndent(e)}>
          <i className="fa fa-indent" />
        </ToolbarButton>
        <ToolbarButton
          active={this.checkActiveInline('link')}
          handler={e => this.toggleLinkInput(e)}
        >
          <i className="fa fa-link" />
        </ToolbarButton>
        {insertingLink && (
          <LinkInput
            active={this.checkActiveMark('link')}
            toggleLinkInput={e => this.toggleLinkInput(e)}
            updateLink={(...args) => this.updateLink(...args)}
            activeLink={this.getCurrentLink()}
          />
        )}
        <ToolbarButton handler={e => this.insertImage(e)}>
          <i className="fa fa-image" />
        </ToolbarButton>
        {insertingImage && (
          <ImageUpload
            onClose={() => this.onClose()}
            onSubmit={file => this.onSubmit(file)}
            inModal
            crop
          />
        )}
      </div>
    );
  }
}
