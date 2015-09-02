import React, { Component, PropTypes } from 'react';

export default class SidebarBlock extends Component {

  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.array
  }

  static defaultProps = {
    title: 'No title'
  }

  render() {
    return (
      <div className='SidebarBlock'>
        <h2 className='SidebarBlock-title'>{this.props.title}</h2>
        <div className='SidebarBlock-content'>
          {this.props.children}
        </div>
      </div>
    );
  }
}
