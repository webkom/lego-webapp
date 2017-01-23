/* eslint-disable react/no-find-dom-node */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Editor, Raw } from 'slate'
import Replace from 'slate-auto-replace-text'

const plugins = [
  Replace('(c)', '©')
]

const schema = {
  nodes: {
    hr: props => <hr/>
  }
}

const initialState = Raw.deserialize({
  nodes: [
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    },
    {
      kind: 'block',
      type: 'hr',
      isVoid: true
    },
    {
      kind: 'block',
      type: 'paragraph',
      nodes: [
        {
          kind: 'text',
          text: 'A line of text in a paragraph.'
        }
      ]
    }
  ]
}, { terse: true });

class CustomEditor extends Component {
  state = {
    state: initialState
  };

  onChange = (state) => {
    this.setState({ state });
  }

  render = () => {
    return (
      <Editor
        state={this.state.state}
        onChange={this.onChange}
        plugins={plugins}
        schema={schema}
      />
    );
  }

}

export default CustomEditor;
