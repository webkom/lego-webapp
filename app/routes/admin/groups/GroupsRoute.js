// @flow

import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';
import GroupPage from './components/GroupPage';

const mapStateToProps = (state, props) => {
  const groups = selectGroups(state);
  const { match } = props;
  return {
    groups,
    match,
  };
};

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, {})
)(GroupPage);
