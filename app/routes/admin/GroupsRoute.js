// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import GroupPage from './components/GroupPage';
import { fetchAll } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';

function loadData(props) {
  props.fetchAll();
}

type Props = {
  groups: Array<any>,
  fetchAll: () => void
};

class GroupsRoute extends Component {
  props: Props;

  componentDidMount() {
    loadData(this.props);
  }

  render() {
    return <GroupPage {...this.props} />;
  }
}

function mapStateToProps(state) {
  return {
    groups: selectGroups(state)
  };
}

const mapDispatchToProps = { fetchAll };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupsRoute);
