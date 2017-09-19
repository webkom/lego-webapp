// @flow

import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { resetKeyGenerator } from 'slate';
import Html from 'slate-html-serializer';
import { schema } from './constants';
import HoverMenu from './HoverMenu';
import rules from './serializer';
import styles from './Editor.css';

const parseHtml =
  typeof DOMParser === 'undefined' && require('parse5').parseFragment;
const htmlArgs = { rules };
if (parseHtml) htmlArgs.parseHtml = parseHtml;
const html = new Html(htmlArgs);

/*
- lists (ol, ul)
- block and inline styling
- "---" for hr
- image
*/

type Props = {
  value?: 'string',
  onChange: string => void
};

type State = {
  value: 'string',
  menu?: ReactElement
};

class CustomEditor extends Component {
  props: Props;

  state: State;

  constructor(props) {
    super(props);
    resetKeyGenerator();

    this.state = {
      state: html.deserialize(this.props.value || '<p></p>'),
      schema
    };
  }

  componentDidMount = () => {
    this.updateHoverMenu();
  };

  componentDidUpdate = () => {
    this.updateHoverMenu();
  };

  onChange = ({ state }) => {
    if (state.document != this.state.state.document) {
      this.props.onChange(html.serialize(state));
    }

    this.setState({ state });
  };

  onClickMark = (e, type) => {
    e.preventDefault();
    const change = this.state.state.change().toggleMark(type);
    this.onChange(change);
  };

  onOpen = portal => {
    this.setState({ menu: portal.firstChild });
  };

  updateHoverMenu = () => {
    const { menu, state } = this.state;
    if (!menu) return;

    if (state.isBlurred || state.isEmpty) {
      menu.removeAttribute('style');
      return;
    }

    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    menu.style.opacity = 1;
    menu.style.top = `${rect.top + window.scrollY - menu.offsetHeight}px`;
    menu.style.left = `${rect.left +
      window.scrollX -
      menu.offsetWidth / 2 +
      rect.width / 2}px`;
  };

  render() {
    const { state } = this.state;

    return (
      <div>
        <div className={styles.editor}>
          <HoverMenu
            onOpen={this.onOpen}
            state={state}
            onClickMark={this.onClickMark}
          />
          <Editor schema={schema} state={state} onChange={this.onChange} />
        </div>
      </div>
    );
  }
}

export default CustomEditor;
