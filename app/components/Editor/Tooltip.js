import React, { Component } from 'react';
import { BlockButtons, InlineButtons } from './constants';
import ReactDOM from 'react-dom';
import TooltipButton from './TooltipButton';
import styles from './Tooltip.css';

export type Props = {
  editorState: Object,
  toggleInlineStyle: () => void,
  toggleBlockType: () => void
};

export default class Tooltip extends Component {

  state = {
    position: null
  }

  componentDidMount = () => {
    this.calculatePositionOffset();
  }

  componentWillReceiveProps = () => {
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

  render() {
    const { editorState, toggleInlineStyle, toggleBlockType } = this.props;

    return (
      <div
        className={styles.tooltip}
        style={{ ...this.state.position }}
        onMouseDown={(e) => { e.preventDefault(); }}
      >

        {BlockButtons.map((button, key) =>
          <TooltipButton
            key={key}
            editorState={editorState}
            onClick={toggleBlockType}
            type='block'
            {...button}
          />
        )}

        <TooltipButton
          editorState={editorState}
          type='block'
          label='Link'
          style='link'
          icon='link'
          description='Hyperlink'
        />

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

      </div>
    );
  }
}
