import React, { Component, PropTypes } from 'react';

export default class SidebarBlock extends Component {

  static propTypes = {
    title: PropTypes.string
  }

  static defaultProps = {
    title: 'No title'
  }

  render() {
    return (
      <div>
        <h2>{this.props.title}</h2>

        <div className='sidebar-block-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
