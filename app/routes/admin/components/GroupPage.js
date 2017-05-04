import './GroupAdmin.css';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import GroupTree from './GroupTree';

const tabNames = ['Settings', 'Members'];

const Tab = ({ base, name }) => (
  <Link
    className="GroupPage__tabs__tab"
    to={`${base}/${name.toLowerCase()}`}
    activeClassName="active"
  >
    {name}
  </Link>
);

const Tabs = ({ location }) => {
  const { pathname } = location;
  const baseParts = pathname.split('/');
  const base = baseParts.slice(0, baseParts.length - 1).join('/');

  return (
    <header className="GroupPage__tabs">
      {tabNames.map(name => <Tab key={name} base={base} name={name} />)}
    </header>
  );
};

export default class GroupPage extends Component {
  static propTypes = {
    groups: PropTypes.array,
    children: PropTypes.any
  };

  render() {
    const { groups } = this.props;

    return (
      <div className="u-container GroupPage">
        <section className="GroupPage__sidebar">
          <GroupTree groups={groups} />
        </section>

        <section className="GroupPage__main">
          <Tabs {...this.props} />
          {this.props.children}
        </section>
      </div>
    );
  }
}
