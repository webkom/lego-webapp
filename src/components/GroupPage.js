import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import GroupTree from './GroupTree';

const Tabs = ({ location }) => {
  const { pathname } = location;
  const baseParts = pathname.split('/');
  const base = baseParts.slice(0, baseParts.length - 1).join('/');

  return (
    <header>
      <Link to={`${base}/settings`} activeClassName='active'>Settings</Link>
      <Link to={`${base}/members`} activeClassName='active'>Members</Link>
    </header>
  );
};

export default class GroupPage extends Component {
  static propTypes = {
    groups: PropTypes.array,
    children: PropTypes.any
  }

  render() {
    const { groups } = this.props;

    return (
      <div className='u-container'>
        <Tabs {...this.props} />
        <GroupTree groups={groups}/>
        {this.props.children}
      </div>
    );
  }
}
