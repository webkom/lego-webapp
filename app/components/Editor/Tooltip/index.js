/* eslint-disable no-mixed-operators */
import React, { Component } from 'react';
import Portal from 'react-portal';
import TooltipButton from './TooltipButton';
import { Inline, Blocks } from '../constants';
import styles from './Tooltip.css';

export type Props = {
 editorState: object,
 disableBlocks: boolean,
 setInlineStyle: (String) => void,
 setBlockType: (String) => void,
 wrapperElement: object
};


export default class Tooltip extends Component {

  state = {
    menu: null
  }

  props: Props

  componentDidMount = () => {
    this.updateMenu();
  }

  componentDidUpdate = () => {
    this.updateMenu();
  }

  onOpen = (portal) => {
    this.setState({ menu: portal.firstChild });
  }

  updateMenu = () => {
    const { editorState } = this.props;
    const { menu } = this.state;
    if (!menu) return;

    if (editorState.isBlurred || editorState.isCollapsed) {
      menu.style.display = 'none';
      // menu.removeAttribute('style');
      return;
    }

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    const rect = range.getBoundingClientRect();
    menu.style.display = 'initial';
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left + window.scrollX - menu.offsetWidth / 2 + rect.width / 2}px`;
  }

  hasStyle = (type) => {
    const { editorState } = this.props;
    return editorState.marks.some((mark) => mark.type === type);
  }

  hasBlock = (type) => {
    const { editorState } = this.props;
    return editorState.blocks.some((node) => node.type === type);
  }

  render() {
    const { setInlineStyle, setBlockType } = this.props;

    return (
      <Portal isOpened onOpen={this.onOpen}>
        <div className={styles.tooltip}>
          {
            [Inline.Bold, Inline.Italic, Inline.Underline, Inline.Code, Inline.Striketrough]
            .map((type) => (
              <TooltipButton
                key={type}
                type={type}
                icon={type}
                isActive={this.hasStyle(type)}
                onClick={setInlineStyle}
              />
            ))
          }
          {
            !this.props.disableBlocks &&
            <span className={styles.tooltipSeperator} />
          }
          {
            !this.props.disableBlocks &&
            [Blocks.H1, Blocks.H2, Blocks.Blockquote, Blocks.Cite, Blocks.UL, Blocks.OL]
            .map((type) => (
              <TooltipButton
                key={type}
                type={type}
                icon={type}
                isActive={this.hasBlock(type)}
                onClick={setBlockType}
              />
            ))
          }
        </div>
      </Portal>
    );
  }
}
