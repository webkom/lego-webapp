import React, { Component } from 'react';
import { Entity } from 'draft-js';
import { BlockButtons, InlineButtons, Entity as EntityConstants } from '../constants';
import ReactDOM from 'react-dom';
import TooltipButton from './TooltipButton';
import styles from './Tooltip.css';
import Icon from 'app/components/Icon';

const Keyboard = {
  ENTER: 13,
  ESC: 13
};

export type Props = {
  editorState: Object,
  toggleLink: () => void,
  toggleInlineStyle: () => void,
  toggleBlockType: () => void
};

export default class Tooltip extends Component {

  state = {
    position: null,
    showUrlInput: false,
    urlInputValue: ''
  }

  componentDidMount = () => {
    this.calculatePositionOffset();
  }

  componentWillReceiveProps = () => {
    console.log('new');
    this.calculatePositionOffset();
  }

  calculatePositionOffset = () => {
    const selection = window.getSelection();
    const position = {};
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const selectionRect = range.getBoundingClientRect();
      const elementRect = ReactDOM
        .findDOMNode(this.props.editorRoot).getBoundingClientRect();

      position.top = selectionRect.top - elementRect.top - 60;
      const right = elementRect.right - selectionRect.right;
      const left = selectionRect.left - elementRect.left;

      // if center of tooltip is on left side of window
      if (left < window.innerWidth / 2) {
        position.left = left;
      } else {
        position.right = right;
      }
      this.setState({ position });
    }
  }

  setLink = (url) => {
    const { editorState, toggleLink } = this.props;
    const selection = editorState.getSelection();
    let entityKey = null;
    let newUrl = url;
    if (url !== '') {
      if (url.indexOf('@') >= 0) {
        newUrl = `mailto:${newUrl}`;
      } else if (url.indexOf('http') === -1) {
        newUrl = `http://${newUrl}`;
      }
      entityKey = Entity.create(EntityConstants.LINK, 'IMMUTABLE ', { url: newUrl });
    }
    toggleLink(selection, entityKey);
  }

  onChange = (e) => {
    this.setState({ urlInputValue: e.target.value });
  }

  handleBlur = (e) => {
    this.setState({
      showUrlInput: false,
      urlInputValue: ''
    });
  }

  handleKeyDown = (e) => {
    switch (e.which) {
      case Keyboard.ENTER:
        this.setLink(this.state.urlInputValue);
        this.setState({
          showUrlInput: false,
          urlInputValue: ''
        });
        break;
    }
  }

  render() {
    const { editorState, toggleInlineStyle, toggleBlockType } = this.props;
    console.log(this.state);
    return (
      <div
        className={styles.tooltip}
        style={{ ...this.state.position }}
        onMouseDown={(e) => { e.preventDefault(); }}
      >

        {this.state.showUrlInput ?

          <div>

            <input
              autoFocus
              type='text'
              className={styles.urlInput}
              placeholder='Paste or type a link'
              onChange={this.onChange}
              onKeyDown={this.handleKeyDown}
              onBlur={this.handleBlur}
              value={this.state.urlInputValue}
            />
            <Icon
              name='close'
              className={styles.urlInputIcon}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                this.setState({ showUrlInput: false }, this.props.focus());
              }}
            />

          </div> : <div>

          {BlockButtons.map((button, key) =>
            <TooltipButton
              key={key}
              editorState={editorState}
              onClick={toggleBlockType}
              type='block'
              {...button}
            />
          )}

          <span className={styles.tooltipSeperator} />

          {InlineButtons.map((button, key) =>
            <TooltipButton
              key={key}
              onClick={toggleInlineStyle}
              editorState={editorState}
              type='inline'
              {...button}
            />
          )}

          <TooltipButton
            type='block'
            editorState={editorState}
            label='Link'
            style='link'
            icon='link'
            onClick={() => { this.setState({ showUrlInput: true }); }}
            description='Hyperlink'
          />

          </div>
        }

      </div>
    );
  }
}
